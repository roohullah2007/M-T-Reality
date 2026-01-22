<?php

namespace App\Services;

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
    public const PHOTOS_EMAIL = 'photos@okbyowner.com';

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
     * Process an uploaded image: resize and convert to WebP
     *
     * @param UploadedFile $file The uploaded file
     * @param string $directory The storage directory
     * @return string|null The stored file path or null on failure
     */
    public static function processAndStore(UploadedFile $file, string $directory = 'properties'): ?string
    {
        try {
            // Validate file type
            if (!self::isValidImage($file)) {
                Log::warning('Invalid image file type: ' . $file->getMimeType());
                return null;
            }

            // Generate unique filename with .webp extension
            $filename = Str::uuid() . '.webp';
            $path = $directory . '/' . $filename;

            // Handle HEIC files - they need special processing
            $extension = strtolower($file->getClientOriginalExtension());
            $filePath = $file->getRealPath();

            // For HEIC files, check if ImageMagick can handle it
            if (in_array($extension, ['heic', 'heif'])) {
                Log::info('Processing HEIC/HEIF file: ' . $file->getClientOriginalName());
            }

            // Read and process the image using Intervention Image
            // Intervention Image v3 with imagick driver supports HEIC
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

            // Store the processed image
            Storage::disk('public')->put($path, (string) $encoded);

            Log::info('Successfully processed and stored image: ' . $path);

            return '/storage/' . $path;
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
     * Process multiple uploaded images
     *
     * @param array $files Array of UploadedFile objects
     * @param string $directory The storage directory
     * @param int|null $limit Maximum number of images to process
     * @return array Array of stored file paths
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
        return 20 * 1024 * 1024; // 20MB
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
     * Delete an image from storage
     *
     * @param string $path The image path (e.g., /storage/properties/image.webp)
     * @return bool
     */
    public static function delete(string $path): bool
    {
        try {
            // Remove /storage/ prefix to get the actual storage path
            $storagePath = str_replace('/storage/', '', $path);
            return Storage::disk('public')->delete($storagePath);
        } catch (\Exception $e) {
            Log::error('Image deletion failed: ' . $e->getMessage());
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
     * Create a ZIP file containing all property photos
     *
     * @param array $photos Array of photo paths
     * @param string $propertyTitle Property title for the ZIP filename
     * @return string|null Path to the created ZIP file or null on failure
     */
    public static function createPhotosZip(array $photos, string $propertyTitle): ?string
    {
        if (empty($photos)) {
            return null;
        }

        try {
            // Create a unique filename for the ZIP
            $safeName = Str::slug($propertyTitle);
            $zipFilename = "property-photos-{$safeName}-" . time() . '.zip';
            $zipPath = storage_path('app/temp/' . $zipFilename);

            // Ensure temp directory exists
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            $zip = new ZipArchive();
            if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                Log::error('Failed to create ZIP file: ' . $zipPath);
                return null;
            }

            $counter = 1;
            foreach ($photos as $photo) {
                // Convert storage path to actual file path
                $storagePath = str_replace('/storage/', '', $photo);
                $fullPath = storage_path('app/public/' . $storagePath);

                if (file_exists($fullPath)) {
                    // Get extension from the file
                    $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
                    $zipEntryName = sprintf('photo-%02d.%s', $counter, $extension);
                    $zip->addFile($fullPath, $zipEntryName);
                    $counter++;
                } else {
                    Log::warning('Photo file not found for ZIP: ' . $fullPath);
                }
            }

            $zip->close();

            return $zipPath;
        } catch (\Exception $e) {
            Log::error('Failed to create photos ZIP: ' . $e->getMessage());
            return null;
        }
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
        ];
    }
}
