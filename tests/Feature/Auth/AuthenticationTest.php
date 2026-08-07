<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_verified_users_can_authenticate(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_unverified_users_can_not_authenticate(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Credentials were correct, but no session may be established.
        $this->assertGuest();
        $response->assertSessionHasErrors('email');
        $this->assertStringContainsString(
            'verify your email',
            session('errors')->first('email'),
        );
    }

    public function test_login_page_offers_to_resend_the_code_after_a_blocked_attempt(): void
    {
        $user = User::factory()->unverified()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertSessionHas('pending_verification_email', $user->email);
    }

    public function test_blocked_user_can_request_a_new_verification_code(): void
    {
        $user = User::factory()->unverified()->create(['verification_code' => null]);

        $response = $this->post('/verify-email/resend', ['email' => $user->email]);

        $response->assertRedirect(route('verification.code.guest', absolute: false));
        $this->assertNotNull($user->refresh()->verification_code);
        $this->assertGuest();
    }

    public function test_resend_does_not_reveal_whether_an_address_exists(): void
    {
        $response = $this->from('/login')->post('/verify-email/resend', [
            'email' => 'nobody@example.com',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasNoErrors();
    }

    public function test_guest_can_verify_with_a_code_and_is_then_signed_in(): void
    {
        $user = User::factory()->unverified()->create();
        $code = $user->generateVerificationCode();

        // The pending address is put in the session by the blocked login /
        // resend request that precedes this one.
        $response = $this->withSession(['pending_verification_email' => $user->email])
            ->post('/verify-email/code', ['code' => $code]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
