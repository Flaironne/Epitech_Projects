<?php

namespace Tests\Feature\Api;

use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    const NOTIFICATIONS_ENDPOINT = self::API_PREFIX . '/notifications';

    public function test_admin_can_view_all_notifications()
    {
        $this->loginAsAdmin();
        $response = $this->getJson(self::NOTIFICATIONS_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonCount(Notification::count());
    }

    public function test_user_cannot_view_all_notifications()
    {
        $this->loginAsUser();
        $response = $this->getJson(self::NOTIFICATIONS_ENDPOINT);
        $response->assertStatus(403);
    }

    public function test_user_can_view_his_notifications()
    {
        $this->loginAsUser();
        $response = $this->getJson(self::API_PREFIX . '/me/notifications');
        $response->assertStatus(200);
        $response->assertJsonCount(Notification::where('user_id', auth()->user()->id)->count());
    }
}
