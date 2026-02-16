<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ZillowApiService
{
    protected string $apiKey;
    protected string $apiHost;
    protected string $imagesHost;
    protected int $maxRetries = 3;

    public function __construct()
    {
        $this->apiKey = config('services.zillow_rapidapi.key', '');
        $this->apiHost = config('services.zillow_rapidapi.host', 'real-estate101.p.rapidapi.com');
        $this->imagesHost = config('services.zillow_rapidapi.images_host', 'zillow-com1.p.rapidapi.com');
    }

    /**
     * Make an API request with retry logic for 429 rate limits.
     */
    protected function requestWithRetry(string $host, string $url, array $params, int $timeout = 30): ?\Illuminate\Http\Client\Response
    {
        $attempt = 0;

        while ($attempt < $this->maxRetries) {
            $response = Http::withHeaders([
                'x-rapidapi-host' => $host,
                'x-rapidapi-key' => $this->apiKey,
            ])->timeout($timeout)->get($url, $params);

            if ($response->status() !== 429) {
                return $response;
            }

            $attempt++;
            if ($attempt < $this->maxRetries) {
                // Exponential backoff: 2s, 4s
                $wait = pow(2, $attempt);
                Log::info("Zillow API rate limited (429), retrying in {$wait}s (attempt {$attempt}/{$this->maxRetries})");
                sleep($wait);
            }
        }

        // All retries exhausted, return the last 429 response
        return $response;
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

            $response = $this->requestWithRetry(
                $this->apiHost,
                "https://{$this->apiHost}/api/search",
                $params,
                30
            );

            if ($response->failed()) {
                $body = $response->json();
                $error = $response->status() === 429
                    ? 'Rate limited by Zillow API. Please wait a moment and try again.'
                    : ($body['error'] ?? 'API request failed (HTTP ' . $response->status() . ')');
                return [
                    'success' => false,
                    'error' => $error,
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
     * Fetch property details (images + contact info) by zpid using zillow-com1 API.
     * Returns ['images' => [...], 'contact' => ['name' => ..., 'phone' => ..., 'email' => ...]].
     */
    public function fetchPropertyDetails(string $zpid): array
    {
        $empty = ['images' => [], 'contact' => ['name' => '', 'phone' => '', 'email' => '']];

        if (!$this->isConfigured()) {
            return $empty;
        }

        try {
            $response = $this->requestWithRetry(
                $this->imagesHost,
                "https://{$this->imagesHost}/property",
                ['zpid' => $zpid],
                15
            );

            if ($response->failed()) {
                Log::warning("Zillow /property API failed for zpid {$zpid}: HTTP " . $response->status());
                return $empty;
            }

            $data = $response->json();
            if (!$data) {
                Log::warning("Zillow /property API returned empty response for zpid {$zpid}");
                return $empty;
            }

            $images = $this->extractImages($data);
            Log::info("Zillow /property for zpid {$zpid}: extracted " . count($images) . " images");

            return [
                'images' => $images,
                'contact' => $this->extractContact($data),
            ];
        } catch (\Exception $e) {
            Log::warning("Zillow property API error for zpid {$zpid}: " . $e->getMessage());
            return $empty;
        }
    }

    /**
     * Scrape all property images from a Zillow listing page using Puppeteer with stealth mode.
     * Calls a Node.js script that uses a real Chrome browser to bypass PerimeterX bot detection.
     * Returns array of hi-res image URLs (cc_ft_1536.jpg format, ~1536px wide).
     */
    public function scrapePropertyImages(string $detailUrl): array
    {
        try {
            // Ensure full URL
            if (!str_starts_with($detailUrl, 'http')) {
                $detailUrl = "https://www.zillow.com{$detailUrl}";
            }

            $scriptPath = base_path('scripts/scrape-zillow-images.cjs');
            if (!file_exists($scriptPath)) {
                Log::warning("Zillow scraper script not found at {$scriptPath}");
                return [];
            }

            $escapedUrl = escapeshellarg($detailUrl);
            $scriptPathNormalized = str_replace('\\', '/', $scriptPath);
            $command = 'node "' . $scriptPathNormalized . '" ' . $escapedUrl . ' 2>&1';

            Log::info("Scraping Zillow images from: {$detailUrl}");

            $output = null;
            $returnCode = null;
            exec($command, $output, $returnCode);

            // The last line of output is the JSON array (stdout), earlier lines are debug (stderr)
            $jsonOutput = end($output) ?: '[]';
            $images = json_decode($jsonOutput, true);

            if (!is_array($images)) {
                Log::warning("Zillow scraper returned invalid JSON for {$detailUrl}");
                return [];
            }

            Log::info("Zillow scraper for {$detailUrl}: found " . count($images) . " property photos");

            return $images;
        } catch (\Exception $e) {
            Log::warning("Zillow scrape error for {$detailUrl}: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Extract contact info from property detail response.
     * Checks attributionInfo (agent/broker) and contactRecipients.
     */
    protected function extractContact(array $data): array
    {
        $name = '';
        $phone = '';
        $email = '';

        // Try attributionInfo first (agent info — for FSBO, the "agent" is the owner)
        $attr = $data['attributionInfo'] ?? [];
        if (!empty($attr['agentName'])) {
            $name = $attr['agentName'];
        }
        if (!empty($attr['agentPhoneNumber'])) {
            $phone = $attr['agentPhoneNumber'];
        }
        if (!empty($attr['agentEmail'])) {
            $email = $attr['agentEmail'];
        }

        // Fall back to broker info if no agent info
        if (empty($name) && !empty($attr['brokerName'])) {
            $name = $attr['brokerName'];
        }
        if (empty($phone) && !empty($attr['brokerPhoneNumber'])) {
            $phone = $attr['brokerPhoneNumber'];
        }

        // Try contactRecipients array as another fallback
        $recipients = $data['contactRecipients'] ?? [];
        if (!empty($recipients) && is_array($recipients)) {
            $first = $recipients[0] ?? [];
            if (empty($name) && !empty($first['agent_reason'])) {
                // contactRecipients uses different field names
                $name = $first['display_name'] ?? $first['full_name'] ?? '';
            } elseif (empty($name)) {
                $name = $first['display_name'] ?? $first['full_name'] ?? '';
            }
            if (empty($phone) && !empty($first['phone'])) {
                $phone = is_array($first['phone']) ? ($first['phone']['areacode'] ?? '') . ($first['phone']['number'] ?? '') : $first['phone'];
            }
            if (empty($email) && !empty($first['email'])) {
                $email = $first['email'];
            }
        }

        // Also check top-level listing fields
        if (empty($name) && !empty($data['listingAgent']['name'])) {
            $name = $data['listingAgent']['name'];
        }
        if (empty($phone) && !empty($data['listingAgent']['phone'])) {
            $phone = $data['listingAgent']['phone'];
        }

        return [
            'name' => trim($name),
            'phone' => trim($phone),
            'email' => trim($email),
        ];
    }

    /**
     * Extract all image URLs from a property detail response.
     * Handles various response structures from different zillow-com1 endpoints.
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
                } elseif (!empty($photo['mixedSources']['jpeg'])) {
                    // Get largest JPEG like we do for responsivePhotos
                    $jpegs = $photo['mixedSources']['jpeg'];
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                } elseif (!empty($photo['mixedSources']['jpeg'][0]['url'])) {
                    $images[] = $photo['mixedSources']['jpeg'][0]['url'];
                }
            }
        }

        if (empty($images) && !empty($data['originalPhotos'])) {
            foreach ($data['originalPhotos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                } elseif (!empty($photo['mixedSources']['jpeg'])) {
                    $jpegs = $photo['mixedSources']['jpeg'];
                    usort($jpegs, fn($a, $b) => ($b['width'] ?? 0) - ($a['width'] ?? 0));
                    if (!empty($jpegs[0]['url'])) {
                        $images[] = $jpegs[0]['url'];
                    }
                }
            }
        }

        if (empty($images) && !empty($data['hugePhotos'])) {
            foreach ($data['hugePhotos'] as $photo) {
                if (is_string($photo)) {
                    $images[] = $photo;
                } elseif (!empty($photo['url'])) {
                    $images[] = $photo['url'];
                }
            }
        }

        // Try 'images' array (common in /images endpoint response)
        if (empty($images) && !empty($data['images'])) {
            foreach ($data['images'] as $img) {
                if (is_string($img)) {
                    $images[] = $img;
                } elseif (is_array($img) && !empty($img['url'])) {
                    $images[] = $img['url'];
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
