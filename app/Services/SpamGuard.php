<?php

namespace App\Services;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

/**
 * Lightweight server-side spam gating for the public contact form and
 * user registration. No third-party CAPTCHA services involved.
 *
 * Protections:
 *  - Honeypot field ("website") that real users never see or fill.
 *  - Minimum-time token: an encrypted timestamp rendered into the form;
 *    submissions completed in under a few seconds are rejected.
 *  - Per-IP rate limiting (uses Laravel's RateLimiter, backed by the
 *    configured cache store - "database" in production, so limits survive
 *    process restarts and are shared across workers).
 *  - Conservative content heuristics for the contact form.
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

        // A URL with little or no accompanying text is link spam.
        if (preg_match('~(https?://|www\.)~i', $message) && mb_strlen(trim($message)) < 40) {
            return 'short message containing URL';
        }

        return null;
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
