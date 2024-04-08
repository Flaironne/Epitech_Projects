<?php

namespace Tests\Feature\Api;

use App\Models\Workplace;
use Tests\TestCase;

class WorkplaceTest extends TestCase
{
    const WORKPLACES_ENDPOINT = self::API_PREFIX . '/workplaces';
    const WORKPLACE_JSON_STRUCTURE = [
        'id',
        'label',
        'created_at',
        'updated_at',
    ];

    public function test_cant_get_workplaces_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $response = $this->get(self::WORKPLACES_ENDPOINT);
        $response->assertStatus(403);
    }
    
    public function test_can_get_workplaces_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $response = $this->get(self::WORKPLACES_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::WORKPLACE_JSON_STRUCTURE
        ]);
        $this->assertCount(Workplace::count(), $response->json());
    }

    public function test_cant_create_workplace_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $workplace = Workplace::factory()->make();
        $response = $this->post(self::WORKPLACES_ENDPOINT, $workplace->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('workplaces', $workplace->toArray());
    }

    public function test_can_create_workplace_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $workplace = Workplace::factory()->make();
        $response = $this->post(self::WORKPLACES_ENDPOINT, $workplace->toArray());
        $response->assertStatus(201);
        $this->assertDatabaseHas('workplaces', $workplace->toArray());
    }

    public function test_can_update_workplace_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $workplace = Workplace::first();
        $workplace->label = "Updated label";
        $response = $this->put(self::WORKPLACES_ENDPOINT . '/' . $workplace->id, [
            'label' => $workplace->label
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::WORKPLACE_JSON_STRUCTURE);
        $this->assertDatabaseHas('workplaces', [
            "label" => $workplace->label
        ]);
    }

    public function test_can_delete_workplace_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $workplace = Workplace::first();
        $response = $this->delete(self::WORKPLACES_ENDPOINT . '/' . $workplace->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('workplaces', $workplace->toArray());
    }
}
