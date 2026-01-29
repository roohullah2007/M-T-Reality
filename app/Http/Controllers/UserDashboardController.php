<?php

namespace App\Http\Controllers;

use App\Mail\PropertyUpdatedNotification;
use App\Mail\ServiceRequestReceived;
use App\Mail\ServiceRequestToAdmin;
use App\Models\Property;
use App\Models\Inquiry;
use App\Models\Favorite;
use App\Models\ServiceRequest;
use App\Models\Setting;
use App\Services\EmailService;
use App\Services\GeocodingService;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    /**
     * Display the dashboard overview
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's properties
        $properties = $user->properties()->latest()->take(5)->get();

        // Get stats
        $propertyIds = $user->properties()->pluck('id');
        $stats = [
            'total_listings' => $user->properties()->count(),
            'active_listings' => $user->properties()->where('is_active', true)->where('approval_status', 'approved')->count(),
            'pending_listings' => $user->properties()->where('approval_status', 'pending')->count(),
            'total_views' => $user->properties()->sum('views'),
            'total_inquiries' => Inquiry::whereIn('property_id', $propertyIds)->count(),
            'unread_inquiries' => Inquiry::whereIn('property_id', $propertyIds)->where('status', 'new')->count(),
            'saved_properties' => $user->favorites()->count(),
            'total_qr_scans' => \App\Models\QrScan::whereIn('property_id', $propertyIds)->count(),
        ];

        // Get recent inquiries (messages) for user's properties
        $recentInquiries = Inquiry::whereIn('property_id', $user->properties()->pluck('id'))
            ->with('property')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'properties' => $properties,
            'stats' => $stats,
            'recentInquiries' => $recentInquiries,
        ]);
    }

    /**
     * Display user's listings
     */
    public function listings(Request $request)
    {
        $user = Auth::user();

        $query = $user->properties()->with(['images', 'qrSticker']);

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('is_active', true)->where('approval_status', 'approved');
            } elseif ($request->status === 'pending') {
                $query->where('approval_status', 'pending');
            } elseif ($request->status === 'sold') {
                $query->where('listing_status', 'sold');
            } elseif ($request->status === 'inactive') {
                $query->where('listing_status', 'inactive');
            }
        }

        $listings = $query->withCount(['inquiries', 'qrScans'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => $user->properties()->count(),
            'active' => $user->properties()->where('is_active', true)->where('approval_status', 'approved')->count(),
            'pending' => $user->properties()->where('approval_status', 'pending')->count(),
            'sold' => $user->properties()->where('listing_status', 'sold')->count(),
        ];

        return Inertia::render('Dashboard/Listings', [
            'listings' => $listings,
            'filters' => $request->only(['search', 'status']),
            'counts' => $counts,
        ]);
    }

    /**
     * Show edit form for a listing
     */
    public function editListing(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        return Inertia::render('Dashboard/EditListing', [
            'property' => $property->load('images'),
        ]);
    }

    /**
     * Update a listing
     */
    public function updateListing(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        // Convert empty strings to null for optional URL fields
        $input = $request->all();
        $urlFields = ['virtual_tour_url', 'matterport_url', 'video_tour_url'];
        foreach ($urlFields as $field) {
            if (isset($input[$field]) && $input[$field] === '') {
                $input[$field] = null;
            }
        }
        $request->merge($input);

        $validated = $request->validate([
            'property_title' => 'required|string|max:255',
            'property_type' => 'required|string',
            'status' => 'required|string',
            'listing_status' => 'required|string|in:for_sale,for_rent,pending,sold,inactive',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:50',
            'zip_code' => 'required|string|max:20',
            'bedrooms' => 'required|integer|min:0',
            'full_bathrooms' => 'required|integer|min:0',
            'half_bathrooms' => 'nullable|integer|min:0',
            'sqft' => 'nullable|integer|min:0',
            'lot_size' => 'nullable|string',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email',
            'contact_phone' => 'required|string|max:20',
            'virtual_tour_url' => 'nullable|url|max:500',
            'matterport_url' => 'nullable|url|max:500',
            'video_tour_url' => 'nullable|url|max:500',
        ]);

        // Sync the old status field based on listing_status
        $statusMap = [
            'for_sale' => 'for-sale',
            'for_rent' => 'for-rent',
            'pending' => 'pending',
            'sold' => 'sold',
            'inactive' => 'inactive',
        ];
        $validated['status'] = $statusMap[$validated['listing_status']] ?? $validated['status'];

        $property->update($validated);

        // Geocode the property if address changed and no coordinates exist
        GeocodingService::geocodeProperty($property);

        // Send update notification email
        if ($property->contact_email) {
            EmailService::sendToUser($property->contact_email, new PropertyUpdatedNotification($property));
        }

        return redirect()->route('dashboard.listings')->with('success', 'Property updated successfully!');
    }

    /**
     * Delete a listing
     */
    public function destroyListing(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        // Delete related records
        $property->images()->delete();
        $property->inquiries()->delete();
        Favorite::where('property_id', $property->id)->delete();

        $property->delete();

        return redirect()->route('dashboard.listings')->with('success', 'Property deleted successfully!');
    }

    /**
     * Display user's messages (inquiries on their properties)
     */
    public function messages(Request $request)
    {
        $user = Auth::user();
        $propertyIds = $user->properties()->pluck('id');

        $query = Inquiry::whereIn('property_id', $propertyIds)->with('property');

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            if ($request->status === 'unread') {
                $query->where('status', 'new');
            } elseif ($request->status === 'read') {
                $query->whereIn('status', ['read', 'responded']);
            }
        }

        $messages = $query->latest()->paginate(20)->withQueryString();

        // Get counts
        $counts = [
            'all' => Inquiry::whereIn('property_id', $propertyIds)->count(),
            'unread' => Inquiry::whereIn('property_id', $propertyIds)->where('status', 'new')->count(),
            'read' => Inquiry::whereIn('property_id', $propertyIds)->whereIn('status', ['read', 'responded'])->count(),
        ];

        return Inertia::render('Dashboard/Messages', [
            'messages' => $messages,
            'filters' => $request->only(['search', 'status']),
            'counts' => $counts,
        ]);
    }

    /**
     * Mark a message as read
     */
    public function markMessageRead(Inquiry $inquiry)
    {
        // Check ownership of the property
        if ($inquiry->property->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->markAsRead();

        return back();
    }

    /**
     * Mark a message as responded
     */
    public function markMessageResponded(Inquiry $inquiry)
    {
        // Check ownership of the property
        if ($inquiry->property->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->markAsResponded();

        return back();
    }

    /**
     * Delete a message
     */
    public function destroyMessage(Inquiry $inquiry)
    {
        // Check ownership of the property
        if ($inquiry->property->user_id !== Auth::id()) {
            abort(403);
        }

        $inquiry->delete();

        return back()->with('success', 'Message deleted successfully!');
    }

    /**
     * Display user's favorite properties
     */
    public function favorites(Request $request)
    {
        $user = Auth::user();

        $query = $user->favorites()->with('images');

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        $favorites = $query->latest('favorites.created_at')->paginate(12)->withQueryString();

        return Inertia::render('Dashboard/Favorites', [
            'favorites' => $favorites,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Add property to favorites
     */
    public function addFavorite(Property $property)
    {
        $user = Auth::user();

        if (!$user->favorites()->where('property_id', $property->id)->exists()) {
            $user->favorites()->attach($property->id);
        }

        return back()->with('success', 'Property added to favorites!');
    }

    /**
     * Remove property from favorites
     */
    public function removeFavorite(Property $property)
    {
        $user = Auth::user();
        $user->favorites()->detach($property->id);

        return back()->with('success', 'Property removed from favorites!');
    }

    /**
     * Display user's service requests (upgrades)
     */
    public function serviceRequests(Request $request)
    {
        $user = Auth::user();

        $query = $user->serviceRequests()->with('property');

        // Filter by status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by service type
        if ($request->type) {
            $query->where('service_type', $request->type);
        }

        $serviceRequests = $query->latest()->paginate(10)->withQueryString();

        // Get counts
        $counts = [
            'all' => $user->serviceRequests()->count(),
            'pending' => $user->serviceRequests()->where('status', 'pending')->count(),
            'in_progress' => $user->serviceRequests()->whereIn('status', ['approved', 'in_progress'])->count(),
            'completed' => $user->serviceRequests()->where('status', 'completed')->count(),
        ];

        return Inertia::render('Dashboard/ServiceRequests', [
            'serviceRequests' => $serviceRequests,
            'filters' => $request->only(['status', 'type']),
            'counts' => $counts,
        ]);
    }

    /**
     * Show upgrade options for a property
     */
    public function showUpgradeOptions(Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        // Get existing service requests for this property
        $existingRequests = $property->serviceRequests()
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->get();

        return Inertia::render('Dashboard/UpgradeProperty', [
            'property' => $property,
            'existingRequests' => $existingRequests,
        ]);
    }

    /**
     * Submit an upgrade request
     */
    public function submitUpgradeRequest(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $validated = $request->validate([
            'service_type' => 'required|in:photos,virtual_tour,video,mls',
            'notes' => 'nullable|string|max:1000',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string',
        ]);

        // Check if there's already a pending request for this service type
        $existingRequest = $property->serviceRequests()
            ->where('service_type', $validated['service_type'])
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->first();

        if ($existingRequest) {
            return back()->withErrors(['service_type' => 'You already have a pending request for this service.']);
        }

        // Create the service request
        $serviceRequest = ServiceRequest::create([
            'user_id' => Auth::id(),
            'property_id' => $property->id,
            'service_type' => $validated['service_type'],
            'notes' => $validated['notes'] ?? null,
            'preferred_date' => $validated['preferred_date'] ?? null,
            'preferred_time' => $validated['preferred_time'] ?? null,
            'status' => 'pending',
        ]);

        // Load relationships for emails
        $serviceRequest->load(['user', 'property']);

        // Send emails with delay to user and admin
        $user = Auth::user();
        if ($user && $user->email) {
            EmailService::sendToUserAndAdmin(
                $user->email,
                new ServiceRequestReceived($serviceRequest),
                new ServiceRequestToAdmin($serviceRequest)
            );
        }

        return redirect()->route('dashboard.listings')
            ->with('success', 'Your upgrade request has been submitted! We will contact you shortly.');
    }

    /**
     * Cancel an upgrade request
     */
    public function cancelUpgradeRequest(ServiceRequest $serviceRequest)
    {
        // Check ownership
        if ($serviceRequest->user_id !== Auth::id()) {
            abort(403);
        }

        // Can only cancel pending or approved requests
        if (!in_array($serviceRequest->status, ['pending', 'approved'])) {
            return back()->withErrors(['error' => 'This request cannot be cancelled.']);
        }

        $serviceRequest->update(['status' => 'cancelled']);

        return back()->with('success', 'Service request cancelled successfully.');
    }

    /**
     * Submit an order for free materials (QR stickers or yard sign)
     */
    public function submitOrder(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $validated = $request->validate([
            'service_type' => 'required|in:qr_stickers,yard_sign',
            'shipping_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'required|string|max:50',
            'shipping_zip' => 'required|string|max:20',
            'shipping_phone' => 'required|string|max:20',
            'quantity' => 'nullable|integer|min:1|max:10',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Check if there's already a pending request for this service type on this property
        $existingRequest = $property->serviceRequests()
            ->where('service_type', $validated['service_type'])
            ->whereIn('status', ['pending', 'approved', 'in_progress'])
            ->first();

        if ($existingRequest) {
            return back()->withErrors(['service_type' => 'You already have a pending order for this item.']);
        }

        // Build shipping info for notes
        $shippingInfo = "Ship to:\n" .
            $validated['shipping_name'] . "\n" .
            $validated['shipping_address'] . "\n" .
            $validated['shipping_city'] . ", " . $validated['shipping_state'] . " " . $validated['shipping_zip'] . "\n" .
            "Phone: " . $validated['shipping_phone'];

        if ($validated['service_type'] === 'qr_stickers') {
            $shippingInfo .= "\nQuantity: " . ($validated['quantity'] ?? 2) . " stickers";
        }

        if (!empty($validated['notes'])) {
            $shippingInfo .= "\n\nNotes: " . $validated['notes'];
        }

        // Create the service request
        $serviceRequest = ServiceRequest::create([
            'user_id' => Auth::id(),
            'property_id' => $property->id,
            'service_type' => $validated['service_type'],
            'notes' => $shippingInfo,
            'status' => 'pending',
        ]);

        // Load relationships for emails
        $serviceRequest->load(['user', 'property']);

        // Send emails with delay to user and admin
        $user = Auth::user();
        if ($user && $user->email) {
            EmailService::sendToUserAndAdmin(
                $user->email,
                new ServiceRequestReceived($serviceRequest),
                new ServiceRequestToAdmin($serviceRequest)
            );
        }

        $itemName = $validated['service_type'] === 'qr_stickers' ? 'QR stickers' : 'yard sign';
        return back()->with('success', "Your free {$itemName} order has been submitted!");
    }

    /**
     * Add photos to a listing (supports both file uploads and pre-uploaded paths)
     */
    public function addPhotos(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $currentPhotos = $property->photos ?? [];
        $remainingSlots = ImageService::MAX_TOTAL_PHOTOS - count($currentPhotos);

        if ($remainingSlots <= 0) {
            return back()->with('error', 'Your listing has reached the maximum number of photos (' . ImageService::MAX_TOTAL_PHOTOS . ').');
        }

        $newPhotoPaths = [];

        // Check if pre-uploaded paths are provided (progressive upload method)
        if ($request->has('photo_paths') && is_array($request->photo_paths)) {
            $request->validate([
                'photo_paths' => 'required|array|min:1',
                'photo_paths.*' => 'string',
            ]);

            // Use pre-uploaded paths directly (limited by remaining slots)
            $newPhotoPaths = array_slice($request->photo_paths, 0, $remainingSlots);
        }
        // Otherwise, handle direct file uploads (legacy method)
        elseif ($request->hasFile('photos')) {
            $request->validate([
                'photos' => 'required|array|min:1',
                'photos.*' => 'file|max:30720', // 30MB max per image
            ]);

            // Process new photos (limited by remaining slots)
            $newPhotoPaths = ImageService::processMultiple(
                $request->file('photos'),
                'properties',
                $remainingSlots
            );
        }

        if (empty($newPhotoPaths)) {
            return back()->with('error', 'Failed to process uploaded photos. Please try again.');
        }

        // Merge with existing photos
        $updatedPhotos = array_merge($currentPhotos, $newPhotoPaths);
        $property->update(['photos' => $updatedPhotos]);

        $uploadedCount = count($newPhotoPaths);
        return back()->with('success', "{$uploadedCount} photo(s) added successfully!");
    }

    /**
     * Remove a photo from a listing
     */
    public function removePhoto(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $request->validate([
            'photo_index' => 'required|integer|min:0',
        ]);

        $photos = $property->photos ?? [];
        $photoIndex = $request->photo_index;

        if (!isset($photos[$photoIndex])) {
            return back()->with('error', 'Photo not found.');
        }

        // Delete the actual file
        $photoPath = $photos[$photoIndex];
        ImageService::delete($photoPath);

        // Remove from array
        array_splice($photos, $photoIndex, 1);
        $property->update(['photos' => $photos]);

        return back()->with('success', 'Photo removed successfully.');
    }

    /**
     * Reorder photos (set main photo)
     */
    public function reorderPhotos(Request $request, Property $property)
    {
        // Check ownership
        if ($property->user_id !== Auth::id()) {
            abort(403, 'You do not own this property.');
        }

        $request->validate([
            'photo_order' => 'required|array',
            'photo_order.*' => 'integer|min:0',
        ]);

        $currentPhotos = $property->photos ?? [];
        $newOrder = $request->photo_order;

        // Validate that all indices are valid
        foreach ($newOrder as $index) {
            if (!isset($currentPhotos[$index])) {
                return back()->with('error', 'Invalid photo order.');
            }
        }

        // Reorder the photos
        $reorderedPhotos = [];
        foreach ($newOrder as $index) {
            $reorderedPhotos[] = $currentPhotos[$index];
        }

        $property->update(['photos' => $reorderedPhotos]);

        return back()->with('success', 'Photos reordered successfully.');
    }
}
