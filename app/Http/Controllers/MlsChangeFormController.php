<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormConfirmation;
use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MlsChangeFormController extends Controller
{
    /**
     * Maximum MLS change requests per IP per hour.
     */
    protected const MAX_PER_HOUR = 3;

    /**
     * Store a public MLS change request submitted via /mlschanges.
     * Stored as a ContactMessage so admin can view it under existing
     * messages UI; admin notification email is sent.
     */
    public function store(Request $request)
    {
        // Honeypot + minimum-time token + per-IP rate limit + reCAPTCHA.
        // Blocked submissions get the same response a real one would, so bots
        // learn nothing about which check stopped them.
        if ($reason = SpamGuard::guard($request, 'mlschanges', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('mlschanges', $request, $reason);

            return $this->genericSuccess();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'property_address' => 'required|string|max:500',
            'request_type' => 'required|string|max:100',
            'details' => 'required|string|max:5000',
        ]);

        // The spam wave filled every field with a random token, so check the
        // free-text fields for machine-generated content.
        $reason = SpamGuard::gibberishCheck([
            'name' => $validated['name'],
            'property address' => $validated['property_address'],
            'details' => $validated['details'],
        ]) ?? SpamGuard::contactContentCheck(
            $validated['name'],
            $validated['email'],
            $validated['details']
        );

        if ($reason) {
            SpamGuard::logBlock('mlschanges', $request, $reason);

            return $this->genericSuccess();
        }

        // Repeat submissions from the same inbox (dotted gmail aliases are
        // normalized so rotating the dots does not evade the check).
        if (SpamGuard::isRepeatSender(ContactMessage::query(), $validated['email'])) {
            SpamGuard::logBlock('mlschanges', $request, 'too many recent messages from same (normalized) email');

            return $this->genericSuccess();
        }

        SpamGuard::recordAttempt($request, 'mlschanges');

        $body = "Property Address: {$validated['property_address']}\n"
            . "Request Type: {$validated['request_type']}\n\n"
            . "Details:\n{$validated['details']}";

        $message = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => 'MLS Change Request — ' . $validated['property_address'],
            'message' => $body,
            'status' => 'new',
        ]);

        // Confirmation to the submitter and notification to admin
        // (EmailService logs failures and never throws)
        try {
            EmailService::sendToUserAndAdmin(
                $message->email,
                new ContactFormConfirmation($message),
                new NewContactMessageToAdmin($message)
            );
        } catch (\Throwable $e) {
            Log::error('MLS change email dispatch failed: ' . $e->getMessage());
        }

        return $this->genericSuccess();
    }

    /**
     * The response every submission gets - accepted or silently blocked.
     */
    protected function genericSuccess()
    {
        return redirect()->route('mlschanges')
            ->with('success', 'Your MLS change request has been submitted. We will process it shortly.');
    }
}
