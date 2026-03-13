<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MlsChangeRequest extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'request_type',
        'status',
        'description',
        'changes',
        'admin_notes',
        'handled_by',
        'handled_at',
    ];

    protected $casts = [
        'changes' => 'array',
        'handled_at' => 'datetime',
    ];

    const TYPE_LISTING_CHANGE = 'listing_change';
    const TYPE_NEW_LISTING = 'new_listing';
    const TYPE_OPEN_HOUSE = 'open_house';
    const TYPE_PRICE_CHANGE = 'price_change';
    const TYPE_STATUS_CHANGE = 'status_change';

    const REQUEST_TYPES = [
        self::TYPE_LISTING_CHANGE => 'Listing Change',
        self::TYPE_NEW_LISTING => 'New MLS Listing',
        self::TYPE_OPEN_HOUSE => 'Open House Request',
        self::TYPE_PRICE_CHANGE => 'Price Change',
        self::TYPE_STATUS_CHANGE => 'Status Change',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_DENIED = 'denied';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', [self::STATUS_PENDING, self::STATUS_IN_PROGRESS]);
    }
}
