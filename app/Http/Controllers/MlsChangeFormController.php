<?php

namespace App\Http\Controllers;

use App\Mail\NewContactMessageToAdmin;
use App\Models\ContactMessage;
use App\Services\EmailService;
use Illuminate\Http\Request;

class MlsChangeFormController extends Controller
{
    /**
     * Store a public MLS change request submitted via /mlschanges.
     * Stored as a ContactMessage so admin can view it under existing
     * messages UI; admin notification email is sent.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'property_address' => 'required|string|max:500',
            'request_type' => 'required|string|max:100',
            'details' => 'required|string|max:5000',
        ]);

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

        EmailService::sendToAdmin(new NewContactMessageToAdmin($message));

        return redirect()->route('mlschanges')
            ->with('success', 'Your MLS change request has been submitted. We will process it shortly.');
    }
}
