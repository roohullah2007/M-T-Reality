<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
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

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', [
            'email' => $user->email,
            'form_token' => $this->validFormToken(),
        ]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_bot_submission_does_not_trigger_a_reset_email(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        // Honeypot filled: the caller still gets the neutral "link sent"
        // status, but no mail leaves the building.
        $response = $this->post('/forgot-password', [
            'email' => $user->email,
            'form_token' => $this->validFormToken(),
            'website' => 'https://spam.example.com',
        ]);

        $response->assertRedirect();
        Notification::assertNothingSent();
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', [
            'email' => $user->email,
            'form_token' => $this->validFormToken(),
        ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get('/reset-password/'.$notification->token);

            $response->assertStatus(200);

            return true;
        });
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', [
            'email' => $user->email,
            'form_token' => $this->validFormToken(),
        ]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }
}
