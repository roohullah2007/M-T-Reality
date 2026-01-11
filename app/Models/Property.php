<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'property_title',
        'developer',
        'property_type',
        'status',
        'price',
        'address',
        'city',
        'state',
        'zip_code',
        'subdivision',
        'bedrooms',
        'bathrooms',
        'sqft',
        'lot_size',
        'year_built',
        'description',
        'features',
        'photos',
        'contact_name',
        'contact_email',
        'contact_phone',
        'is_featured',
        'is_active',
        'approval_status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'latitude',
        'longitude',
        'views',
        // Listing tier and upgrade fields
        'listing_tier',
        'has_professional_photos',
        'has_virtual_tour',
        'has_video',
        'virtual_tour_url',
        'video_url',
        'video_tour_url',
        'floor_plan_url',
        'is_mls_listed',
        'mls_number',
        'mls_listed_at',
        'mls_expires_at',
    ];

    protected $casts = [
        'features' => 'array',
        'photos' => 'array',
        'price' => 'decimal:2',
        'bathrooms' => 'decimal:1',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'approved_at' => 'datetime',
        // Upgrade field casts
        'has_professional_photos' => 'boolean',
        'has_virtual_tour' => 'boolean',
        'has_video' => 'boolean',
        'is_mls_listed' => 'boolean',
        'mls_listed_at' => 'datetime',
        'mls_expires_at' => 'datetime',
    ];

    protected $appends = ['slug'];

    /**
     * Get the owner of this property
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Alias for user relationship
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the admin who approved this property
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get property images
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('sort_order');
    }

    /**
     * Get primary image
     */
    public function primaryImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_primary', true);
    }

    /**
     * Get inquiries for this property
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    /**
     * Get service requests for this property
     */
    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    /**
     * Get pending service requests
     */
    public function pendingServiceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class)->where('status', 'pending');
    }

    /**
     * Get users who favorited this property
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    /**
     * Get QR code scans for this property
     */
    public function qrScans(): HasMany
    {
        return $this->hasMany(QrScan::class);
    }

    /**
     * Get QR sticker for this property
     */
    public function qrSticker(): HasOne
    {
        return $this->hasOne(QrSticker::class);
    }

    /**
     * Scope for active properties
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for approved properties
     */
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    /**
     * Scope for pending properties
     */
    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    /**
     * Scope for featured properties
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for publicly visible properties
     */
    public function scopePublic($query)
    {
        return $query->active()->approved();
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 0);
    }

    /**
     * Get full address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->state,
            $this->zip_code
        ]);
        return implode(', ', $parts);
    }

    /**
     * Get URL slug for the property
     */
    public function getSlugAttribute(): string
    {
        $slug = strtolower(trim($this->address ?? ''));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');
        return $this->id . '-' . $slug;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    /**
     * Resolve route binding with slug support
     */
    public function resolveRouteBinding($value, $field = null)
    {
        // Extract ID from slug (e.g., "2-123-main-street" -> 2)
        if (preg_match('/^(\d+)/', $value, $matches)) {
            return $this->where('id', $matches[1])->firstOrFail();
        }
        return $this->where('id', $value)->firstOrFail();
    }

    /**
     * Increment view count
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }

    /**
     * Check if property is pending approval
     */
    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    /**
     * Check if property is approved
     */
    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    /**
     * Check if property is rejected
     */
    public function isRejected(): bool
    {
        return $this->approval_status === 'rejected';
    }

    /**
     * Check if listing is free tier
     */
    public function isFreeTier(): bool
    {
        return $this->listing_tier === 'free' || $this->listing_tier === null;
    }

    /**
     * Check if listing has photos upgrade
     */
    public function hasPhotosUpgrade(): bool
    {
        return $this->listing_tier === 'photos' || $this->listing_tier === 'mls';
    }

    /**
     * Check if listing has MLS upgrade
     */
    public function hasMlsUpgrade(): bool
    {
        return $this->listing_tier === 'mls';
    }

    /**
     * Get listing tier label
     */
    public function getListingTierLabelAttribute(): string
    {
        return match($this->listing_tier) {
            'photos' => 'Photos & Multimedia',
            'mls' => 'MLS Listed',
            default => 'Free Listing',
        };
    }

    /**
     * Check if property has any pending upgrade requests
     */
    public function hasPendingUpgrade(): bool
    {
        return $this->serviceRequests()->whereIn('status', ['pending', 'approved', 'in_progress'])->exists();
    }
}
