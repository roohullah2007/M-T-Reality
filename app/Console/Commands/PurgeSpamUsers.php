<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

/**
 * Removes the junk accounts left behind by registration spam bots.
 *
 * Deliberately paranoid: deleting a real customer is far worse than leaving a
 * spam account behind, so an account is only ever a candidate when EVERY one of
 * these holds:
 *
 *   1. email_verified_at IS NULL          (a real signup verifies)
 *   2. role is a plain buyer/user         (never admin, seller or agent)
 *   3. it owns no related records at all  (see RELATED_TABLES)
 *   4. it is older than --days
 *   5. at least one spam signal fires     (see signalsFor())
 *
 * Dry run is the default; --force is required to actually delete, and even then
 * a full JSON export is written first so the rows can be restored.
 */
class PurgeSpamUsers extends Command
{
    protected $signature = 'users:purge-spam
                            {--force : Actually delete. Without this the command only reports (dry run)}
                            {--days=7 : Only consider accounts created more than N days ago}
                            {--limit= : Stop after N matched accounts}';

    protected $description = 'Purge spam-bot user accounts (dry run unless --force is given)';

    /**
     * Roles that may ever be deleted. Anything else (admin, seller, agent) is
     * a real person and is never touched.
     */
    protected const DELETABLE_ROLES = ['buyer', 'user'];

    /**
     * Every table that references users, mapped to the columns that do so.
     * A candidate must not appear in ANY of them.
     *
     * @var array<string, string[]>
     */
    protected const RELATED_TABLES = [
        'properties' => ['user_id', 'approved_by', 'original_user_id'],
        'inquiries' => ['user_id'],
        'favorites' => ['user_id'],
        'activity_logs' => ['user_id'],
        'service_requests' => ['user_id', 'processed_by'],
        'media_orders' => ['user_id', 'processed_by'],
        'import_batches' => ['imported_by'],
        'mls_change_requests' => ['user_id', 'handled_by'],
        'form_templates' => ['uploaded_by'],
        'form_acknowledgments' => ['user_id'],
        'seller_documents' => ['user_id', 'uploaded_by'],
    ];

    /**
     * Tables with no user_id that still represent real contact from a person.
     * Matched on the email address instead.
     *
     * @var string[]
     */
    protected const RELATED_EMAIL_TABLES = [
        'contact_messages',
        'buyer_inquiries',
        'media_orders',
    ];

    public function handle(): int
    {
        $force = (bool) $this->option('force');
        $days = max(0, (int) $this->option('days'));
        $limit = $this->option('limit') !== null ? max(1, (int) $this->option('limit')) : null;
        $cutoff = now()->subDays($days);

        $this->info(($force ? '' : '[DRY RUN] ') . "Scanning unverified buyer accounts created before {$cutoff->toDateTimeString()} ({$days} days ago)...");

        $matched = collect();

        User::query()
            ->whereNull('email_verified_at')
            ->whereIn('role', self::DELETABLE_ROLES)
            ->where('created_at', '<', $cutoff)
            ->orderBy('id')
            ->chunkById(500, function ($users) use (&$matched, $limit) {
                foreach ($users as $user) {
                    $signals = $this->signalsFor($user);

                    if ($signals === [] || $this->hasRelatedRecords($user)) {
                        continue;
                    }

                    $matched->push(['user' => $user, 'signals' => $signals]);

                    if ($limit !== null && $matched->count() >= $limit) {
                        return false;
                    }
                }

                return true;
            });

        if ($matched->isEmpty()) {
            $this->info('No spam accounts matched. Nothing to do.');

            return self::SUCCESS;
        }

        $this->newLine();
        $this->table(
            ['ID', 'Name', 'Email', 'Created', 'Signals'],
            $matched->map(fn (array $row) => [
                $row['user']->id,
                $row['user']->name,
                $row['user']->email,
                optional($row['user']->created_at)->toDateTimeString(),
                implode(', ', $row['signals']),
            ])->all(),
        );

        $count = $matched->count();
        $this->newLine();
        $this->info(($force ? '' : '[DRY RUN] ') . "{$count} account(s) matched.");

        if (! $force) {
            $this->warn('Dry run - nothing was deleted. Re-run with --force to delete these accounts.');

            return self::SUCCESS;
        }

        // Recoverable backup BEFORE any destructive work.
        $path = $this->writeBackup($matched->pluck('user'), $matched);
        $this->info("Backup written to: {$path}");

        $ids = $matched->pluck('user.id')->all();

        DB::transaction(function () use ($ids) {
            if (Schema::hasTable('sessions')) {
                DB::table('sessions')->whereIn('user_id', $ids)->delete();
            }

            DB::table('users')->whereIn('id', $ids)->delete();
        });

        $this->info("Deleted {$count} spam account(s).");

        return self::SUCCESS;
    }

    /**
     * Spam signals that fired for this account. Empty means "looks legitimate".
     *
     * @return string[]
     */
    protected function signalsFor(User $user): array
    {
        $signals = [];
        $name = (string) $user->name;
        $local = strstr((string) $user->email, '@', true) ?: '';

        // "aNLbnpSEXwDNGvpAPqjY" - one token, random-looking mixed case.
        if ($this->looksRandom($name)) {
            $signals[] = 'gibberish-name';
        }

        // Real names essentially always contain a vowel ("y" counts).
        $letters = preg_replace('/[^a-z]/i', '', $name) ?? '';
        if (strlen($letters) >= 8 && ! preg_match('/[aeiouy]/i', $letters)) {
            $signals[] = 'name-no-vowels';
        }

        // "h.a.c.d.v.m9.9@gmail.com" - dotted-gmail alias rotation.
        if (substr_count($local, '.') >= 3) {
            $signals[] = 'email-dotted-alias';
        }

        if ($this->looksRandom($local) || $this->looksRandomAlphanumeric($local)) {
            $signals[] = 'email-random-local';
        }

        return array_values(array_unique($signals));
    }

    /**
     * A single unspaced token, long, with several interior capitals AND several
     * lowercase letters AND a consonant-heavy makeup.
     *
     * All four conditions together are what separates machine-generated strings
     * from real (even unusual) names: "Christopher" has no interior capitals,
     * "JeanPierreDuBois" is not consonant-heavy, "McDonald" is neither long
     * enough nor has 3 interior capitals.
     */
    protected function looksRandom(string $value): bool
    {
        if ($value === '' || preg_match('/\s/', $value)) {
            return false;
        }

        $letters = preg_replace('/[^a-z]/i', '', $value) ?? '';

        if (strlen($value) < 10 || strlen($letters) < 8) {
            return false;
        }

        // Capitals after the first character - a real name capitalises the
        // start of words, not random positions.
        $interiorUpper = preg_match_all('/[A-Z]/', substr($value, 1));
        $lower = preg_match_all('/[a-z]/', $value);

        if ($interiorUpper < 3 || $lower < 3) {
            return false;
        }

        // A run of 4+ consonants is the giveaway no pronounceable name has;
        // it is what separates "aNLbnpSEXwDNGvpAPqjY" from "JPMorganChaseBank".
        if (! preg_match('/[b-df-hj-np-tv-xz]{4}/i', $letters)) {
            return false;
        }

        $vowels = preg_match_all('/[aeiouy]/i', $letters);

        return (strlen($letters) - $vowels) / strlen($letters) >= 0.55;
    }

    /**
     * A long, unbroken run of letters and digits with no name-like structure,
     * e.g. "xk29fjqp1mzbv84t".
     */
    protected function looksRandomAlphanumeric(string $value): bool
    {
        if (! preg_match('/^[a-z0-9]{16,}$/i', $value)) {
            return false;
        }

        $digits = preg_match_all('/\d/', $value);
        $letters = preg_replace('/[^a-z]/i', '', $value) ?? '';

        if ($digits < 2 || strlen($letters) < 6) {
            return false;
        }

        $vowels = preg_match_all('/[aeiouy]/i', $letters);

        return (strlen($letters) - $vowels) / strlen($letters) >= 0.6;
    }

    /**
     * Whether this account owns anything at all. Uses raw queries rather than
     * Eloquent relations so soft-deleted rows and tables without a model are
     * still counted.
     */
    protected function hasRelatedRecords(User $user): bool
    {
        foreach (self::RELATED_TABLES as $table => $columns) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            foreach ($columns as $column) {
                if (! Schema::hasColumn($table, $column)) {
                    continue;
                }

                if (DB::table($table)->where($column, $user->id)->exists()) {
                    return true;
                }
            }
        }

        foreach (self::RELATED_EMAIL_TABLES as $table) {
            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'email')) {
                continue;
            }

            if (DB::table($table)->whereRaw('lower(email) = ?', [strtolower((string) $user->email)])->exists()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Dump every column of every doomed row so the delete is reversible.
     */
    protected function writeBackup($users, $matched): string
    {
        $signalsById = $matched->mapWithKeys(fn (array $row) => [$row['user']->id => $row['signals']]);

        $rows = DB::table('users')
            ->whereIn('id', $users->pluck('id')->all())
            ->get()
            ->map(function ($row) use ($signalsById) {
                $data = (array) $row;
                $data['_matched_signals'] = $signalsById[$row->id] ?? [];

                return $data;
            })
            ->all();

        $path = storage_path('app/spam-purge-' . now()->format('Ymd-His') . '.json');

        File::ensureDirectoryExists(dirname($path));
        File::put($path, json_encode([
            'exported_at' => now()->toIso8601String(),
            'count' => count($rows),
            'users' => $rows,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        return $path;
    }
}
