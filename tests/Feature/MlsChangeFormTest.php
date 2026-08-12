<?php

namespace Tests\Feature;

use App\Mail\NewContactMessageToAdmin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MlsChangeFormTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A spam-guard form token that looks like the form was rendered
     * long enough ago to pass the minimum-time check.
     */
    protected function validFormToken(): string
    {
        return Crypt::encryptString((string) now()->subSeconds(10)->timestamp);
    }

    protected function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Jane Seller',
            'email' => 'jane@example.com',
            'phone' => '(918) 555-0123',
            'property_address' => '123 Main St, Tulsa, OK 74135',
            'request_type' => 'Price Change',
            'details' => 'Please reduce the list price to $325,000 effective Monday morning.',
            'form_token' => $this->validFormToken(),
            'website' => '',
        ], $overrides);
    }

    public function test_legitimate_request_is_stored_and_notifies_admin(): void
    {
        Mail::fake();

        $response = $this->post('/mlschanges', $this->validPayload());

        $response->assertRedirect(route('mlschanges'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('contact_messages', [
            'email' => 'jane@example.com',
            'subject' => 'MLS Change Request — 123 Main St, Tulsa, OK 74135',
        ]);
        Mail::assertSent(NewContactMessageToAdmin::class);
    }

    public function test_honeypot_submission_is_silently_dropped(): void
    {
        Mail::fake();

        $response = $this->post('/mlschanges', $this->validPayload([
            'website' => 'https://spam.example.com',
        ]));

        // Bot still sees the generic success response.
        $response->assertRedirect(route('mlschanges'));
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_missing_form_token_is_silently_dropped(): void
    {
        Mail::fake();

        $payload = $this->validPayload();
        unset($payload['form_token']);

        $this->post('/mlschanges', $payload);

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_too_fast_submission_is_silently_dropped(): void
    {
        Mail::fake();

        $this->post('/mlschanges', $this->validPayload([
            'form_token' => Crypt::encryptString((string) now()->timestamp),
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    /**
     * The exact shape of the spam wave that prompted this: every free-text
     * field filled with a random base62 token.
     */
    public function test_machine_generated_fields_are_rejected(): void
    {
        Mail::fake();

        $this->post('/mlschanges', $this->validPayload([
            'name' => 'yKyMSPYRGrzTnhRWmDXI',
            'property_address' => 'ZysbvhLZYGLFvhZfKWOOIMj',
            'details' => 'ZysbvhLZYGLFvhZfKWOOIMj',
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_random_token_in_address_alone_is_rejected(): void
    {
        Mail::fake();

        $this->post('/mlschanges', $this->validPayload([
            'property_address' => 'ZysbvhLZYGLFvhZfKWOOIMj',
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    /**
     * Once RECAPTCHA_SECRET_KEY is configured the captcha becomes mandatory -
     * a submission without a token never reaches Google, or the database.
     */
    public function test_missing_recaptcha_token_is_rejected_when_configured(): void
    {
        Mail::fake();
        config(['services.recaptcha.secret_key' => 'test-secret']);

        $response = $this->post('/mlschanges', $this->validPayload());

        $response->assertSessionHas('success');
        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_rate_limit_blocks_fourth_request_from_same_ip(): void
    {
        Mail::fake();

        foreach (range(1, 3) as $i) {
            $this->post('/mlschanges', $this->validPayload([
                'email' => "seller{$i}@example.com",
            ]));
        }

        $this->assertDatabaseCount('contact_messages', 3);

        $response = $this->post('/mlschanges', $this->validPayload([
            'email' => 'seller4@example.com',
        ]));

        // Still a generic success for the caller...
        $response->assertRedirect(route('mlschanges'));
        $response->assertSessionHas('success');
        // ...but nothing stored.
        $this->assertDatabaseCount('contact_messages', 3);
    }

    public function test_same_normalized_email_cannot_flood_the_form(): void
    {
        Mail::fake();

        // Dotted gmail aliases all resolve to one inbox, so rotating the dots
        // must not buy a bot extra submissions. Each request comes from a
        // different IP so the per-IP limiter is not what does the blocking.
        $emails = ['j.doe@gmail.com', 'jd.oe@gmail.com', 'jdo.e@gmail.com', 'jdoe@gmail.com'];

        foreach ($emails as $i => $email) {
            $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.' . ($i + 1)])
                ->post('/mlschanges', $this->validPayload(['email' => $email]));
        }

        $this->assertDatabaseCount('contact_messages', 3);
    }

    public function test_ordinary_addresses_and_names_are_not_flagged_as_gibberish(): void
    {
        Mail::fake();

        $this->post('/mlschanges', $this->validPayload([
            'name' => "Siobhan McDonald-Krzyzewski",
            'property_address' => '14205 Nottinghamshire Boulevard, Broken Arrow, OK 74012',
            'details' => 'Please update the description and schedule an open house this Sunday.',
        ]));

        $this->assertDatabaseCount('contact_messages', 1);
    }
}
