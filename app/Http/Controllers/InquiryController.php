<?php

namespace App\Http\Controllers;

use App\Mail\NewInquiryNotification;
use App\Models\Inquiry;
use App\Models\Property;
use App\Models\Setting;
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
            'message' => 'required|string',
        ]);

        $property = Property::findOrFail($validated['property_id']);

        $inquiry = Inquiry::create([
            'property_id' => $validated['property_id'],
            'user_id' => auth()->check() ? auth()->id() : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'type' => 'property_inquiry',
            'status' => 'new',
        ]);

        // Send email notification to property owner
        $emailNotificationsEnabled = Setting::get('email_notifications', '1') === '1';
        if ($emailNotificationsEnabled && $property->contact_email) {
            Mail::to($property->contact_email)->send(new NewInquiryNotification($inquiry, $property));
        }

        return redirect()->back()->with('success', 'Your message has been sent! The seller will contact you soon.');
    }
}
