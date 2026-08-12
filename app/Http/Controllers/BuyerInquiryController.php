<?php

namespace App\Http\Controllers;

use App\Mail\BuyerInquiryConfirmation;
use App\Mail\NewBuyerInquiryToAdmin;
use App\Models\BuyerInquiry;
use App\Services\EmailService;
use App\Services\SpamGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BuyerInquiryController extends Controller
{
    /**
     * Maximum buyer inquiries per IP per hour.
     */
    protected const MAX_PER_HOUR = 3;

    /**
     * Store a new buyer inquiry from the public form
     */
    public function store(Request $request)
    {
        // Honeypot + minimum-time token + per-IP rate limit + reCAPTCHA.
        // Blocked submissions get the same response a real one would, so bots
        // learn nothing about which check stopped them.
        if ($reason = SpamGuard::guard($request, 'buyer-inquiry', self::MAX_PER_HOUR)) {
            SpamGuard::logBlock('buyer-inquiry', $request, $reason);

            return $this->genericSuccess();
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'preferred_area' => 'required|string|max:255',
            'price_min' => 'required|string|max:50',
            'price_max' => 'required|string|max:50',
            'mls_setup' => 'required|in:yes,no',
            'preapproved' => 'required|in:yes,no',
        ]);

        // The spam wave filled every field with a random token, so check the
        // free-text fields for machine-generated content.
        $reason = SpamGuard::gibberishCheck([
            'name' => $validated['name'],
            'preferred area' => $validated['preferred_area'],
        ]) ?? SpamGuard::contactContentCheck(
            $validated['name'],
            $validated['email'],
            $validated['preferred_area']
        );

        if ($reason) {
            SpamGuard::logBlock('buyer-inquiry', $request, $reason);

            return $this->genericSuccess();
        }

        // Repeat submissions from the same inbox (dotted gmail aliases are
        // normalized so rotating the dots does not evade the check).
        if (SpamGuard::isRepeatSender(BuyerInquiry::query(), $validated['email'])) {
            SpamGuard::logBlock('buyer-inquiry', $request, 'too many recent inquiries from same (normalized) email');

            return $this->genericSuccess();
        }

        SpamGuard::recordAttempt($request, 'buyer-inquiry');

        $inquiry = BuyerInquiry::create($validated);

        // Send confirmation to the buyer and notification to admin
        // (EmailService logs failures and never throws)
        try {
            EmailService::sendToUserAndAdmin(
                $inquiry->email,
                new BuyerInquiryConfirmation($inquiry),
                new NewBuyerInquiryToAdmin($inquiry)
            );
        } catch (\Throwable $e) {
            Log::error('Buyer inquiry email dispatch failed: ' . $e->getMessage());
        }

        return $this->genericSuccess();
    }

    /**
     * The response every submission gets - accepted or silently blocked.
     */
    protected function genericSuccess()
    {
        return back()->with('success', 'Thank you! We\'ll be in touch soon with property alerts matching your criteria.');
    }

    /**
     * Display all buyer inquiries for admin
     */
    public function index(Request $request)
    {
        $query = BuyerInquiry::query();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('preferred_area', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        // Get counts for status badges
        $counts = [
            'all' => BuyerInquiry::count(),
            'new' => BuyerInquiry::where('status', 'new')->count(),
            'contacted' => BuyerInquiry::where('status', 'contacted')->count(),
            'converted' => BuyerInquiry::where('status', 'converted')->count(),
            'closed' => BuyerInquiry::where('status', 'closed')->count(),
        ];

        return Inertia::render('Admin/BuyerInquiries/Index', [
            'inquiries' => $inquiries,
            'counts' => $counts,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
        ]);
    }

    /**
     * Show a single buyer inquiry
     */
    public function show(BuyerInquiry $inquiry)
    {
        return Inertia::render('Admin/BuyerInquiries/Show', [
            'inquiry' => $inquiry,
        ]);
    }

    /**
     * Update buyer inquiry status and notes
     */
    public function update(Request $request, BuyerInquiry $inquiry)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:new,contacted,converted,closed',
            'notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return back()->with('success', 'Inquiry updated successfully.');
    }

    /**
     * Delete a buyer inquiry
     */
    public function destroy(BuyerInquiry $inquiry)
    {
        $inquiry->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Inquiry deleted successfully.');
    }
}
