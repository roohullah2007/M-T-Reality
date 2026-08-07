<?php

namespace App\Http\Requests\Auth;

use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $this->ensureEmailIsVerified();

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Refuse to hand out a session to an account whose email is not verified.
     *
     * The credentials were correct, so Auth::attempt() has already logged the
     * user in - we undo that completely (logout + session invalidation) rather
     * than leaving a half-authenticated session lying around.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function ensureEmailIsVerified(): void
    {
        $user = Auth::user();

        if (! $user instanceof MustVerifyEmail || $user->hasVerifiedEmail()) {
            return;
        }

        $email = $user->email;

        Auth::guard('web')->logout();
        $this->session()->invalidate();
        $this->session()->regenerateToken();

        // Remember who was trying to get in so the login page can offer to
        // resend the code without asking for the address again.
        $this->session()->flash(RegisteredUserController::PENDING_EMAIL_KEY, $email);

        RateLimiter::clear($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => 'Please verify your email address before signing in. Check your inbox for the verification code, or request a new one below.',
        ]);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
