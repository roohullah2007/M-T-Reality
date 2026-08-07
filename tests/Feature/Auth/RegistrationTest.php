<?php

namespace Tests\Feature\Auth;

use App\Services\SpamGuard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
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

    public function test_registration_succeeds_when_recaptcha_is_not_configured(): void
    {
        config(['services.recaptcha.secret_key' => null]);
        Http::fake();

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'nocaptcha@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('verification.code', absolute: false));
        $this->assertDatabaseHas('users', ['email' => 'nocaptcha@example.com']);

        // Verification must not have been attempted at all.
        Http::assertNothingSent();
    }

    public function test_registration_is_blocked_when_recaptcha_rejects_the_token(): void
    {
        config(['services.recaptcha.secret_key' => 'test-secret-key']);

        Http::fake([
            'www.google.com/recaptcha/api/siteverify' => Http::response([
                'success' => false,
                'error-codes' => ['invalid-input-response'],
            ]),
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'badcaptcha@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
            'g-recaptcha-response' => 'a-bogus-token',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(SpamGuard::RECAPTCHA_FIELD);
        $this->assertDatabaseMissing('users', ['email' => 'badcaptcha@example.com']);
    }

    public function test_registration_is_blocked_when_recaptcha_token_is_missing(): void
    {
        config(['services.recaptcha.secret_key' => 'test-secret-key']);
        Http::fake();

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'nocaptchatoken@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors(SpamGuard::RECAPTCHA_FIELD);
        $this->assertDatabaseMissing('users', ['email' => 'nocaptchatoken@example.com']);
        Http::assertNothingSent();
    }

    public function test_registration_succeeds_when_recaptcha_accepts_the_token(): void
    {
        config(['services.recaptcha.secret_key' => 'test-secret-key']);

        Http::fake([
            'www.google.com/recaptcha/api/siteverify' => Http::response(['success' => true]),
        ]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'goodcaptcha@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'user_type' => 'buyer',
            'form_token' => $this->validFormToken(),
            'g-recaptcha-response' => 'a-good-token',
        ]);

        $response->assertRedirect(route('verification.code', absolute: false));
        $this->assertDatabaseHas('users', ['email' => 'goodcaptcha@example.com']);

        Http::assertSent(fn ($request) => $request['secret'] === 'test-secret-key'
            && $request['response'] === 'a-good-token'
            && array_key_exists('remoteip', $request->data()));
    }

    public function test_register_page_receives_the_site_key_from_the_server(): void
    {
        config(['services.recaptcha.site_key' => 'public-site-key']);

        $this->get('/register')->assertInertia(
            fn ($page) => $page->component('Auth/Register')
                ->where('recaptcha_site_key', 'public-site-key')
        );
    }
}
