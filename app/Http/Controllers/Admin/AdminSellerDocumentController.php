<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerDocument;
use App\Models\User;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminSellerDocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = SellerDocument::with(['user', 'property', 'uploader']);

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->category && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($q2) => $q2->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('property', fn($q2) => $q2->where('property_title', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%"));
            });
        }

        $documents = $query->latest()->paginate(20)->withQueryString();

        // Get sellers for the dropdown
        $sellers = User::where('role', 'seller')
            ->orWhereHas('properties')
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        // Get properties for the dropdown (optionally filtered by user)
        $propertiesQuery = Property::select('id', 'property_title', 'address', 'city', 'state', 'user_id');
        if ($request->user_id) {
            $propertiesQuery->where('user_id', $request->user_id);
        }
        $properties = $propertiesQuery->orderBy('property_title')->get();

        $counts = [
            'all' => SellerDocument::count(),
            'unviewed' => SellerDocument::whereNull('viewed_at')->count(),
        ];

        return Inertia::render('Admin/SellerDocuments/Index', [
            'documents' => $documents,
            'sellers' => $sellers,
            'properties' => $properties,
            'categories' => SellerDocument::CATEGORIES,
            'filters' => $request->only(['search', 'category', 'user_id']),
            'counts' => $counts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_id' => 'nullable|exists:properties,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:listing_agreement,disclosure,government,contract,addendum,other',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480',
        ]);

        $file = $request->file('file');
        $path = $file->store('seller-documents', 'public');

        SellerDocument::create([
            'user_id' => $validated['user_id'],
            'property_id' => $validated['property_id'] ?: null,
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'uploaded_by' => Auth::id(),
        ]);

        return back()->with('success', 'Document uploaded for seller.');
    }

    public function destroy(SellerDocument $sellerDocument)
    {
        if (Storage::disk('public')->exists($sellerDocument->file_path)) {
            Storage::disk('public')->delete($sellerDocument->file_path);
        }

        $sellerDocument->delete();

        return back()->with('success', 'Document deleted.');
    }

    public function download(SellerDocument $sellerDocument)
    {
        $path = storage_path('app/public/' . $sellerDocument->file_path);

        if (!file_exists($path)) {
            return back()->with('error', 'File not found.');
        }

        return response()->download($path, $sellerDocument->file_name);
    }
}
