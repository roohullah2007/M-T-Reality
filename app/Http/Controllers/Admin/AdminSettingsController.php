<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\TestEmail;
use App\Models\Setting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $settingData) {
            $setting = Setting::where('key', $settingData['key'])->first();

            if ($setting) {
                $oldValue = $setting->value;
                $setting->update(['value' => $settingData['value']]);

                if ($oldValue !== $settingData['value']) {
                    ActivityLog::log('setting_updated', $setting, ['value' => $oldValue], ['value' => $settingData['value']], "Updated setting: {$setting->key}");
                }
            }
        }

        Setting::clearCache();

        return back()->with('success', 'Settings updated successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|unique:settings,key',
            'value' => 'nullable',
            'type' => 'required|in:string,boolean,integer,json',
            'group' => 'required|string',
            'label' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $setting = Setting::create($validated);

        ActivityLog::log('setting_created', $setting, null, $validated, "Created setting: {$setting->key}");

        return back()->with('success', 'Setting created successfully.');
    }

    public function destroy(Setting $setting)
    {
        $settingKey = $setting->key;

        ActivityLog::log('setting_deleted', $setting, $setting->toArray(), null, "Deleted setting: {$settingKey}");

        $setting->delete();
        Setting::clearCache();

        return back()->with('success', 'Setting deleted successfully.');
    }

    /**
     * Send a test email to the configured admin email address.
     *
     * Attempts to send even if email notifications are disabled, so admins
     * can verify their mail configuration before enabling notifications.
     */
    public function sendTestEmail()
    {
        $adminEmail = trim((string) Setting::get('admin_email', ''));

        if ($adminEmail === '') {
            return response()->json([
                'success' => false,
                'message' => 'Admin email is not set. Please set the "Admin Email" setting first.',
            ], 422);
        }

        if (!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'success' => false,
                'message' => "The configured admin email \"{$adminEmail}\" is not a valid email address.",
            ], 422);
        }

        try {
            Mail::to($adminEmail)->send(new TestEmail($adminEmail));
        } catch (\Throwable $e) {
            Log::error('Failed to send test email to ' . $adminEmail . ': ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email (mailer: ' . config('mail.default') . '): ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => "Test email sent to {$adminEmail}",
            'admin_email' => $adminEmail,
        ]);
    }

    /**
     * Initialize default settings
     */
    public function initializeDefaults()
    {
        $defaults = [
            // General Settings
            ['key' => 'site_name', 'value' => 'M&T Realty Group', 'type' => 'string', 'group' => 'general', 'label' => 'Site Name'],
            ['key' => 'site_tagline', 'value' => 'Licensed Real Estate Brokerage in Oklahoma', 'type' => 'string', 'group' => 'general', 'label' => 'Site Tagline'],
            ['key' => 'contact_email', 'value' => 'team@mandtrealty.com', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Email'],
            ['key' => 'contact_phone', 'value' => '(555) 123-4567', 'type' => 'string', 'group' => 'general', 'label' => 'Contact Phone'],
            ['key' => 'address', 'value' => 'Oklahoma City, OK', 'type' => 'string', 'group' => 'general', 'label' => 'Address'],

            // Property Settings
            ['key' => 'require_approval', 'value' => '1', 'type' => 'boolean', 'group' => 'property', 'label' => 'Require Admin Approval'],
            ['key' => 'max_photos', 'value' => '20', 'type' => 'integer', 'group' => 'property', 'label' => 'Max Photos Per Property'],
            ['key' => 'featured_limit', 'value' => '10', 'type' => 'integer', 'group' => 'property', 'label' => 'Featured Properties Limit'],

            // Email Settings
            ['key' => 'email_notifications', 'value' => '1', 'type' => 'boolean', 'group' => 'email', 'label' => 'Enable Email Notifications'],
            ['key' => 'admin_email', 'value' => 'team@mandtrealty.com', 'type' => 'string', 'group' => 'email', 'label' => 'Admin Email'],

            // SEO Settings
            ['key' => 'meta_title', 'value' => 'M&T Realty Group - Oklahoma Real Estate', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Title'],
            ['key' => 'meta_description', 'value' => 'Browse homes for sale across Oklahoma with M&T Realty Group, a licensed real estate brokerage.', 'type' => 'string', 'group' => 'seo', 'label' => 'Meta Description'],
        ];

        foreach ($defaults as $default) {
            Setting::firstOrCreate(
                ['key' => $default['key']],
                $default
            );
        }

        return back()->with('success', 'Default settings initialized.');
    }
}
