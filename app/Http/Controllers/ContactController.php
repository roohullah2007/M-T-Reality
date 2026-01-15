<?php

namespace App\Http\Controllers;

use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        // Send notification email to admin
        $emailNotificationsEnabled = Setting::get('email_notifications', '1') === '1';
        $adminEmail = Setting::get('admin_email', 'admin@okbyowner.com');
        if ($emailNotificationsEnabled && $adminEmail) {
            Mail::to($adminEmail)->send(new NewContactMessageToAdmin($contactMessage));
        }

        return redirect()->back()->with('success', 'Thank you for your message! We\'ll get back to you within 24 hours.');
    }
}
