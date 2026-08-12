<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\SpamGuard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Maximum reset-link requests per IP per hour.
     */
    protected const MAX_PER_HOUR = 5;

    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Honeypot + minimum-time token + per-IP rate limit + reCAPTCHA. This
        // endpoint sends mail to an address the caller chooses, so a block gets
        // the same neutral "link sent" status a real request does - a bot must
        // not learn whether it was stopped, or by which check.
        if ($reason = SpamGuard::guard($request, 'password-reset', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('password-reset', $request, $reason);

            return $this->genericStatus();
        }

        $request->validate([
            'email' => 'required|email',
        ]);

        SpamGuard::recordAttempt($request, 'password-reset');

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return $this->genericStatus();
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    /**
     * The neutral "we've emailed the link" status - returned for a genuine
     * send and for a silently blocked (bot-like) request alike.
     */
    protected function genericStatus(): RedirectResponse
    {
        return back()->with('status', __(Password::RESET_LINK_SENT));
    }
}
