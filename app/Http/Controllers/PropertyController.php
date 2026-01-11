<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\QrScan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource (for admin).
     */
    public function index()
    {
        $properties = Property::latest()->paginate(20);

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ListProperty');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'propertyTitle' => 'required|string|max:255',
            'developer' => 'nullable|string|max:255',
            'propertyType' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'zipCode' => 'required|string',
            'subdivision' => 'nullable|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|numeric|min:0',
            'sqft' => 'required|integer|min:0',
            'lotSize' => 'nullable|integer|min:0',
            'yearBuilt' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'required|string',
            'features' => 'nullable', // JSON string or array from frontend
            'contactName' => 'required|string',
            'contactEmail' => 'required|email',
            'contactPhone' => 'required|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max per image
        ]);

        // Parse features - handle both JSON string and array formats
        $features = [];
        $featuresInput = $validated['features'] ?? $request->input('features');

        if (!empty($featuresInput)) {
            if (is_array($featuresInput)) {
                $features = $featuresInput;
            } elseif (is_string($featuresInput)) {
                $decoded = json_decode($featuresInput, true);
                if (is_array($decoded)) {
                    $features = $decoded;
                }
            }
        }

        // Handle photo uploads
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('properties', 'public');
                $photoPaths[] = '/storage/' . $path;
            }
        }

        // Get authenticated user ID if available
        $userId = auth()->check() ? auth()->id() : null;

        // Convert camelCase to snake_case for database
        $property = Property::create([
            'user_id' => $userId,
            'property_title' => $validated['propertyTitle'],
            'developer' => $validated['developer'] ?? null,
            'property_type' => $validated['propertyType'],
            'price' => $validated['price'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'state' => 'Oklahoma',
            'zip_code' => $validated['zipCode'],
            'subdivision' => $validated['subdivision'] ?? null,
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'sqft' => $validated['sqft'],
            'lot_size' => $validated['lotSize'] ?? null,
            'year_built' => $validated['yearBuilt'] ?? null,
            'description' => $validated['description'],
            'features' => $features,
            'photos' => $photoPaths,
            'contact_name' => $validated['contactName'],
            'contact_email' => $validated['contactEmail'],
            'contact_phone' => $validated['contactPhone'],
            'status' => 'for-sale',
            'is_active' => true,
            'approval_status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Property listed successfully! Your listing is pending approval.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Property $property)
    {
        // Redirect to SEO-friendly URL with slug if accessed by ID only
        $currentPath = request()->path();
        $expectedPath = 'properties/' . $property->slug;

        if ($currentPath !== $expectedPath) {
            // Preserve query parameters in redirect
            $queryString = $request->getQueryString();
            $redirectUrl = '/' . $expectedPath . ($queryString ? '?' . $queryString : '');
            return redirect()->to($redirectUrl, 301);
        }

        // Track QR code scans
        if ($request->query('src') === 'qr') {
            QrScan::create([
                'property_id' => $property->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer'),
                'scanned_at' => now(),
            ]);
        }

        // Increment view count
        $property->incrementViews();

        return Inertia::render('PropertyDetail', [
            'property' => $property
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        return Inertia::render('Admin/Properties/Edit', [
            'property' => $property
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'property_title' => 'required|string|max:255',
            'property_type' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip_code' => 'required|string',
            'subdivision' => 'nullable|string',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|numeric|min:0',
            'sqft' => 'required|integer|min:0',
            'lot_size' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'required|string',
            'features' => 'nullable|array',
            'contact_name' => 'required|string',
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $property->update($validated);

        return redirect()->route('admin.properties.index')->with('success', 'Property updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->back()->with('success', 'Property deleted successfully!');
    }

    /**
     * Get properties for public listing page.
     */
    public function publicIndex(Request $request)
    {
        $query = Property::where('is_active', true)
            ->where('approval_status', 'approved');

        // Filter by status (for-sale, for-rent, sold) - default to for-sale
        $status = $request->status ?? 'for-sale';
        $query->where('status', $status);

        // Search by keyword
        if ($request->keyword) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('property_title', 'like', "%{$keyword}%")
                    ->orWhere('address', 'like', "%{$keyword}%")
                    ->orWhere('city', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Filter by location
        if ($request->location) {
            $location = $request->location;
            $query->where(function ($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                    ->orWhere('zip_code', 'like', "%{$location}%");
            });
        }

        // Filter by property type
        if ($request->propertyType) {
            $query->where('property_type', $request->propertyType);
        }

        // Filter by price range
        if ($request->priceMin) {
            $query->where('price', '>=', $request->priceMin);
        }
        if ($request->priceMax) {
            $query->where('price', '<=', $request->priceMax);
        }

        // Filter by bedrooms
        if ($request->bedrooms) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        // Filter by bathrooms
        if ($request->bathrooms) {
            $query->where('bathrooms', '>=', $request->bathrooms);
        }

        // Sorting
        $sortBy = $request->sort ?? 'newest';
        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'bedrooms':
                $query->orderBy('bedrooms', 'desc');
                break;
            case 'sqft':
                $query->orderBy('sqft', 'desc');
                break;
            default:
                $query->latest();
        }

        $properties = $query->paginate(12)->withQueryString();

        return Inertia::render('Properties', [
            'properties' => $properties,
            'filters' => $request->only(['keyword', 'location', 'status', 'propertyType', 'priceMin', 'priceMax', 'bedrooms', 'bathrooms', 'sort']),
        ]);
    }
}
