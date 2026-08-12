<?php

namespace App\Http\Controllers;

use App\Mail\InquiryConfirmation;
use App\Mail\NewInquiryNotification;
use App\Mail\NewInquiryToAdmin;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Maximum property inquiries per IP per hour.
     */
    protected const MAX_PER_HOUR = 5;

    /**
     * Store a newly created property inquiry.
     */
    public function store(Request $request)
    {
        // Honeypot + minimum-time token + per-IP rate limit + reCAPTCHA.
        // Blocked submissions get the same response a real one would, so bots
        // learn nothing about which check stopped them.
        if ($reason = SpamGuard::guard($request, 'inquiry', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('inquiry', $request, $reason);

            return $this->genericSuccess();
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'question' => 'nullable|string|max:500',
            'message' => 'required|string',
        ]);

        // The spam wave filled every field with a random token, so check the
        // free-text fields for machine-generated content.
        $reason = SpamGuard::gibberishCheck([
            'name' => $validated['name'],
            'message' => $validated['message'],
        ]) ?? SpamGuard::contactContentCheck(
            $validated['name'],
            $validated['email'],
            $validated['message']
        );

        if ($reason) {
            SpamGuard::logBlock('inquiry', $request, $reason);

            return $this->genericSuccess();
        }

        // Repeat submissions from the same inbox (dotted gmail aliases are
        // normalized so rotating the dots does not evade the check). The
        // allowance matches the hourly limit: a genuine buyer may well ask
        // about several listings in a day.
        if (SpamGuard::isRepeatSender(Inquiry::query(), $validated['email'], self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('inquiry', $request, 'too many recent inquiries from same (normalized) email');

            return $this->genericSuccess();
        }

        SpamGuard::recordAttempt($request, 'inquiry');

        $property = Property::findOrFail($validated['property_id']);

        $messageBody = $validated['message'];
        if (!empty($validated['question'])) {
            $messageBody = "Question: {$validated['question']}\n\n{$messageBody}";
        }

        $inquiry = Inquiry::create([
            'property_id' => $validated['property_id'],
            'user_id' => auth()->check() ? auth()->id() : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $messageBody,
            'type' => !empty($validated['question']) ? 'question' : 'general',
            'status' => 'new',
        ]);

        try {
            if (EmailService::isEnabled()) {
                EmailService::sendToUser($inquiry->email, new InquiryConfirmation($inquiry, $property));

                sleep(2);
                if ($property->contact_email) {
                    EmailService::sendToUser($property->contact_email, new NewInquiryNotification($inquiry, $property));
                }

                sleep(2);
                EmailService::sendToAdmin(new NewInquiryToAdmin($inquiry, $property));
            }
        } catch (\Throwable $e) {
            Log::error('Inquiry email dispatch failed: ' . $e->getMessage());
        }

        return $this->genericSuccess();
    }

    /**
     * The response every submission gets - accepted or silently blocked.
     */
    protected function genericSuccess()
    {
        return redirect()->back()->with('success', 'Your message has been sent! The agent will contact you soon.');
    }
}
