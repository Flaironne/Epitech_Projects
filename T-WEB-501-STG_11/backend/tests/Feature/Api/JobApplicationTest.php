<?php

namespace Tests\Feature\Api;

use App\Models\JobApplication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class JobApplicationTest extends TestCase
{
    const JOB_APPLICATIONS_ENDPOINT = self::API_PREFIX . '/applications';

    public function test_admin_can_view_all_job_applications()
    {
        $this->loginAsAdmin();
        $response = $this->getJson(self::JOB_APPLICATIONS_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonCount(JobApplication::count());
    }
    
    public function test_user_cannot_view_all_job_applications()
    {
        $this->loginAsUser();
        $response = $this->getJson(self::JOB_APPLICATIONS_ENDPOINT);
        $response->assertStatus(403);
    }

    public function test_user_can_view_his_job_applications()
    {
        $this->loginAsUser();
        $response = $this->getJson(self::API_PREFIX . '/me/applications');
        $response->assertStatus(200);
        $response->assertJsonCount(JobApplication::where('user_id', auth()->user()->id)->count());
    }
}
