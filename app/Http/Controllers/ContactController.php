<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormConfirmation;
use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        // Honeypot + minimum-time token + per-IP rate limit + reCAPTCHA.
        // Blocked submissions receive the same success response a real one
        // would, so bots get no signal about which check failed.
        if ($reason = SpamGuard::guard($request, 'contact', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('contact', $request, $reason);

            return $this->genericSuccess();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        // The spam wave filled every field with a random token, so check the
        // free-text fields for machine-generated content, then apply the
        // conservative heuristics (gibberish name, dotted-gmail alias trick,
        // link spam).
        $reason = SpamGuard::gibberishCheck([
            'name' => $validated['name'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
        ]) ?? SpamGuard::contactContentCheck(
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
        if (SpamGuard::isRepeatSender(ContactMessage::query(), $validated['email'])) {
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
            Log::error('Contact email dispatch failed: ' . $e->getMessage());
        }

        return $this->genericSuccess();
    }

    /**
     * The response every submission gets - accepted or silently blocked.
     */
    protected function genericSuccess()
    {
        return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
    }
}
