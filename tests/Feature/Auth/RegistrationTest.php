<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class RegistrationTest extends TestCase
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

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('verification.code', absolute: false));
    }

    public function test_registration_is_blocked_when_honeypot_is_filled(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'bot@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
            'website' => 'https://spam.example.com',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
        $this->assertDatabaseMissing('users', ['email' => 'bot@example.com']);
    }

    public function test_registration_is_blocked_when_submitted_too_fast(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'fast@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => Crypt::encryptString((string) now()->timestamp),
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
        $this->assertDatabaseMissing('users', ['email' => 'fast@example.com']);
    }

    public function test_registration_is_blocked_without_form_token(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'notoken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
        $this->assertDatabaseMissing('users', ['email' => 'notoken@example.com']);
    }
}
