<?php

namespace Tests\Feature\Api;

use App\Http\Controllers\JobController;
use App\Models\Job;
use Tests\TestCase;

class JobTest extends TestCase
{
    const JOBS_ENDPOINT = self::API_PREFIX . '/jobs';
    const JOB_JSON_STRUCTURE = [
        'id',
        'label',
        'description',
        'duration',
        'salary',
        'type',
        'region',
        'company',
        'user',
        'workplace',
        'likes_count',
        'created_at',
        'updated_at',
    ];

    public function test_can_get_jobs_with_pagination() {
        $response = $this->get(self::JOBS_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::JOB_JSON_STRUCTURE
        ]);
        $this->assertCount(JobController::JOBS_PAGINATE, $response->json());
    }
    
    public function test_can_get_all_jobs()
    {
        $response = $this->get(self::JOBS_ENDPOINT . '?all=true');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::JOB_JSON_STRUCTURE
        ]);
        $this->assertCount(Job::count(), $response->json());
    }

    public function test_can_show_show_a_job()
    {
        $job = Job::first();
        $response = $this->get(self::JOBS_ENDPOINT . '/' . $job->id);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::JOB_JSON_STRUCTURE);
    }

    public function test_cant_create_job_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $job = Job::factory()->make();
        $response = $this->post(self::JOBS_ENDPOINT, $job->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('jobs', $job->toArray());
    }

    public function test_can_create_job_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $job = Job::factory()->make();
        $response = $this->post(self::JOBS_ENDPOINT, $job->toArray());
        $response->assertStatus(201);
        $this->assertDatabaseHas('jobs', [
            ...$job->toArray(),
            "user_id" => auth()->user()->id
        ]);
    }

    public function test_can_update_job_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $job = Job::first();
        $job->label = "Updated label";
        $response = $this->put(self::JOBS_ENDPOINT . '/' . $job->id, [
            'label' => $job->label
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::JOB_JSON_STRUCTURE);
        $this->assertDatabaseHas('jobs', [
            "label" => $job->label
        ]);
    }

    public function test_can_delete_job_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $job = Job::first();
        $response = $this->delete(self::JOBS_ENDPOINT . '/' . $job->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('jobs', $job->toArray());
    }
}
