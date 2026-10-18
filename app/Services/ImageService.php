<?php

namespace App\Services;

use App\Jobs\ProcessImageUpload;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;
use ZipArchive;

class ImageService
{
    /**
     * Maximum dimension for resized images (1920px = 1080p width)
     */
    protected const MAX_DIMENSION = 1920;

    /**
     * WebP quality (0-100)
     */
    protected const WEBP_QUALITY = 85;

    /**
     * Maximum photos allowed on initial listing
     */
    public const MAX_INITIAL_PHOTOS = 50;

    /**
     * Maximum photos allowed per property total
     */
    public const MAX_TOTAL_PHOTOS = 50;

    /**
     * Maximum photos users can email
     */
    public const MAX_EMAIL_PHOTOS = 50;

    /**
     * Email address for photo submissions
     */
    public const PHOTOS_EMAIL = 'photos@mandtrealty.com';

    /**
     * Number of photos that triggers queue processing
     */
    public const QUEUE_THRESHOLD = 5;

    /**
     * Supported input formats including HEIC
     */
    protected const SUPPORTED_FORMATS = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'image/heif',
    ];

    /**
     * Supported file extensions
     */
    protected const SUPPORTED_EXTENSIONS = [
        'jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'
    ];

    /**
     * Process an uploaded image: resize, convert to WebP, and upload to CDN
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory The storage directory
     * @param bool $useQueue Whether to use queue for processing
     * @return string|null The CDN URL or local path, or null on failure
     */
    public static function processAndStore(UploadedFile $file, string $directory = 'properties', bool $useQueue = false): ?string
    {
        try {
            // Validate file type
            if (!self::isValidImage($file)) {
                Log::warning('Invalid image file type: ' . $file->getMimeType());
                return null;
            }

            // Generate unique filename with .webp extension
            $filename = Str::uuid() . '.webp';
            $remotePath = $directory . '/' . $filename;

            // Handle HEIC files - they need special processing
            $extension = strtolower($file->getClientOriginalExtension());
            $filePath = $file->getRealPath();

            // For HEIC files, check if ImageMagick can handle it
            if (in_array($extension, ['heic', 'heif'])) {
                Log::info('Processing HEIC/HEIF file: ' . $file->getClientOriginalName());
            }

            // Read and process the image using Intervention Image
            $image = Image::read($filePath);

            // Auto-orient the image based on EXIF data (important for phone photos)
            $image = $image->orient();

            // Get original dimensions
            $width = $image->width();
            $height = $image->height();

            // Resize if larger than max dimension while maintaining aspect ratio
            if ($width > self::MAX_DIMENSION || $height > self::MAX_DIMENSION) {
                $image = $image->scaleDown(self::MAX_DIMENSION, self::MAX_DIMENSION);
                Log::info("Resized image from {$width}x{$height} to fit within " . self::MAX_DIMENSION . "px");
            }

            // Encode to WebP with quality setting
            $encoded = $image->encode(new WebpEncoder(self::WEBP_QUALITY));
            $webpContent = (string) $encoded;

            // Upload to Bunny CDN if configured
            if (BunnyCDNService::isConfigured()) {
                $bunny = new BunnyCDNService();
                $uploaded = $bunny->uploadContent($webpContent, $remotePath);

                if ($uploaded) {
                    Log::info('Successfully uploaded image to Bunny CDN: ' . $remotePath);
                    // Return CDN URL
                    return BunnyCDNService::getUrl($remotePath);
                } else {
                    Log::warning('Bunny CDN upload failed, falling back to local storage');
                    // Fallback to local storage
                    Storage::disk('public')->put($remotePath, $webpContent);
                    return '/storage/' . $remotePath;
                }
            } else {
                // Use local storage
                Storage::disk('public')->put($remotePath, $webpContent);
                Log::info('Successfully processed and stored image locally: ' . $remotePath);
                return '/storage/' . $remotePath;
            }
        } catch (\Exception $e) {
            Log::error('Image processing failed: ' . $e->getMessage(), [
                'file' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'extension' => $file->getClientOriginalExtension(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    /**
     * Queue an image for processing (for bulk uploads)
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory The storage directory
     * @return string|null Temporary identifier or null on failure
     */
    public static function queueForProcessing(UploadedFile $file, string $directory = 'properties'): ?string
    {
        try {
            // Validate file type
            if (!self::isValidImage($file)) {
                Log::warning('Invalid image file type for queue: ' . $file->getMimeType());
                return null;
            }

            // Store file temporarily
            $tempDir = storage_path('app/temp/uploads');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            $tempFileName = Str::uuid() . '_' . time();
            $tempFilePath = $tempDir . '/' . $tempFileName;

            // Move uploaded file to temp location
            $file->move($tempDir, $tempFileName);

            // Dispatch job
            ProcessImageUpload::dispatch(
                $tempFilePath,
                $file->getClientOriginalName(),
                $directory
            );

            Log::info('Image queued for processing: ' . $file->getClientOriginalName());

            return $tempFileName;
        } catch (\Exception $e) {
            Log::error('Failed to queue image for processing: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Process multiple uploaded images
     *
     * @param array $files Array of UploadedFile objects
     * @param string $directory The storage directory
     * @param int|null $limit Maximum number of images to process
     * @return array Array of stored file paths/URLs
     */
    public static function processMultiple(array $files, string $directory = 'properties', ?int $limit = null): array
    {
        $paths = [];
        $count = 0;

        foreach ($files as $file) {
            // Check limit
            if ($limit !== null && $count >= $limit) {
                Log::info("Reached photo limit of {$limit}, skipping remaining files");
                break;
            }

            if ($file instanceof UploadedFile) {
                $path = self::processAndStore($file, $directory);
                if ($path) {
                    $paths[] = $path;
                    $count++;
                }
            }
        }

        return $paths;
    }

    /**
     * Check if the file is a valid image
     *
     * @param UploadedFile $file
     * @return bool
     */
    public static function isValidImage(UploadedFile $file): bool
    {
        $mimeType = strtolower($file->getMimeType());
        $extension = strtolower($file->getClientOriginalExtension());

        // Check mime type
        if (in_array($mimeType, self::SUPPORTED_FORMATS)) {
            return true;
        }

        // Fallback to extension check for HEIC (mime detection can be unreliable)
        if (in_array($extension, self::SUPPORTED_EXTENSIONS)) {
            return true;
        }

        // Additional check: application/octet-stream with valid extension (HEIC sometimes)
        if ($mimeType === 'application/octet-stream' && in_array($extension, ['heic', 'heif'])) {
            return true;
        }

        return false;
    }

    /**
     * Get the maximum allowed file size in bytes
     *
     * @return int
     */
    public static function getMaxFileSize(): int
    {
        return 30 * 1024 * 1024; // 30MB
    }

    /**
     * Get supported file extensions as a string
     *
     * @return string
     */
    public static function getSupportedExtensions(): string
    {
        return implode(',', self::SUPPORTED_EXTENSIONS);
    }

    /**
     * Get supported file extensions as an array
     *
     * @return array
     */
    public static function getSupportedExtensionsArray(): array
    {
        return self::SUPPORTED_EXTENSIONS;
    }

    /**
     * Delete an image from storage (both CDN and local)
     *
     * @param string $path The image path or URL
     * @return bool
     */
    public static function delete(string $path): bool
    {
        try {
            $deleted = false;

            // Check if it's a CDN URL
            $pullZone = config('services.bunnycdn.pull_zone');
            if ($pullZone && str_contains($path, $pullZone)) {
                // Extract path from CDN URL
                $remotePath = parse_url($path, PHP_URL_PATH);
                $remotePath = ltrim($remotePath, '/');

                if (BunnyCDNService::isConfigured()) {
                    $bunny = new BunnyCDNService();
                    $deleted = $bunny->delete($remotePath);
                }

                // Also try to delete from local storage if it exists
                if (Storage::disk('public')->exists($remotePath)) {
                    Storage::disk('public')->delete($remotePath);
                }
            } else {
                // Local storage path
                $storagePath = str_replace('/storage/', '', $path);

                // Delete from Bunny CDN if configured (might have been synced)
                if (BunnyCDNService::isConfigured()) {
                    $bunny = new BunnyCDNService();
                    $bunny->delete($storagePath);
                }

                // Delete from local storage
                $deleted = Storage::disk('public')->delete($storagePath);
            }

            return $deleted;
        } catch (\Exception $e) {
            Log::error('Image deletion failed: ' . $e->getMessage(), [
                'path' => $path
            ]);
            return false;
        }
    }

    /**
     * Delete multiple images
     *
     * @param array $paths Array of image paths
     * @return int Number of successfully deleted images
     */
    public static function deleteMultiple(array $paths): int
    {
        $deleted = 0;
        foreach ($paths as $path) {
            if (self::delete($path)) {
                $deleted++;
            }
        }
        return $deleted;
    }

    /**
     * Get the public URL for an image path
     * Handles both CDN URLs and local storage paths
     *
     * @param string $path The stored path
     * @return string The public URL
     */
    public static function getPublicUrl(string $path): string
    {
        // If already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        // If Bunny CDN is configured, convert to CDN URL
        if (BunnyCDNService::isConfigured()) {
            return BunnyCDNService::getUrl($path);
        }

        // Return local URL
        if (!str_starts_with($path, '/')) {
            return '/storage/' . $path;
        }

        return $path;
    }

    /**
     * Migrate an existing local image to CDN
     *
     * @param string $localPath Local storage path (e.g., /storage/properties/uuid.webp)
     * @return string|null CDN URL or null on failure
     */
    public static function migrateToCdn(string $localPath): ?string
    {
        if (!BunnyCDNService::isConfigured()) {
            return null;
        }

        try {
            $storagePath = str_replace('/storage/', '', $localPath);
            $fullPath = storage_path('app/public/' . $storagePath);

            if (!file_exists($fullPath)) {
                Log::warning('File not found for CDN migration: ' . $fullPath);
                return null;
            }

            $bunny = new BunnyCDNService();
            if ($bunny->upload($fullPath, $storagePath)) {
                Log::info('Successfully migrated image to CDN: ' . $storagePath);
                return BunnyCDNService::getUrl($storagePath);
            }

            return null;
        } catch (\Exception $e) {
            Log::error('CDN migration failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Validate a requested photo order against the stored photos.
     *
     * Accepts either an ordered list of photo paths or a list of indices into
     * $current. The result must contain exactly the same photos (a permutation),
     * so a stale or tampered request can neither drop nor inject photos.
     * The first photo in the returned array is the main photo.
     *
     * @return array|null The reordered photos, or null if the request is invalid
     */
    public static function reorderPhotos(array $current, array $requested, bool $byIndex = false): ?array
    {
        $current = array_values($current);

        if ($byIndex) {
            $ordered = [];
            foreach ($requested as $index) {
                if (!is_numeric($index) || !array_key_exists((int) $index, $current)) {
                    return null;
                }
                $ordered[] = $current[(int) $index];
            }
            // Legacy callers may send only the moved indices; keep the rest in place.
            $usedIndices = array_map('intval', $requested);
            if (count(array_unique($usedIndices)) !== count($usedIndices)) {
                return null;
            }
            foreach ($current as $i => $photo) {
                if (!in_array($i, $usedIndices, true)) {
                    $ordered[] = $photo;
                }
            }
            return $ordered;
        }

        $requested = array_values($requested);
        $a = $current;
        $b = $requested;
        sort($a);
        sort($b);

        return $a === $b ? $requested : null;
    }

    /**
     * Create a ZIP file containing all property photos, in their display order
     * (photo-01 is the main photo).
     *
     * Photos can be stored three ways, and all three must work:
     *  - local paths ("/storage/properties/x.webp", or a full URL on this site)
     *  - Bunny CDN URLs
     *  - external URLs (e.g. Zillow-imported listings)
     * The old version only handled the first two and silently skipped the rest;
     * when nothing was added, ZipArchive never wrote the file and the download
     * failed with "Failed to create ZIP file".
     *
     * @param array $photos Array of photo paths/URLs
     * @param string $propertyTitle Property title for the ZIP filename
     * @return string|null Path to the created ZIP file or null on failure
     */
    public static function createPhotosZip(array $photos, string $propertyTitle): ?string
    {
        $photos = array_values(array_filter($photos, fn ($p) => is_string($p) && trim($p) !== ''));
        if (empty($photos)) {
            return null;
        }

        if (!class_exists(ZipArchive::class)) {
            Log::error('Photos ZIP: the PHP zip extension is not installed.');
            return null;
        }

        @set_time_limit(300);

        $tempDir = storage_path('app/temp');
        if (!is_dir($tempDir) && !@mkdir($tempDir, 0755, true) && !is_dir($tempDir)) {
            Log::error('Photos ZIP: could not create temp directory ' . $tempDir);
            return null;
        }

        $safeName = Str::slug($propertyTitle) ?: 'property';
        $zipPath = $tempDir . '/property-photos-' . $safeName . '-' . Str::random(8) . '.zip';
        $downloaded = [];

        try {
            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                Log::error('Photos ZIP: failed to open ' . $zipPath);
                return null;
            }

            $counter = 1;
            foreach ($photos as $photo) {
                $file = self::resolvePhotoForZip($photo, $tempDir);

                if (!$file) {
                    Log::warning('Photos ZIP: could not read photo ' . $photo);
                    continue;
                }

                if ($file['temp']) {
                    $downloaded[] = $file['path'];
                }

                $zip->addFile($file['path'], sprintf('photo-%02d.%s', $counter, $file['ext']));
                $counter++;
            }

            $added = $zip->numFiles;
            // An empty archive is never written to disk, so bail out explicitly.
            if ($added === 0) {
                $zip->close();
                Log::error('Photos ZIP: none of the ' . count($photos) . ' photos could be read.');
                return null;
            }

            if ($zip->close() !== true || !file_exists($zipPath)) {
                Log::error('Photos ZIP: failed to write ' . $zipPath);
                return null;
            }

            return $zipPath;
        } catch (\Throwable $e) {
            Log::error('Failed to create photos ZIP: ' . $e->getMessage());
            @unlink($zipPath);
            return null;
        } finally {
            // addFile() reads the files at close(), so temp downloads go only now.
            foreach ($downloaded as $tmp) {
                @unlink($tmp);
            }
        }
    }

    /**
     * Turn a stored photo reference into a readable file on disk.
     *
     * @return array{path: string, ext: string, temp: bool}|null
     */
    protected static function resolvePhotoForZip(string $photo, string $tempDir): ?array
    {
        $photo = trim($photo);
        $isUrl = (bool) preg_match('#^https?://#i', $photo);

        // A full URL that points at this site's own /storage is a local file.
        if ($isUrl) {
            $appHost = parse_url((string) config('app.url'), PHP_URL_HOST);
            $host = parse_url($photo, PHP_URL_HOST);
            $urlPath = (string) parse_url($photo, PHP_URL_PATH);
            if ($host && ($host === $appHost || $host === request()->getHost()) && str_starts_with($urlPath, '/storage/')) {
                $photo = rawurldecode($urlPath);
                $isUrl = false;
            }
        }

        if (!$isUrl) {
            $local = self::localPublicPath($photo);
            if ($local) {
                return ['path' => $local, 'ext' => self::zipExtension($local), 'temp' => false];
            }

            // Not on local disk: it may have been synced to the CDN only.
            if (!BunnyCDNService::isConfigured()) {
                return null;
            }
            $photo = BunnyCDNService::getUrl($photo);
        }

        return self::downloadPhotoForZip($photo, $tempDir);
    }

    /**
     * Map a stored local path to an absolute file inside the public disk,
     * refusing anything that escapes it (e.g. "../../.env").
     */
    protected static function localPublicPath(string $path): ?string
    {
        $relative = ltrim(str_replace('\\', '/', $path), '/');
        if (str_starts_with($relative, 'storage/')) {
            $relative = substr($relative, 8);
        }
        if ($relative === '' || str_contains($relative, '..')) {
            return null;
        }

        $root = realpath(Storage::disk('public')->path(''));
        $full = realpath(Storage::disk('public')->path($relative));

        if (!$root || !$full || !is_file($full) || !str_starts_with($full, $root . DIRECTORY_SEPARATOR)) {
            return null;
        }

        return $full;
    }

    /**
     * Download a remote photo (CDN or external) to a temp file.
     * Only public http(s) hosts are fetched, so a stored "photo" cannot be
     * used to reach internal addresses.
     *
     * @return array{path: string, ext: string, temp: bool}|null
     */
    protected static function downloadPhotoForZip(string $url, string $tempDir): ?array
    {
        $host = parse_url($url, PHP_URL_HOST);
        if (!$host || !preg_match('#^https?://#i', $url)) {
            return null;
        }

        $ips = @gethostbynamel($host) ?: [];
        if (empty($ips)) {
            return null;
        }
        foreach ($ips as $ip) {
            if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                Log::warning('Photos ZIP: refusing to fetch non-public host ' . $host);
                return null;
            }
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(30)
                ->withHeaders(['User-Agent' => 'Mozilla/5.0 (compatible; ' . config('app.name', 'Laravel') . ' photo export)'])
                ->withOptions(['allow_redirects' => false])
                ->get($url);
        } catch (\Throwable $e) {
            Log::warning('Photos ZIP: download failed for ' . $url . ': ' . $e->getMessage());
            return null;
        }

        $contentType = strtolower((string) $response->header('Content-Type'));
        if (!$response->successful() || $response->body() === '' || !str_starts_with($contentType, 'image/')) {
            return null;
        }

        $ext = self::zipExtension((string) parse_url($url, PHP_URL_PATH), $contentType);
        $tmp = $tempDir . '/photo-' . Str::random(16) . '.' . $ext;
        if (file_put_contents($tmp, $response->body()) === false) {
            return null;
        }

        return ['path' => $tmp, 'ext' => $ext, 'temp' => true];
    }

    /**
     * Pick a sensible file extension for a ZIP entry.
     */
    protected static function zipExtension(string $path, ?string $contentType = null): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif', 'avif'], true)) {
            return $ext;
        }

        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/gif' => 'gif',
            'image/webp' => 'webp',
            'image/avif' => 'avif',
            'image/heic' => 'heic',
        ];
        $type = $contentType ? trim(explode(';', $contentType)[0]) : '';

        return $map[$type] ?? 'jpg';
    }

    /**
     * Clean up old temporary ZIP files
     *
     * @param int $maxAgeMinutes Maximum age of temp files in minutes
     * @return int Number of files deleted
     */
    public static function cleanupTempFiles(int $maxAgeMinutes = 60): int
    {
        $deleted = 0;
        $tempPath = storage_path('app/temp');

        if (!file_exists($tempPath)) {
            return 0;
        }

        $files = glob($tempPath . '/*.zip');
        $now = time();

        foreach ($files as $file) {
            if (($now - filemtime($file)) > ($maxAgeMinutes * 60)) {
                if (unlink($file)) {
                    $deleted++;
                }
            }
        }

        // Also clean up old upload temp files
        $uploadTempPath = storage_path('app/temp/uploads');
        if (file_exists($uploadTempPath)) {
            $uploadFiles = glob($uploadTempPath . '/*');
            foreach ($uploadFiles as $file) {
                if (is_file($file) && ($now - filemtime($file)) > ($maxAgeMinutes * 60)) {
                    if (unlink($file)) {
                        $deleted++;
                    }
                }
            }
        }

        return $deleted;
    }

    /**
     * Get photo upload guidelines for users
     *
     * @return array
     */
    public static function getUploadGuidelines(): array
    {
        return [
            'initial_limit' => self::MAX_INITIAL_PHOTOS,
            'total_limit' => self::MAX_TOTAL_PHOTOS,
            'email_limit' => self::MAX_EMAIL_PHOTOS,
            'photos_email' => self::PHOTOS_EMAIL,
            'max_file_size_mb' => self::getMaxFileSize() / (1024 * 1024),
            'supported_formats' => self::SUPPORTED_EXTENSIONS,
            'supported_formats_display' => 'JPG, PNG, GIF, WebP, HEIC (iPhone)',
            'max_dimension' => self::MAX_DIMENSION,
            'output_format' => 'WebP (optimized)',
            'cdn_enabled' => BunnyCDNService::isConfigured(),
        ];
    }
}
