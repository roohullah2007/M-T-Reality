<?php

namespace Tests\Unit;

use App\Services\SpamGuard;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class SpamGuardTest extends TestCase
{
    /**
     * @return array<string, array{string}>
     */
    public static function randomStrings(): array
    {
        return [
            'spam name from the MLS form' => ['yKyMSPYRGrzTnhRWmDXI'],
            'spam address from the MLS form' => ['ZysbvhLZYGLFvhZfKWOOIMj'],
            'lowercase token' => ['qwrtplkjhgfdszxcvbn'],
            'token inside a sentence' => ['Please update ZysbvhLZYGLFvhZfKWOOIMj today'],
        ];
    }

    /**
     * @return array<string, array{string}>
     */
    public static function humanStrings(): array
    {
        return [
            'ordinary name' => ['Jane Customer'],
            'consonant-heavy surname' => ['Siobhan Krzyzewski'],
            'camel-cased brand' => ['McDonald iPhone MacBook'],
            'street address' => ['14205 Nottinghamshire Boulevard, Broken Arrow, OK'],
            'long real word' => ['I need the neighbourhood comparables recalculated'],
            'short abbreviation' => ['MLS NWMLS FSBO'],
        ];
    }

    #[DataProvider('randomStrings')]
    public function test_it_flags_machine_generated_text(string $value): void
    {
        $this->assertTrue(SpamGuard::looksRandom($value), "expected [{$value}] to look random");
    }

    #[DataProvider('humanStrings')]
    public function test_it_leaves_human_text_alone(string $value): void
    {
        $this->assertFalse(SpamGuard::looksRandom($value), "expected [{$value}] to look human");
    }

    public function test_gibberish_check_names_the_offending_field(): void
    {
        $reason = SpamGuard::gibberishCheck([
            'name' => 'Jane Seller',
            'property address' => 'ZysbvhLZYGLFvhZfKWOOIMj',
        ]);

        $this->assertSame('property address looks machine-generated', $reason);
    }

    public function test_gibberish_check_passes_a_clean_submission(): void
    {
        $this->assertNull(SpamGuard::gibberishCheck([
            'name' => 'Jane Seller',
            'property address' => '123 Main St, Tulsa, OK 74135',
            'details' => 'Please reduce the price to $325,000.',
        ]));
    }

    public function test_it_ignores_null_values(): void
    {
        $this->assertNull(SpamGuard::gibberishCheck(['phone' => null]));
    }

    public function test_gmail_aliases_normalize_to_one_address(): void
    {
        $this->assertSame('jdoe@gmail.com', SpamGuard::normalizeEmail('J.D.o.e+listings@gmail.com'));
        // Only gmail collapses dots - other providers treat them as distinct.
        $this->assertSame('j.doe@outlook.com', SpamGuard::normalizeEmail('J.Doe@outlook.com'));
    }
}
