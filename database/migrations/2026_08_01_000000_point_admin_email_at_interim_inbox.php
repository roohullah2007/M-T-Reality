<?php

use App\Models\Setting;
use App\Services\EmailService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Mail sent to the mandtrealty.com inbox was not being received, so admin
 * notifications are pointed at the Gmail account until the domain mailbox works.
 *
 * The code-level fallback in EmailService only applies when there is no
 * `admin_email` settings row. Any environment that already stored the old
 * address would have kept mailing the dead inbox, so rewrite it here too.
 */
return new class extends Migration
{
    /**
     * Addresses considered "broken" and safe to overwrite. A deliberately
     * configured address that is not in this list is left alone.
     */
    private const STALE_ADDRESSES = [
        'team@mandtrealty.com',
    ];

    public function up(): void
    {
        $current = DB::table('settings')->where('key', 'admin_email')->value('value');
        $current = is_string($current) ? trim($current) : '';

        if ($current !== '' && !in_array(strtolower($current), self::STALE_ADDRESSES, true)) {
            // Someone set a real address on purpose - don't touch it.
            return;
        }

        DB::table('settings')->updateOrInsert(
            ['key' => 'admin_email'],
            [
                'value' => EmailService::DEFAULT_ADMIN_EMAIL,
                'type' => 'string',
                'group' => 'email',
                'label' => 'Admin Email',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        Setting::clearCache();
    }

    public function down(): void
    {
        // Deliberately not restoring the old address - it was not receiving mail,
        // and reinstating it would silently break admin notifications again.
    }
};
