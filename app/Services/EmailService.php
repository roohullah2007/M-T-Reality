<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EmailService
{
    /**
     * Default delay in seconds between sending multiple emails
     */
    protected const DEFAULT_DELAY_SECONDS = 2;

    /**
     * Check if email notifications are enabled
     */
    public static function isEnabled(): bool
    {
        // The setting may be stored with type "boolean" (Setting::get() then
        // returns a PHP bool) or as a string like '1'/'0'. A strict === '1'
        // comparison silently disabled ALL notifications when the setting row
        // existed with boolean type, so normalize both representations here.
        $value = Setting::get('email_notifications', '1');

        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get the admin email address
     */
    public static function getAdminEmail(): string
    {
        return Setting::get('admin_email', 'team@mandtrealty.com');
    }

    /**
     * Send a single email with error handling
     */
    public static function send(string $to, Mailable $mailable): bool
    {
        if (!self::isEnabled()) {
            return false;
        }

        try {
            Mail::to($to)->send($mailable);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send email to ' . $to . ': ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send email to user with error handling
     */
    public static function sendToUser(string $userEmail, Mailable $mailable): bool
    {
        return self::send($userEmail, $mailable);
    }

    /**
     * Send email to admin with error handling
     */
    public static function sendToAdmin(Mailable $mailable): bool
    {
        $adminEmail = self::getAdminEmail();
        return self::send($adminEmail, $mailable);
    }

    /**
     * Send emails to both user and admin with a delay between them
     * This prevents Resend API issues when sending multiple emails simultaneously
     *
     * @param string $userEmail The user's email address
     * @param Mailable $userMailable The mailable to send to user
     * @param Mailable $adminMailable The mailable to send to admin
     * @param int $delaySeconds Delay in seconds between emails (default: 2)
     * @return array Results array with 'user' and 'admin' boolean values
     */
    public static function sendToUserAndAdmin(
        string $userEmail,
        Mailable $userMailable,
        Mailable $adminMailable,
        int $delaySeconds = self::DEFAULT_DELAY_SECONDS
    ): array {
        $results = [
            'user' => false,
            'admin' => false,
        ];

        if (!self::isEnabled()) {
            return $results;
        }

        // Send to user first
        $results['user'] = self::sendToUser($userEmail, $userMailable);

        // Always delay before sending to admin: even a failed user send
        // counts as an API request against Resend's ~2 req/sec rate limit,
        // so skipping the delay could rate-limit the admin email too.
        sleep($delaySeconds);

        // Send to admin (always attempted, even if the user email failed)
        $results['admin'] = self::sendToAdmin($adminMailable);

        return $results;
    }

    /**
     * Send emails to multiple recipients with delays between each
     *
     * @param array $emails Array of ['email' => string, 'mailable' => Mailable]
     * @param int $delaySeconds Delay in seconds between emails
     * @return array Results array with email addresses as keys and boolean values
     */
    public static function sendMultiple(array $emails, int $delaySeconds = self::DEFAULT_DELAY_SECONDS): array
    {
        $results = [];

        if (!self::isEnabled()) {
            foreach ($emails as $item) {
                $results[$item['email']] = false;
            }
            return $results;
        }

        foreach ($emails as $index => $item) {
            // Add delay before sending (except for the first email)
            if ($index > 0) {
                sleep($delaySeconds);
            }

            $results[$item['email']] = self::send($item['email'], $item['mailable']);
        }

        return $results;
    }
}
