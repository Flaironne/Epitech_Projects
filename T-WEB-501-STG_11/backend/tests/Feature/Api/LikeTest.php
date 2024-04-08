<?php

namespace Tests\Feature\Api;

use App\Models\Job;
use App\Models\Like;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LikeTest extends TestCase
{
    const USER_LIKE_ENDPOINT = self::API_PREFIX . '/users/';
    const LIKE_ENDPOINT = self::API_PREFIX . '/saved';

    public function test_admin_can_view_all_likes()
    {
        $this->loginAsAdmin();
        $response = $this->getJson(self::LIKE_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonCount(Like::count());
    }

    public function test_user_cannot_like_a_job_when_unauthenticated()
    {
        $job = Job::factory()->create();
        $response = $this->postJson(self::USER_LIKE_ENDPOINT . '1/likes', [
            'job_id' => $job->id,
        ]);
        $response->assertStatus(401);
    }

    public function test_user_can_view_his_likes()
    {
        $this->loginAsUser();
        $job = Job::factory()->create();
        $this->postJson(self::USER_LIKE_ENDPOINT . auth()->user()->id . '/likes', [
            'job_id' => $job->id,
        ]);
        $response = $this->getJson(self::API_PREFIX . '/me/likes');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }

    public function test_user_can_like_a_job_when_authenticated()
    {
        $this->loginAsUser();
        $job = Job::factory()->create();

        $response = $this->postJson(self::USER_LIKE_ENDPOINT . auth()->user()->id . '/likes', [
            'job_id' => $job->id,
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('likes', [
            'user_id' => auth()->user()->id,
            'job_id' => $job->id,
        ]);
    }

    public function test_user_can_unlike_a_job_when_authenticated()
    {
        $this->loginAsUser();
        $job = Job::factory()->create();

        $response = $this->postJson(self::USER_LIKE_ENDPOINT . auth()->user()->id . '/likes', [
            'job_id' => $job->id,
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('likes', [
            'user_id' => auth()->user()->id,
            'job_id' => $job->id,
        ]);

        $response = $this->deleteJson(self::USER_LIKE_ENDPOINT . auth()->user()->id . '/likes', [
            'job_id' => $job->id,
        ]);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('likes', [
            'user_id' => auth()->user()->id,
            'job_id' => $job->id,
        ]);
    }
}
