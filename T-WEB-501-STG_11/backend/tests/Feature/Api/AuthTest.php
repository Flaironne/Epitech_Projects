<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Tests\TestCase;

class AuthTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_cant_be_authenticated_with_wrong_credentials(): void
    {
        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => "test@example.com",
            'password' => "password"
        ]);
        $response->assertStatus(401);
        $this->assertGuest();
    }

    /**
     * A basic feature test example.
     */
    public function test_can_be_authenticated_with_correct_credentials(): string
    {
        $user = User::factory()->create([
            'email' => self::EMAIL,
            'password' => self::PASSWORD
        ]);

        $response = $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::PASSWORD,
        ]);

        $user->delete();
        $response->assertStatus(200);
        $this->assertAuthenticated();
        return $response->json()['token'];
    }

    public function test_cant_be_registered_with_wrong_data(): void
    {
        $response = $this->postJson(self::REGISTER_ENDPOINT, [
            'email' => self::EMAIL,
            'password' => self::BAD_PASSWORD
        ]);
        $response->assertStatus(422);
        $this->assertDatabaseMissing('users', [
            'email' => self::EMAIL
        ]);
    }

    public function test_can_be_registered_with_correct_data(): void
    {
        $response = $this->postJson(self::REGISTER_ENDPOINT, [
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => self::EMAIL,
            'password' => self::PASSWORD,
            'password_confirmation' => self::PASSWORD,
            'phone' => '0123456789',
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'email' => self::EMAIL
        ]);
    }

    public function test_can_be_logged_out(): void
    {
        $this->test_can_be_authenticated_with_correct_credentials();
        $response = $this->postJson(self::LOGOUT_ENDPOINT);
        $response->assertJson([
            "success" => true,
            "message" => "Successfully logged out"
        ]);
        $response->assertStatus(200);
    }
}
