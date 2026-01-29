<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{
    /**
     * Geocode an address using Google Geocoding API
     *
     * @param string $address
     * @param string $city
     * @param string $state
     * @param string $zipCode
     * @return array|null Returns ['latitude' => float, 'longitude' => float] or null on failure
     */
    public static function geocode(string $address, string $city, string $state, string $zipCode): ?array
    {
        $apiKey = config('services.google.maps_api_key');

        if (empty($apiKey)) {
            Log::warning('Google Maps API key not configured');
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        }

        try {
            $fullAddress = "{$address}, {$city}, {$state} {$zipCode}, USA";

            $response = Http::timeout(10)
                ->get('https://maps.googleapis.com/maps/api/geocode/json', [
                    'address' => $fullAddress,
                    'key' => $apiKey,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if ($data['status'] === 'OK' && !empty($data['results'])) {
                    $location = $data['results'][0]['geometry']['location'];
                    return [
                        'latitude' => (float) $location['lat'],
                        'longitude' => (float) $location['lng'],
                    ];
                }

                Log::warning('Google Geocoding returned no results', [
                    'address' => $fullAddress,
                    'status' => $data['status'] ?? 'unknown',
                ]);

                // Fallback to Nominatim if Google fails (REQUEST_DENIED, ZERO_RESULTS, etc.)
                return self::geocodeWithNominatim($address, $city, $state, $zipCode);
            }

            // Fallback to Nominatim on HTTP failure
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        } catch (\Exception $e) {
            Log::error('Google Geocoding error', [
                'error' => $e->getMessage(),
                'address' => "{$address}, {$city}, {$state} {$zipCode}",
            ]);

            // Fallback to Nominatim
            return self::geocodeWithNominatim($address, $city, $state, $zipCode);
        }
    }

    /**
     * Fallback geocoding using OpenStreetMap Nominatim API (free, no API key required)
     */
    private static function geocodeWithNominatim(string $address, string $city, string $state, string $zipCode): ?array
    {
        try {
            $fullAddress = "{$address}, {$city}, {$state} {$zipCode}, USA";

            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'OKByOwner/1.0 (contact@okbyowner.com)',
                ])
                ->get('https://nominatim.openstreetmap.org/search', [
                    'q' => $fullAddress,
                    'format' => 'json',
                    'limit' => 1,
                    'addressdetails' => 1,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                if (!empty($data) && isset($data[0]['lat']) && isset($data[0]['lon'])) {
                    return [
                        'latitude' => (float) $data[0]['lat'],
                        'longitude' => (float) $data[0]['lon'],
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Nominatim Geocoding error', [
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Geocode a property if it doesn't have coordinates
     *
     * @param \App\Models\Property $property
     * @return bool Returns true if coordinates were updated
     */
    public static function geocodeProperty($property): bool
    {
        // Skip if already has coordinates
        if ($property->latitude && $property->longitude) {
            return false;
        }

        $coordinates = self::geocode(
            $property->address,
            $property->city,
            $property->state,
            $property->zip_code
        );

        if ($coordinates) {
            $property->update([
                'latitude' => $coordinates['latitude'],
                'longitude' => $coordinates['longitude'],
            ]);
            return true;
        }

        return false;
    }
}
