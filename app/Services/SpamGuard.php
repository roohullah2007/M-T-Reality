<?php

namespace App\Services;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Server-side spam gating for every public (unauthenticated) form.
 *
 * Protections:
 *  - Honeypot field ("website") that real users never see or fill.
 *  - Minimum-time token: an encrypted timestamp rendered into the form;
 *    submissions completed in under a few seconds are rejected.
 *  - Per-IP rate limiting (uses Laravel's RateLimiter, backed by the
 *    configured cache store - "database" in production, so limits survive
 *    process restarts and are shared across workers).
 *  - Google reCAPTCHA v2, when RECAPTCHA_SECRET_KEY is configured.
 *  - Conservative content heuristics (gibberish text, link spam, dotted
 *    gmail aliases).
 *
 * Controllers should normally call the single guard() entry point rather
 * than the individual checks.
 */
class SpamGuard
{
    /**
     * Name of the hidden honeypot input rendered in the forms.
     */
    public const HONEYPOT_FIELD = 'website';

    /**
     * Name of the hidden field carrying the encrypted render timestamp.
     */
    public const TOKEN_FIELD = 'form_token';

    /**
     * Minimum seconds between the form being rendered and submitted.
     */
    public const MIN_SECONDS = 3;

    /**
     * Word length at or above which the randomness heuristics apply.
     */
    public const RANDOM_MIN_LENGTH = 10;

    /**
     * Minimum share of vowels ("y" included) in a long word.
     */
    public const RANDOM_MIN_VOWEL_RATIO = 0.25;

    /**
     * Lower-to-upper case flips within one word that mark it as a token.
     */
    public const RANDOM_MAX_CASE_FLIPS = 3;

    /**
     * Name of the field Google's reCAPTCHA v2 widget writes its token into.
     */
    public const RECAPTCHA_FIELD = 'g-recaptcha-response';

    /**
     * Google's token verification endpoint.
     */
    public const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

    /**
     * Seconds to wait on Google before giving up.
     */
    public const RECAPTCHA_TIMEOUT = 5;

    /**
     * Whether the "unconfigured" warning has already been logged this request.
     */
    protected static bool $recaptchaWarned = false;

    /**
     * Generate the encrypted timestamp token to render into a form.
     */
    public static function token(): string
    {
        return Crypt::encryptString((string) now()->timestamp);
    }

    /**
     * The single entry point for public form submissions: honeypot +
     * minimum-time token, per-IP hourly rate limit, and reCAPTCHA.
     *
     * Returns null when the request may proceed, otherwise a short reason
     * string (for server-side logging only - never shown to the client).
     *
     * The caller is responsible for calling recordAttempt() once it decides
     * to actually process the submission.
     */
    public static function guard(Request $request, string $action, int $maxPerHour): ?string
    {
        if ($reason = self::botCheck($request)) {
            return $reason;
        }

        if (self::tooManyAttempts($request, $action, $maxPerHour)) {
            return 'rate limit exceeded';
        }

        return self::recaptchaCheck($request);
    }

    /**
     * Run the honeypot + minimum-time checks.
     *
     * Returns null when the request looks human, otherwise a short reason
     * string (for server-side logging only - never shown to the client).
     */
    public static function botCheck(Request $request): ?string
    {
        // Honeypot: hidden via CSS, so any value here came from a bot.
        if (filled($request->input(self::HONEYPOT_FIELD))) {
            return 'honeypot filled';
        }

        $token = $request->input(self::TOKEN_FIELD);

        if (!is_string($token) || $token === '') {
            return 'missing form token';
        }

        try {
            $issuedAt = (int) Crypt::decryptString($token);
        } catch (DecryptException) {
            return 'invalid form token';
        }

        if (now()->timestamp - $issuedAt < self::MIN_SECONDS) {
            return 'submitted too fast (' . (now()->timestamp - $issuedAt) . 's)';
        }

        return null;
    }

    /**
     * The reCAPTCHA v2 site key to render into a form, or null when the
     * integration is not configured (local dev / test).
     */
    public static function recaptchaSiteKey(): ?string
    {
        $key = config('services.recaptcha.site_key');

        return filled($key) ? (string) $key : null;
    }

    /**
     * Whether reCAPTCHA verification is switched on. Verification is driven by
     * the SECRET key only - without it we have no way to validate a token, so
     * we must not pretend to.
     */
    public static function recaptchaConfigured(): bool
    {
        return filled(config('services.recaptcha.secret_key'));
    }

    /**
     * Verify the reCAPTCHA v2 token on an incoming request.
     *
     * Returns null when the request may proceed, otherwise a short reason
     * string (server-side logging only).
     *
     * Graceful degradation: when no secret key is configured the check is
     * skipped and a warning is logged once per request, so local development
     * and the test suite keep working. As soon as the secret IS configured a
     * valid token becomes mandatory.
     */
    public static function recaptchaCheck(Request $request): ?string
    {
        if (! self::recaptchaConfigured()) {
            if (! self::$recaptchaWarned) {
                self::$recaptchaWarned = true;
                Log::warning('reCAPTCHA is not configured (RECAPTCHA_SECRET_KEY is empty); skipping verification.');
            }

            return null;
        }

        $token = $request->input(self::RECAPTCHA_FIELD);

        if (! is_string($token) || $token === '') {
            return 'missing recaptcha token';
        }

        try {
            $response = Http::asForm()
                ->timeout(self::RECAPTCHA_TIMEOUT)
                ->post(self::RECAPTCHA_VERIFY_URL, [
                    'secret' => (string) config('services.recaptcha.secret_key'),
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);
        } catch (\Throwable $e) {
            // Fail closed: an unreachable Google is not a licence to register.
            return 'recaptcha verification request failed: ' . $e->getMessage();
        }

        if (! $response->successful()) {
            return 'recaptcha verification returned HTTP ' . $response->status();
        }

        if ($response->json('success') !== true) {
            $errors = $response->json('error-codes') ?? [];

            return 'recaptcha rejected the token' . ($errors ? ' (' . implode(', ', (array) $errors) . ')' : '');
        }

        return null;
    }

    /**
     * Whether this IP has exhausted its hourly budget for the given action.
     * Does NOT consume an attempt - call recordAttempt() once the request
     * is actually accepted for processing.
     */
    public static function tooManyAttempts(Request $request, string $action, int $maxPerHour): bool
    {
        return RateLimiter::tooManyAttempts(self::limiterKey($request, $action), $maxPerHour);
    }

    /**
     * Consume one rate-limit attempt for this IP (decays after an hour).
     */
    public static function recordAttempt(Request $request, string $action): void
    {
        RateLimiter::hit(self::limiterKey($request, $action), 3600);
    }

    protected static function limiterKey(Request $request, string $action): string
    {
        return 'spam-guard:' . $action . ':' . ($request->ip() ?? 'unknown');
    }

    /**
     * Conservative content heuristics for the contact form.
     * Returns null when the content looks legitimate, otherwise a reason.
     */
    public static function contactContentCheck(string $name, string $email, string $message): ?string
    {
        // Dotted-gmail alias trick: e.g. "m.abe.l.s.y.0.11.6@gmail.com".
        $local = strstr($email, '@', true) ?: '';
        if (substr_count($local, '.') >= 4) {
            return 'email local part has 4+ dots';
        }

        // Random-gibberish names essentially never lack vowels entirely.
        // Only applied to names with at least 5 letters, and "y" counts as
        // a vowel, to stay conservative for real names.
        $letters = preg_replace('/[^a-z]/i', '', $name) ?? '';
        if (strlen($letters) >= 5 && !preg_match('/[aeiouy]/i', $letters)) {
            return 'name contains no vowels';
        }

        if (self::looksRandom($name)) {
            return 'name looks machine-generated';
        }

        // A URL with little or no accompanying text is link spam.
        if (preg_match('~(https?://|www\.)~i', $message) && mb_strlen(trim($message)) < 40) {
            return 'short message containing URL';
        }

        return null;
    }

    /**
     * Whether any of the given values contains a machine-generated looking
     * word. Bots that fill every text field with a random token (the pattern
     * behind the MLS change form spam) are caught here even when they solve
     * or bypass the other checks.
     *
     * Returns the reason string naming the offending field, or null.
     *
     * @param  array<string, string|null>  $fields  label => value
     */
    public static function gibberishCheck(array $fields): ?string
    {
        foreach ($fields as $label => $value) {
            if (is_string($value) && self::looksRandom($value)) {
                return "{$label} looks machine-generated";
            }
        }

        return null;
    }

    /**
     * Heuristic for "this is a random string, not something a person typed".
     *
     * A word is suspicious when it is long AND either has an implausibly low
     * vowel ratio ("y" counts as a vowel, so real-world consonant-heavy names
     * still pass) or switches from lower- to upper-case repeatedly, the way
     * base62 random tokens do. Both signals must clear a length floor, which
     * keeps ordinary names, street names and abbreviations safe.
     */
    public static function looksRandom(string $value): bool
    {
        foreach (preg_split('/\s+/', trim($value), -1, PREG_SPLIT_NO_EMPTY) ?: [] as $word) {
            $letters = preg_replace('/[^a-z]/i', '', $word) ?? '';
            $length = strlen($letters);

            if ($length < self::RANDOM_MIN_LENGTH) {
                continue;
            }

            $vowels = preg_match_all('/[aeiouy]/i', $letters);

            if ($vowels / $length < self::RANDOM_MIN_VOWEL_RATIO) {
                return true;
            }

            // "aBcDeF" style case flipping - vanishingly rare in real words
            // (McDonald, iPhone and MacBook each flip once).
            if (preg_match_all('/[a-z][A-Z]/', $letters) >= self::RANDOM_MAX_CASE_FLIPS) {
                return true;
            }
        }

        return false;
    }

    /**
     * Normalize an email for duplicate detection. Gmail ignores dots and
     * anything after "+" in the local part, so spam bots rotate through
     * dotted aliases of a single inbox.
     */
    public static function normalizeEmail(string $email): string
    {
        $email = strtolower(trim($email));

        $at = strrpos($email, '@');
        if ($at === false) {
            return $email;
        }

        $local = substr($email, 0, $at);
        $domain = substr($email, $at + 1);

        if (in_array($domain, ['gmail.com', 'googlemail.com'], true)) {
            $local = str_replace('.', '', $local);
            $plus = strpos($local, '+');
            if ($plus !== false) {
                $local = substr($local, 0, $plus);
            }
        }

        return $local . '@' . $domain;
    }

    /**
     * Whether this (normalized) email already submitted several records of the
     * given kind in the last 24 hours. Volume is low enough to compare in PHP,
     * which lets us normalize dotted gmail aliases that SQL cannot match.
     *
     * @param  \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder  $query
     *         a query over a table with "email" and "created_at" columns
     */
    public static function isRepeatSender($query, string $email, int $max = 3): bool
    {
        $normalized = self::normalizeEmail($email);

        $recent = $query->where('created_at', '>=', now()->subDay())
            ->pluck('email')
            ->filter(fn ($existing) => is_string($existing) && self::normalizeEmail($existing) === $normalized)
            ->count();

        return $recent >= $max;
    }

    /**
     * Log a blocked submission server-side (bots receive a generic response).
     */
    public static function logBlock(string $endpoint, Request $request, string $reason): void
    {
        Log::warning("SpamGuard blocked {$endpoint} submission: {$reason}", [
            'ip' => $request->ip(),
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'user_agent' => $request->userAgent(),
        ]);
    }
}
