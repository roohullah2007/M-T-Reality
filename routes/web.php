<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminPropertyController;
use App\Http\Controllers\Admin\AdminInquiryController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\AdminActivityController;
use App\Http\Controllers\Admin\AdminMediaOrderController;
use App\Http\Controllers\BuyerInquiryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\QrCodeController;
use App\Http\Controllers\MediaOrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// QR Code Short URL Redirect (public, no auth required)
Route::get('/p/{code}', [QrCodeController::class, 'handleScan'])->name('qr.scan');

// Public routes
Route::get('/', function () {
    $featuredProperties = \App\Models\Property::where('is_active', true)
        ->where('approval_status', 'approved')
        ->latest()
        ->take(6)
        ->get();

    return Inertia::render('Home', [
        'featuredProperties' => $featuredProperties
    ]);
})->name('home');

Route::get('/properties', [PropertyController::class, 'publicIndex'])->name('properties');
Route::get('/properties/{property}', [PropertyController::class, 'show'])->name('properties.show');

Route::get('/buyers', function () {
    return Inertia::render('Buyers');
})->name('buyers');

Route::get('/sellers', function () {
    return Inertia::render('Sellers');
})->name('sellers');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/faqs', function () {
    return Inertia::render('FAQs');
})->name('faqs');

Route::get('/mortgages', function () {
    return Inertia::render('Mortgages');
})->name('mortgages');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy-policy');

Route::get('/terms-of-use', function () {
    return Inertia::render('TermsOfUse');
})->name('terms-of-use');

// Packages & Media Ordering
Route::get('/our-packages', [MediaOrderController::class, 'index'])->name('packages');
Route::get('/packages', [MediaOrderController::class, 'index']); // Alias
Route::post('/media-order', [MediaOrderController::class, 'store'])->name('media-order.store');

Route::get('/list-property', function () {
    return Inertia::render('ListProperty');
})->name('list-property');

// Property submission route (public)
Route::post('/properties', [PropertyController::class, 'store'])->name('properties.store');

// Buyer inquiry submission route (public)
Route::post('/buyer-inquiry', [BuyerInquiryController::class, 'store'])->name('buyer-inquiry.store');

// Contact form submission route (public)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Property inquiry submission route (public)
Route::post('/inquiry', [InquiryController::class, 'store'])->name('inquiry.store');

// User Dashboard
Route::middleware(['auth', 'verified'])->prefix('dashboard')->name('dashboard')->group(function () {
    // Dashboard Overview
    Route::get('/', [UserDashboardController::class, 'index']);

    // Listings Management
    Route::get('/listings', [UserDashboardController::class, 'listings'])->name('.listings');
    Route::get('/listings/{property}/edit', [UserDashboardController::class, 'editListing'])->name('.listings.edit');
    Route::put('/listings/{property}', [UserDashboardController::class, 'updateListing'])->name('.listings.update');
    Route::delete('/listings/{property}', [UserDashboardController::class, 'destroyListing'])->name('.listings.destroy');

    // Messages (Inquiries)
    Route::get('/messages', [UserDashboardController::class, 'messages'])->name('.messages');
    Route::post('/messages/{inquiry}/read', [UserDashboardController::class, 'markMessageRead'])->name('.messages.read');
    Route::post('/messages/{inquiry}/responded', [UserDashboardController::class, 'markMessageResponded'])->name('.messages.responded');
    Route::delete('/messages/{inquiry}', [UserDashboardController::class, 'destroyMessage'])->name('.messages.destroy');

    // Favorites
    Route::get('/favorites', [UserDashboardController::class, 'favorites'])->name('.favorites');
    Route::post('/favorites/{property}', [UserDashboardController::class, 'addFavorite'])->name('.favorites.add');
    Route::delete('/favorites/{property}', [UserDashboardController::class, 'removeFavorite'])->name('.favorites.remove');

    // Service Requests (Upgrades)
    Route::get('/service-requests', [UserDashboardController::class, 'serviceRequests'])->name('.service-requests');
    Route::get('/listings/{property}/upgrade', [UserDashboardController::class, 'showUpgradeOptions'])->name('.listings.upgrade');
    Route::post('/listings/{property}/upgrade', [UserDashboardController::class, 'submitUpgradeRequest'])->name('.listings.upgrade.submit');
    Route::post('/service-requests/{serviceRequest}/cancel', [UserDashboardController::class, 'cancelUpgradeRequest'])->name('.service-requests.cancel');

    // QR Code Generation (Authenticated - for property owners)
    Route::get('/listings/{property}/qrcode', [QrCodeController::class, 'generate'])->name('.listings.qrcode');
    Route::get('/listings/{property}/qrcode/preview', [QrCodeController::class, 'preview'])->name('.listings.qrcode.preview');
    Route::get('/listings/{property}/qrcode/info', [QrCodeController::class, 'getStickerInfo'])->name('.listings.qrcode.info');

    // Order Free Materials (Stickers, Yard Signs)
    Route::post('/listings/{property}/order', [UserDashboardController::class, 'submitOrder'])->name('.listings.order');

    // Media Orders
    Route::get('/media-orders', [MediaOrderController::class, 'userOrders'])->name('.media-orders');
    Route::get('/media-orders/{mediaOrder}', [MediaOrderController::class, 'show'])->name('.media-orders.show');
    Route::post('/media-orders/{mediaOrder}/cancel', [MediaOrderController::class, 'cancel'])->name('.media-orders.cancel');
});

// User Profile routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes - Protected by admin middleware
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');

    // Properties Management
    Route::get('/properties', [AdminPropertyController::class, 'index'])->name('properties.index');
    Route::get('/properties/{property}', [AdminPropertyController::class, 'show'])->name('properties.show');
    Route::get('/properties/{property}/edit', [AdminPropertyController::class, 'edit'])->name('properties.edit');
    Route::put('/properties/{property}', [AdminPropertyController::class, 'update'])->name('properties.update');
    Route::delete('/properties/{property}', [AdminPropertyController::class, 'destroy'])->name('properties.destroy');
    Route::post('/properties/{property}/approve', [AdminPropertyController::class, 'approve'])->name('properties.approve');
    Route::post('/properties/{property}/reject', [AdminPropertyController::class, 'reject'])->name('properties.reject');
    Route::post('/properties/{property}/toggle-featured', [AdminPropertyController::class, 'toggleFeatured'])->name('properties.toggle-featured');
    Route::post('/properties/{property}/toggle-active', [AdminPropertyController::class, 'toggleActive'])->name('properties.toggle-active');
    Route::post('/properties/bulk-action', [AdminPropertyController::class, 'bulkAction'])->name('properties.bulk-action');

    // Inquiries Management
    Route::get('/inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::get('/inquiries/{inquiry}', [AdminInquiryController::class, 'show'])->name('inquiries.show');
    Route::put('/inquiries/{inquiry}', [AdminInquiryController::class, 'update'])->name('inquiries.update');
    Route::delete('/inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
    Route::post('/inquiries/{inquiry}/mark-read', [AdminInquiryController::class, 'markAsRead'])->name('inquiries.mark-read');
    Route::post('/inquiries/{inquiry}/mark-responded', [AdminInquiryController::class, 'markAsResponded'])->name('inquiries.mark-responded');
    Route::post('/inquiries/{inquiry}/archive', [AdminInquiryController::class, 'archive'])->name('inquiries.archive');
    Route::post('/inquiries/bulk-action', [AdminInquiryController::class, 'bulkAction'])->name('inquiries.bulk-action');

    // Contact Messages Management
    Route::get('/messages', [AdminContactController::class, 'index'])->name('messages.index');
    Route::get('/messages/{message}', [AdminContactController::class, 'show'])->name('messages.show');
    Route::put('/messages/{message}', [AdminContactController::class, 'update'])->name('messages.update');
    Route::delete('/messages/{message}', [AdminContactController::class, 'destroy'])->name('messages.destroy');
    Route::post('/messages/{message}/mark-read', [AdminContactController::class, 'markAsRead'])->name('messages.mark-read');
    Route::post('/messages/{message}/mark-responded', [AdminContactController::class, 'markAsResponded'])->name('messages.mark-responded');
    Route::post('/messages/{message}/archive', [AdminContactController::class, 'archive'])->name('messages.archive');
    Route::post('/messages/bulk-action', [AdminContactController::class, 'bulkAction'])->name('messages.bulk-action');

    // Buyer Inquiries Management
    Route::get('/buyer-inquiries', [BuyerInquiryController::class, 'index'])->name('buyer-inquiries.index');
    Route::get('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'show'])->name('buyer-inquiries.show');
    Route::put('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'update'])->name('buyer-inquiries.update');
    Route::delete('/buyer-inquiries/{inquiry}', [BuyerInquiryController::class, 'destroy'])->name('buyer-inquiries.destroy');

    // Activity Logs
    Route::get('/activity', [AdminActivityController::class, 'index'])->name('activity.index');
    Route::get('/activity/{activity}', [AdminActivityController::class, 'show'])->name('activity.show');
    Route::post('/activity/clear', [AdminActivityController::class, 'clear'])->name('activity.clear');

    // Settings
    Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/store', [AdminSettingsController::class, 'store'])->name('settings.store');
    Route::delete('/settings/{setting}', [AdminSettingsController::class, 'destroy'])->name('settings.destroy');
    Route::post('/settings/initialize', [AdminSettingsController::class, 'initializeDefaults'])->name('settings.initialize');

    // Media Orders Management
    Route::get('/media-orders', [AdminMediaOrderController::class, 'index'])->name('media-orders.index');
    Route::get('/media-orders/{mediaOrder}', [AdminMediaOrderController::class, 'show'])->name('media-orders.show');
    Route::post('/media-orders/{mediaOrder}/status', [AdminMediaOrderController::class, 'updateStatus'])->name('media-orders.status');
    Route::post('/media-orders/{mediaOrder}/paid', [AdminMediaOrderController::class, 'markPaid'])->name('media-orders.paid');
    Route::post('/media-orders/{mediaOrder}/notes', [AdminMediaOrderController::class, 'addNotes'])->name('media-orders.notes');
    Route::post('/media-orders/{mediaOrder}/schedule', [AdminMediaOrderController::class, 'schedule'])->name('media-orders.schedule');
    Route::delete('/media-orders/{mediaOrder}', [AdminMediaOrderController::class, 'destroy'])->name('media-orders.destroy');
});

require __DIR__.'/auth.php';
