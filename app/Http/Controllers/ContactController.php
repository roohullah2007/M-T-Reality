<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormConfirmation;
use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Maximum contact form submissions per IP per hour.
     */
    protected const MAX_PER_HOUR = 3;

    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        // Bot gating (honeypot + minimum-time token). Blocked submissions
        // receive the same success response a real one would, so bots get
        // no signal about which check failed.
        if ($reason = SpamGuard::botCheck($request)) {
            SpamGuard::logBlock('contact', $request, $reason);

            return $this->genericSuccess();
        }

        if (SpamGuard::tooManyAttempts($request, 'contact', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('contact', $request, 'rate limit exceeded');

            return $this->genericSuccess();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // Conservative content heuristics (gibberish name, dotted-gmail
        // alias trick, link spam).
        $reason = SpamGuard::contactContentCheck(
            $validated['name'],
            $validated['email'],
            $validated['message']
        );

        if ($reason) {
            SpamGuard::logBlock('contact', $request, $reason);

            return $this->genericSuccess();
        }

        // Repeat submissions from the same inbox (dotted gmail aliases are
        // normalized so rotating the dots does not evade the check).
        if ($this->isRepeatSender($validated['email'])) {
            SpamGuard::logBlock('contact', $request, 'too many recent messages from same (normalized) email');

            return $this->genericSuccess();
        }

        SpamGuard::recordAttempt($request, 'contact');

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        try {
            EmailService::sendToUserAndAdmin(
                $contactMessage->email,
                new ContactFormConfirmation($contactMessage),
                new NewContactMessageToAdmin($contactMessage)
            );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Contact email dispatch failed: ' . $e->getMessage());
        }

        return $this->genericSuccess();
    }

    /**
     * Whether this (normalized) email already sent several messages in the
     * last 24 hours. Volume is low enough to compare in PHP, which lets us
     * normalize dotted gmail aliases that SQL cannot match directly.
     */
    protected function isRepeatSender(string $email): bool
    {
        $normalized = SpamGuard::normalizeEmail($email);

        $recentCount = ContactMessage::where('created_at', '>=', now()->subDay())
            ->pluck('email')
            ->filter(fn ($existing) => SpamGuard::normalizeEmail($existing) === $normalized)
            ->count();

        return $recentCount >= 3;
    }

    /**
     * The response every submission gets - accepted or silently blocked.
     */
    protected function genericSuccess()
    {
        return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
    }
}
