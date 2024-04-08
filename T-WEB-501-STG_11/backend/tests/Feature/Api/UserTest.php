<?php

namespace Tests\Feature\Api;

use App\Http\Controllers\JobController;
use App\Models\Job;
use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    const USER_ENDPOINT = self::API_PREFIX . '/users';
    const USER_JSON_STRUCTURE = [
        'id',
        'firstname',
        'lastname',
        'email',
        'phone',
        'is_admin',
        'created_at',
        'updated_at',
    ];

    public function test_can_get_users_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $response = $this->get(self::USER_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::USER_JSON_STRUCTURE
        ]);
        $this->assertCount(User::count(), $response->json());
    }

    public function test_cant_get_users_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $response = $this->get(self::USER_ENDPOINT);
        $response->assertStatus(403);
    }

    public function test_can_show_a_user_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $user = User::first();
        $response = $this->get(self::USER_ENDPOINT . '/' . $user->id);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            ...self::USER_JSON_STRUCTURE,
            'region'
        ]);
    }

    public function test_can_update_a_user_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $user = User::first();
        $response = $this->put(self::USER_ENDPOINT . '/' . $user->id, [
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'jj@dd.doe',
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::USER_JSON_STRUCTURE);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'jj@dd.doe'
        ]);
    }

    public function test_can_update_own_user_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $response = $this->put(self::API_PREFIX . '/account', [
            'firstname' => 'FirstnameUpdated',
            'lastname' => 'LastnameUpdated',
            'password' => self::PASSWORD
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => self::USER_JSON_STRUCTURE
        ]);
        $response->assertJson([
            'success' => true,
            'message' => 'Account updated successfully',
            'data' => [
                'firstname' => 'FirstnameUpdated',
                'lastname' => 'LastnameUpdated',
            ]
        ]);
        $this->assertDatabaseHas('users', [
            'id' => auth()->user()->id,
            'firstname' => 'FirstnameUpdated',
            'lastname' => 'LastnameUpdated',
        ]);
    }

    public function test_can_delete_a_user_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $user = User::first();
        $response = $this->delete(self::USER_ENDPOINT . '/' . $user->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', [
            'id' => $user->id
        ]);
    }
}
