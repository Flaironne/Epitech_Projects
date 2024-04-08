<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication, RefreshDatabase;

    const API_PREFIX = '/api';
    const LOGIN_ENDPOINT = self::API_PREFIX . "/auth/login";
    const REGISTER_ENDPOINT = self::API_PREFIX . "/auth/register";
    const LOGOUT_ENDPOINT = self::API_PREFIX . "/auth/logout";
    const EMAIL = "test@example.com";
    const PASSWORD = "Password*123";
    const BAD_PASSWORD = "password";
    
    protected $seed = true;
    
    public function loginAsUser() {
        $user = User::factory()->create([
            'email' => self::EMAIL,
            'password' => self::PASSWORD,
            'is_admin' => false
        ]);
        $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::PASSWORD,
        ]);
    }

    public function loginAsAdmin() {
        $user = User::factory()->create([
            'email' => self::EMAIL,
            'password' => self::PASSWORD,
            'is_admin' => true
        ]);
        $this->postJson(self::LOGIN_ENDPOINT, [
            'email' => $user->email,
            'password' => self::PASSWORD,
        ]);
    }

}
