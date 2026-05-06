<?php

namespace App\Http\Controllers;

use App\Mail\InquiryConfirmation;
use App\Mail\NewInquiryNotification;
use App\Mail\NewInquiryToAdmin;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\Setting;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Store a newly created property inquiry.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'question' => 'nullable|string|max:500',
            'message' => 'required|string',
        ]);

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
            \Illuminate\Support\Facades\Log::error('Inquiry email dispatch failed: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Your message has been sent! The agent will contact you soon.');
    }
}
