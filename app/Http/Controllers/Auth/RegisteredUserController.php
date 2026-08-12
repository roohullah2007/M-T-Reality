<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCode;
use App\Mail\NewUserRegisteredToAdmin;
use App\Mail\WelcomeEmail;
use App\Models\User;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Maximum registrations per IP per hour.
     */
    protected const MAX_PER_HOUR = 2;

    /**
     * Session key holding the address of an account that still needs to be
     * verified, so a logged-out user can finish verifying (see the login flow).
     */
    public const PENDING_EMAIL_KEY = 'pending_verification_email';

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // The form token and reCAPTCHA site key come from the shared
        // "spamGuard" Inertia prop (see HandleInertiaRequests).
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Bot gating (honeypot + minimum-time token + per-IP rate limit).
        // All blocks return the same generic error so bots get no signal
        // about which check failed.
        //
        // Deliberately NOT SpamGuard::guard(): the checks run in the same
        // order, but registration has to answer a failed reCAPTCHA differently
        // from the silent checks, and guard() folds every outcome into one
        // log-only reason string that we would have to sniff to tell apart.
        if ($reason = SpamGuard::botCheck($request)) {
            SpamGuard::logBlock('registration', $request, $reason);

            return $this->genericFailure();
        }

        if (SpamGuard::tooManyAttempts($request, 'register', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('registration', $request, 'rate limit exceeded');

            return $this->genericFailure();
        }

        // Google reCAPTCHA v2. Unlike the checks above this one gets a specific
        // error: a human who simply forgot to tick the box needs to be told.
        // No-op when RECAPTCHA_SECRET_KEY is unset (see SpamGuard).
        if ($reason = SpamGuard::recaptchaCheck($request)) {
            SpamGuard::logBlock('registration', $request, $reason);

            throw ValidationException::withMessages([
                SpamGuard::RECAPTCHA_FIELD => 'Please confirm you are not a robot and try again.',
            ]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:buyer,seller',
        ]);

        SpamGuard::recordAttempt($request, 'register');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->user_type,
        ]);

        event(new Registered($user));

        // Generate and send verification code
        $code = $user->generateVerificationCode();

        try {
            Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code email: ' . $e->getMessage());
        }

        // Notify the admin. A delivery failure here is the admin's problem to
        // chase in the logs, not a reason to fail a registration that has
        // already been committed. The pause keeps the two sends inside
        // Resend's per-second limit.
        sleep(2);

        try {
            EmailService::sendToAdmin(new NewUserRegisteredToAdmin($user));
        } catch (\Throwable $e) {
            Log::error('Failed to send new-registration admin notification: ' . $e->getMessage());
        }

        Auth::login($user);

        // Redirect to verification page instead of dashboard
        return redirect()->route('verification.code');
    }

    /**
     * Generic response for blocked (bot-like) registration attempts.
     * Deliberately vague - it must not reveal which check failed.
     */
    protected function genericFailure(): RedirectResponse
    {
        return back()->withErrors([
            'email' => 'Registration could not be completed. Please try again in a little while.',
        ]);
    }

    /**
     * Show the verification code entry page.
     */
    public function showVerifyCode(): Response|RedirectResponse
    {
        $user = Auth::user();

        // If already verified, go to dashboard
        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Auth/VerifyCode', [
            'email' => $user->email,
            'guest' => false,
        ]);
    }

    /**
     * Show the verification code entry page to a *logged-out* user.
     *
     * Login is refused while an address is unverified, so without this page a
     * user whose session has expired could never finish verifying. The address
     * comes from the session (set by the blocked login attempt or by a resend),
     * never from user input, so this cannot be used to probe for accounts.
     */
    public function showGuestVerifyCode(Request $request): Response|RedirectResponse
    {
        $email = $request->session()->get(self::PENDING_EMAIL_KEY);

        if (! $email) {
            return redirect()->route('login');
        }

        // Keep it around for the POST that follows.
        $request->session()->keep(self::PENDING_EMAIL_KEY);

        return Inertia::render('Auth/VerifyCode', [
            'email' => $email,
            'guest' => true,
        ]);
    }

    /**
     * Verify a code entered by a logged-out user, then sign them in.
     */
    public function verifyGuestCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = $request->session()->get(self::PENDING_EMAIL_KEY);
        $user = $email ? User::where('email', $email)->first() : null;

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Your verification session expired. Please sign in again.',
            ]);
        }

        if ($user->email_verified_at) {
            $request->session()->forget(self::PENDING_EMAIL_KEY);

            return redirect()->route('login')->with('status', 'Your email is already verified. Please sign in.');
        }

        if (! $user->isVerificationCodeValid($request->code)) {
            $request->session()->keep(self::PENDING_EMAIL_KEY);

            return back()->withErrors([
                'code' => 'Invalid or expired verification code. Please try again or request a new code.',
            ]);
        }

        $user->markEmailAsVerified();

        EmailService::sendToUser($user->email, new WelcomeEmail($user));

        $request->session()->forget(self::PENDING_EMAIL_KEY);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route($user->isAdmin() ? 'admin.dashboard' : 'dashboard')
            ->with('success', 'Email verified successfully! Welcome to ' . config('app.name') . '.');
    }

    /**
     * Resend a verification code to an address supplied by a logged-out user
     * (the login page offers this after refusing an unverified account).
     *
     * Always reports the same thing so this cannot be used to enumerate
     * registered addresses. Throttled at the route.
     */
    public function resendPublicCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && ! $user->email_verified_at) {
            $code = $user->generateVerificationCode();

            try {
                Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
            } catch (\Exception $e) {
                Log::error('Failed to send verification code email: ' . $e->getMessage());
            }

            $request->session()->put(self::PENDING_EMAIL_KEY, $user->email);

            return redirect()->route('verification.code.guest');
        }

        return back()->with('status', 'If that address needs verifying, a new code is on its way.');
    }

    /**
     * Verify the code entered by the user.
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = Auth::user();

        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        if (!$user->isVerificationCodeValid($request->code)) {
            return back()->withErrors([
                'code' => 'Invalid or expired verification code. Please try again or request a new code.',
            ]);
        }

        // Mark email as verified
        $user->markEmailAsVerified();

        // Send welcome email after verification (EmailService checks the
        // email_notifications setting, logs failures, and never throws)
        EmailService::sendToUser($user->email, new WelcomeEmail($user));

        return redirect()->route('dashboard')->with('success', 'Email verified successfully! Welcome to ' . config('app.name') . '.');
    }

    /**
     * Resend the verification code.
     */
    public function resendCode(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->email_verified_at) {
            return redirect()->route('dashboard');
        }

        // Generate new code
        $code = $user->generateVerificationCode();

        try {
            Mail::to($user->email)->send(new EmailVerificationCode($user, $code));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification code email: ' . $e->getMessage());
            return back()->withErrors(['code' => 'Failed to send verification code. Please try again.']);
        }

        return back()->with('success', 'A new verification code has been sent to your email.');
    }
}
