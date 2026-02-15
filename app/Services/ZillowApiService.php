<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZillowApiService
{
    protected string $apiKey;
    protected string $apiHost;
    protected string $imagesHost;

    public function __construct()
    {
        $this->apiKey = config('services.zillow_rapidapi.key', '');
        $this->apiHost = config('services.zillow_rapidapi.host', 'real-estate101.p.rapidapi.com');
        $this->imagesHost = config('services.zillow_rapidapi.images_host', 'zillow-com1.p.rapidapi.com');
    }

    /**
     * Check if the API is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Search by location (e.g. "Oklahoma City, OK").
     */
    public function searchByLocation(string $location, int $page = 1, string $listingType = 'fsbo'): array
    {
        if (!$this->isConfigured()) {
            return ['success' => false, 'error' => 'Zillow API not configured'];
        }

        try {
            $params = [
                'location' => $location,
                'page' => $page,
            ];

            if ($listingType === 'fsbo') {
                $params['listing_type'] = 'fsbo';
            }

            $response = Http::withHeaders([
                'x-rapidapi-host' => $this->apiHost,
                'x-rapidapi-key' => $this->apiKey,
            ])->timeout(30)->get("https://{$this->apiHost}/api/search", $params);

            if ($response->failed()) {
                $body = $response->json();
                return [
                    'success' => false,
                    'error' => $body['error'] ?? 'API request failed (HTTP ' . $response->status() . ')',
                ];
            }

            $data = $response->json();

            if (!($data['success'] ?? false)) {
                return [
                    'success' => false,
                    'error' => $data['error'] ?? 'Unknown API error',
                ];
            }

            return [
                'success' => true,
                'totalCount' => $data['totalCount'] ?? 0,
                'currentPage' => (int) ($data['currentPage'] ?? 1),
                'results' => $this->normalizeResults($data['results'] ?? []),
            ];
        } catch (\Exception $e) {
            Log::error('Zillow API error: ' . $e->getMessage());
            return ['success' => false, 'error' => 'API connection error: ' . $e->getMessage()];
        }
    }

    /**
     * Fetch all images for a property by zpid using zillow-com1 API.
     * Returns array of image URLs, or empty array on failure.
     */
    public function fetchPropertyImages(string $zpid): array
    {
        if (!$this->isConfigured()) {
            return [];
        }

        try {
            $response = Http::withHeaders([
                'x-rapidapi-host' => $this->imagesHost,
                'x-rapidapi-key' => $this->apiKey,
            ])->timeout(15)->get("https://{$this->imagesHost}/property", [
                'zpid' => $zpid,
            ]);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();
            if (!$data) {
                return [];
            }

            return $this->extractImages($data);
        } catch (\Exception $e) {
            Log::warning("Zillow images API error for zpid {$zpid}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Extract all image URLs from a property detail response.
     */
    protected function extractImages(array $data): array
    {
        $images = [];

        // Try common image fields from zillow-com1 API
        if (!empty($data['responsivePhotos'])) {
            foreach ($data['responsivePhotos'] as $photo) {
                // Each responsive photo has multiple sizes, get the largest
                if (!empty($photo['mixedSources']['jpeg'])) {
                    $jpegs = $photo['mixedSources']['jpeg'];
                    // Sort by width descending to get largest
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                }
            }
        }

        if (empty($images) && !empty($data['photos'])) {
            foreach ($data['photos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                } elseif (!empty($photo['mixedSources']['jpeg'][0]['url'])) {
                    $images[] = $photo['mixedSources']['jpeg'][0]['url'];
                }
            }
        }

        if (empty($images) && !empty($data['originalPhotos'])) {
            foreach ($data['originalPhotos'] as $photo) {
                if (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                } elseif (!empty($photo['mixedSources']['jpeg'][0]['url'])) {
                    $images[] = $photo['mixedSources']['jpeg'][0]['url'];
                }
            }
        }

        if (empty($images) && !empty($data['hugePhotos'])) {
            foreach ($data['hugePhotos'] as $photo) {
                if (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                }
            }
        }

        // Fall back to imgSrc if nothing else found
        if (empty($images) && !empty($data['imgSrc'])) {
            $images[] = $data['imgSrc'];
        }

        return array_values(array_unique($images));
    }

    /**
     * Upgrade a Zillow thumbnail URL to high resolution.
     * Converts -p_e.jpg (thumbnail) to -uncropped_scaled_within_1344_1008.jpg (hi-res).
     */
    public static function upgradeImageUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        // Replace thumbnail suffix with high-res suffix
        return preg_replace(
            '/-p_[a-e]\.jpg$/i',
            '-uncropped_scaled_within_1344_1008.jpg',
            $url
        );
    }

    /**
     * Normalize Zillow API results into a consistent format for our import system.
     */
    protected function normalizeResults(array $results): array
    {
        return array_map(function ($listing) {
            $address = $listing['address'] ?? [];

            return [
                'zillow_id' => $listing['id'] ?? null,
                'address' => $address['street'] ?? '',
                'city' => $address['city'] ?? '',
                'state' => $address['state'] ?? 'OK',
                'zip_code' => $address['zipcode'] ?? '',
                'price' => $listing['unformattedPrice'] ?? 0,
                'price_formatted' => $listing['price'] ?? '',
                'bedrooms' => $listing['beds'] ?? 0,
                'bathrooms' => $listing['baths'] ?? 0,
                'sqft' => $listing['area'] ?? $listing['livingArea'] ?? 0,
                'property_type' => $this->mapHomeType($listing['homeType'] ?? ''),
                'home_type_raw' => $listing['homeType'] ?? '',
                'latitude' => $listing['latLong']['latitude'] ?? null,
                'longitude' => $listing['latLong']['longitude'] ?? null,
                'image_url' => $listing['imgSrc'] ?? null,
                'zillow_url' => $listing['detailUrl'] ?? null,
                'days_on_zillow' => $listing['daysOnZillow'] ?? null,
                'zestimate' => $listing['zestimate'] ?? null,
                'lot_size' => $listing['lotAreaValue'] ?? null,
                'lot_size_unit' => $listing['lotAreaUnit'] ?? null,
                'status_text' => $listing['statusText'] ?? '',
                'is_fsbo' => ($listing['listingSubType']['is_FSBO'] ?? false),
            ];
        }, $results);
    }

    /**
     * Map Zillow homeType to our property_type values.
     */
    protected function mapHomeType(string $homeType): string
    {
        return match (strtoupper($homeType)) {
            'SINGLE_FAMILY' => 'single_family',
            'CONDO' => 'condo',
            'TOWNHOUSE' => 'townhouse',
            'MULTI_FAMILY' => 'multi_family',
            'LOT', 'LAND' => 'land',
            'MANUFACTURED', 'MOBILE' => 'mobile_home',
            default => 'single_family',
        };
    }
}
