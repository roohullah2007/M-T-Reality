<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('user');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('property_title', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by approval status
        if ($request->filled('approval')) {
            $query->where('approval_status', $request->approval);
        }

        // Filter by property type
        if ($request->filled('type')) {
            $query->where('property_type', $request->type);
        }

        // Filter by featured
        if ($request->filled('featured')) {
            $query->where('is_featured', $request->featured === 'yes');
        }

        $properties = $query->latest()
            ->paginate(15)
            ->withQueryString();

        // Get counts for tabs
        $counts = [
            'all' => Property::count(),
            'pending' => Property::pending()->count(),
            'approved' => Property::approved()->count(),
            'rejected' => Property::where('approval_status', 'rejected')->count(),
            'featured' => Property::featured()->count(),
        ];

        return Inertia::render('Admin/Properties/Index', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'status', 'approval', 'type', 'featured']),
            'counts' => $counts,
        ]);
    }

    public function show(Property $property)
    {
        $property->load(['user', 'images', 'inquiries.user']);

        return Inertia::render('Admin/Properties/Show', [
            'property' => $property,
        ]);
    }

    public function edit(Property $property)
    {
        // Redirect to show page - admins review properties, not edit them
        return redirect()->route('admin.properties.show', $property->id);
    }

    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'property_title' => 'required|string|max:255',
            'property_type' => 'required|string',
            'status' => 'required|string',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
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

        $oldValues = $property->toArray();
        $property->update($validated);

        ActivityLog::log('property_updated', $property, $oldValues, $validated, "Updated property: {$property->property_title}");

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property updated successfully.');
    }

    public function destroy(Property $property)
    {
        $propertyTitle = $property->property_title;

        ActivityLog::log('property_deleted', $property, $property->toArray(), null, "Deleted property: {$propertyTitle}");

        $property->delete();

        return redirect()->route('admin.properties.index')
            ->with('success', 'Property deleted successfully.');
    }

    public function approve(Property $property)
    {
        $property->update([
            'approval_status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
            'rejection_reason' => null,
        ]);

        ActivityLog::log('property_approved', $property, null, null, "Approved property: {$property->property_title}");

        return back()->with('success', 'Property approved successfully.');
    }

    public function reject(Request $request, Property $property)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $property->update([
            'approval_status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'approved_at' => null,
            'approved_by' => null,
        ]);

        ActivityLog::log('property_rejected', $property, null, ['reason' => $request->rejection_reason], "Rejected property: {$property->property_title}");

        return back()->with('success', 'Property rejected.');
    }

    public function toggleFeatured(Property $property)
    {
        $property->update(['is_featured' => !$property->is_featured]);

        $status = $property->is_featured ? 'featured' : 'unfeatured';

        ActivityLog::log("property_{$status}", $property, null, null, "Property {$property->property_title} marked as {$status}");

        return back()->with('success', "Property {$status} successfully.");
    }

    public function toggleActive(Property $property)
    {
        $property->update(['is_active' => !$property->is_active]);

        $status = $property->is_active ? 'activated' : 'deactivated';

        ActivityLog::log("property_{$status}", $property, null, null, "Property {$property->property_title} {$status}");

        return back()->with('success', "Property {$status} successfully.");
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:properties,id',
            'action' => 'required|in:approve,reject,delete,feature,unfeature,activate,deactivate',
        ]);

        $properties = Property::whereIn('id', $request->ids)->get();

        foreach ($properties as $property) {
            switch ($request->action) {
                case 'approve':
                    $property->update([
                        'approval_status' => 'approved',
                        'approved_at' => now(),
                        'approved_by' => auth()->id(),
                    ]);
                    break;
                case 'reject':
                    $property->update(['approval_status' => 'rejected']);
                    break;
                case 'delete':
                    $property->delete();
                    break;
                case 'feature':
                    $property->update(['is_featured' => true]);
                    break;
                case 'unfeature':
                    $property->update(['is_featured' => false]);
                    break;
                case 'activate':
                    $property->update(['is_active' => true]);
                    break;
                case 'deactivate':
                    $property->update(['is_active' => false]);
                    break;
            }
        }

        ActivityLog::log("bulk_{$request->action}", null, null, ['count' => count($request->ids)], "Bulk action: {$request->action} on " . count($request->ids) . " properties");

        return back()->with('success', 'Bulk action completed successfully.');
    }
}
