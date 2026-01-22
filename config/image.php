<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports "gd" and "imagick" as image processing
    | drivers. By default, this value is set to "gd" (bundled with PHP).
    |
    | For HEIC/HEIF support (iPhone photos), ImageMagick is recommended.
    | Make sure PHP ImageMagick extension is installed and enabled.
    |
    | To install ImageMagick on Windows:
    | 1. Download ImageMagick with PHP bindings
    | 2. Add extension=imagick to php.ini
    |
    | To install ImageMagick on Ubuntu/Debian:
    | sudo apt-get install php-imagick
    |
    | To install ImageMagick on macOS:
    | brew install imagemagick
    | pecl install imagick
    |
    */

    'driver' => env('IMAGE_DRIVER', 'imagick'),

    /*
    |--------------------------------------------------------------------------
    | Options for Image Driver
    |--------------------------------------------------------------------------
    |
    | Additional driver-specific options.
    |
    */

    'options' => [
        // Enable auto-orientation based on EXIF data
        'autoOrientation' => true,
    ],

];
