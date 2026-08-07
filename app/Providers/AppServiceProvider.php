<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // This app verifies with a 6-digit code, not Laravel's signed link, so
        // send anyone the "verified" middleware turns away to the code page.
        EnsureEmailIsVerified::redirectTo('verification.code');
    }
}
