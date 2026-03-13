<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormTemplate extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'file_path',
        'file_name',
        'file_size',
        'is_required',
        'is_active',
        'sort_order',
        'uploaded_by',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'is_active' => 'boolean',
    ];

    const CATEGORIES = [
        'government' => 'Government Required',
        'listing' => 'Listing Forms',
        'disclosure' => 'Disclosures',
        'brochure' => 'Brochures & Pamphlets',
        'other' => 'Other',
    ];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function acknowledgments(): HasMany
    {
        return $this->hasMany(FormAcknowledgment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    public function getFormattedFileSizeAttribute(): string
    {
        $bytes = $this->file_size;
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 1) . ' MB';
        }
        return round($bytes / 1024, 0) . ' KB';
    }
}
