<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class PurgeSpamUsersTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @var string[] backup files created by the command, cleaned up after.
     */
    protected array $backups = [];

    protected function tearDown(): void
    {
        foreach (File::glob(storage_path('app/spam-purge-*.json')) as $file) {
            File::delete($file);
        }

        parent::tearDown();
    }

    protected function spamUser(array $attributes = []): User
    {
        return User::factory()->unverified()->create(array_merge([
            'name' => 'aNLbnpSEXwDNGvpAPqjY',
            'email' => 'aNLbnpSEXwDNGvpAPqjY@mail.ru',
            'role' => 'buyer',
            'created_at' => now()->subDays(30),
            'updated_at' => now()->subDays(30),
        ], $attributes));
    }

    public function test_dry_run_selects_spam_accounts_without_deleting_them(): void
    {
        $gibberish = $this->spamUser();
        $dotted = $this->spamUser([
            'name' => 'Jim',
            'email' => 'h.a.c.d.v.m9.9@gmail.com',
        ]);

        $this->artisan('users:purge-spam')
            ->expectsOutputToContain('[DRY RUN] 2 account(s) matched.')
            ->expectsOutputToContain('Dry run - nothing was deleted.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $gibberish->id]);
        $this->assertDatabaseHas('users', ['id' => $dotted->id]);
        $this->assertEmpty(File::glob(storage_path('app/spam-purge-*.json')));
    }

    public function test_dry_run_does_not_select_a_legitimate_verified_user(): void
    {
        // Same gibberish-looking name, but verified: never a candidate.
        $legit = User::factory()->create([
            'name' => 'aNLbnpSEXwDNGvpAPqjY',
            'email' => 'verified-spammy@mail.ru',
            'role' => 'buyer',
            'email_verified_at' => now(),
            'created_at' => now()->subDays(30),
        ]);

        $normal = User::factory()->unverified()->create([
            'name' => 'Jane Robinson',
            'email' => 'jane.robinson@example.com',
            'role' => 'buyer',
            'created_at' => now()->subDays(30),
        ]);

        $this->artisan('users:purge-spam')
            ->expectsOutputToContain('No spam accounts matched.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $legit->id]);
        $this->assertDatabaseHas('users', ['id' => $normal->id]);
    }

    public function test_privileged_roles_are_never_selected(): void
    {
        foreach (['admin', 'seller', 'agent'] as $role) {
            $this->spamUser([
                'role' => $role,
                'email' => $role . '@mail.ru',
            ]);
        }

        $this->artisan('users:purge-spam')
            ->expectsOutputToContain('No spam accounts matched.')
            ->assertSuccessful();

        $this->assertSame(3, User::count());
    }

    public function test_a_user_with_related_records_is_never_selected(): void
    {
        $spammy = $this->spamUser();

        // An activity log is enough to make this account "not empty".
        DB::table('activity_logs')->insert([
            'user_id' => $spammy->id,
            'action' => 'login',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->artisan('users:purge-spam')
            ->expectsOutputToContain('No spam accounts matched.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $spammy->id]);
    }

    public function test_a_user_who_sent_a_contact_message_is_never_selected(): void
    {
        $spammy = $this->spamUser();

        DB::table('contact_messages')->insert([
            'name' => $spammy->name,
            'email' => strtoupper($spammy->email),
            'subject' => 'Question',
            'message' => 'Is this property still available?',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->artisan('users:purge-spam')
            ->expectsOutputToContain('No spam accounts matched.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $spammy->id]);
    }

    public function test_days_option_protects_recent_accounts(): void
    {
        $recent = $this->spamUser([
            'created_at' => now()->subDays(2),
            'updated_at' => now()->subDays(2),
        ]);

        $this->artisan('users:purge-spam', ['--days' => 7])
            ->expectsOutputToContain('No spam accounts matched.')
            ->assertSuccessful();

        $this->artisan('users:purge-spam', ['--days' => 1])
            ->expectsOutputToContain('1 account(s) matched.')
            ->assertSuccessful();

        $this->assertDatabaseHas('users', ['id' => $recent->id]);
    }

    public function test_limit_option_caps_the_number_of_matches(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->spamUser(['email' => "aNLbnpSEXwDNGvpAPqjY{$i}@mail.ru"]);
        }

        $this->artisan('users:purge-spam', ['--limit' => 2])
            ->expectsOutputToContain('2 account(s) matched.')
            ->assertSuccessful();
    }

    public function test_force_deletes_and_writes_a_recoverable_json_export(): void
    {
        $spammy = $this->spamUser();
        $legit = User::factory()->create(['role' => 'buyer']);

        $this->artisan('users:purge-spam', ['--force' => true])
            ->expectsOutputToContain('Backup written to:')
            ->expectsOutputToContain('Deleted 1 spam account(s).')
            ->assertSuccessful();

        $this->assertDatabaseMissing('users', ['id' => $spammy->id]);
        $this->assertDatabaseHas('users', ['id' => $legit->id]);

        $files = File::glob(storage_path('app/spam-purge-*.json'));
        $this->assertCount(1, $files);

        $export = json_decode(File::get($files[0]), true);
        $this->assertSame(1, $export['count']);
        $this->assertSame($spammy->id, $export['users'][0]['id']);
        // Full row, so it can be restored.
        $this->assertArrayHasKey('password', $export['users'][0]);
        $this->assertSame(['gibberish-name', 'email-random-local'], $export['users'][0]['_matched_signals']);
    }
}
