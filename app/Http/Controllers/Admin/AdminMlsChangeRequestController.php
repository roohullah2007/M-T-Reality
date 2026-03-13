<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MlsChangeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminMlsChangeRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = MlsChangeRequest::with(['user', 'property', 'handler']);

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($q2) => $q2->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('property', fn($q2) => $q2->where('property_title', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%")
                      ->orWhere('mls_number', 'like', "%{$search}%"));
            });
        }

        $changeRequests = $query->latest()->paginate(20)->withQueryString();

        $counts = [
            'all' => MlsChangeRequest::count(),
            'pending' => MlsChangeRequest::where('status', 'pending')->count(),
            'in_progress' => MlsChangeRequest::where('status', 'in_progress')->count(),
            'completed' => MlsChangeRequest::where('status', 'completed')->count(),
            'denied' => MlsChangeRequest::where('status', 'denied')->count(),
        ];

        return Inertia::render('Admin/MlsChangeRequests/Index', [
            'changeRequests' => $changeRequests,
            'filters' => $request->only(['status', 'search']),
            'counts' => $counts,
        ]);
    }

    public function updateStatus(Request $request, MlsChangeRequest $mlsChangeRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,denied',
        ]);

        $mlsChangeRequest->update([
            'status' => $validated['status'],
            'handled_by' => Auth::id(),
            'handled_at' => now(),
        ]);

        return back()->with('success', 'Request status updated.');
    }

    public function addNote(Request $request, MlsChangeRequest $mlsChangeRequest)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:2000',
        ]);

        $mlsChangeRequest->update([
            'admin_notes' => $validated['admin_notes'],
            'handled_by' => Auth::id(),
        ]);

        return back()->with('success', 'Note saved.');
    }
}
