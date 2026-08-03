<?php

namespace Tests\Feature;

use App\Mail\NewContactMessageToAdmin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ContactFormTest extends TestCase
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
            'name' => 'Jane Customer',
            'email' => 'jane@example.com',
            'phone' => '(918) 555-0123',
            'subject' => 'selling',
            'message' => 'I would like to talk about selling my home in Tulsa next spring.',
            'form_token' => $this->validFormToken(),
            'website' => '',
        ], $overrides);
    }

    public function test_legitimate_submission_is_stored_and_notifies_admin(): void
    {
        Mail::fake();

        $response = $this->post('/contact', $this->validPayload());

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('contact_messages', ['email' => 'jane@example.com']);
        Mail::assertSent(NewContactMessageToAdmin::class);
    }

    public function test_honeypot_submission_is_silently_dropped(): void
    {
        Mail::fake();

        $response = $this->post('/contact', $this->validPayload([
            'website' => 'https://spam.example.com',
        ]));

        // Bot still sees the generic success response.
        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_too_fast_submission_is_silently_dropped(): void
    {
        Mail::fake();

        $response = $this->post('/contact', $this->validPayload([
            'form_token' => Crypt::encryptString((string) now()->timestamp),
        ]));

        $response->assertRedirect();
        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_missing_form_token_is_silently_dropped(): void
    {
        Mail::fake();

        $payload = $this->validPayload();
        unset($payload['form_token']);

        $this->post('/contact', $payload);

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_dotted_gmail_local_part_is_rejected(): void
    {
        Mail::fake();

        $this->post('/contact', $this->validPayload([
            'email' => 'm.abe.l.s.y.0.11.6@gmail.com',
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_vowelless_name_is_rejected(): void
    {
        Mail::fake();

        $this->post('/contact', $this->validPayload([
            'name' => 'Xkrtnfz Sgcrxlq',
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_short_message_with_url_is_rejected(): void
    {
        Mail::fake();

        $this->post('/contact', $this->validPayload([
            'message' => 'check https://spam.example.com',
        ]));

        $this->assertDatabaseCount('contact_messages', 0);
        Mail::assertNothingSent();
    }

    public function test_rate_limit_blocks_fourth_submission_from_same_ip(): void
    {
        Mail::fake();

        foreach (range(1, 3) as $i) {
            $this->post('/contact', $this->validPayload([
                'email' => "customer{$i}@example.com",
            ]));
        }

        $this->assertDatabaseCount('contact_messages', 3);

        $response = $this->post('/contact', $this->validPayload([
            'email' => 'customer4@example.com',
        ]));

        // Still a generic success for the caller...
        $response->assertRedirect();
        $response->assertSessionHas('success');
        // ...but nothing stored and no admin notification.
        $this->assertDatabaseCount('contact_messages', 3);
        Mail::assertNotSent(NewContactMessageToAdmin::class, function ($mail) {
            return $mail->message->email === 'customer4@example.com';
        });
    }
}
