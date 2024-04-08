<?php

namespace Tests\Feature\Api;

use App\Models\Region;
use Tests\TestCase;

class RegionTest extends TestCase
{
    const REGIONS_ENDPOINT = self::API_PREFIX . '/regions';
    const REGION_JSON_STRUCTURE = [
        'id',
        'label',
        'created_at',
        'updated_at',
    ];

    public function test_cant_get_regions_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $response = $this->get(self::REGIONS_ENDPOINT);
        $response->assertStatus(403);
    }
    
    public function test_can_get_regions_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $response = $this->get(self::REGIONS_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::REGION_JSON_STRUCTURE
        ]);
        $this->assertCount(Region::count(), $response->json());
    }

    public function test_cant_create_region_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $region = Region::factory()->make();
        $response = $this->post(self::REGIONS_ENDPOINT, $region->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('regions', $region->toArray());
    }

    public function test_can_create_region_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $region = Region::factory()->make();
        $response = $this->post(self::REGIONS_ENDPOINT, $region->toArray());
        $response->assertStatus(201);
        $this->assertDatabaseHas('regions', $region->toArray());
    }

    public function test_can_update_region_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $region = Region::first();
        $region->label = "Updated label";
        $response = $this->put(self::REGIONS_ENDPOINT . '/' . $region->id, [
            'label' => $region->label
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::REGION_JSON_STRUCTURE);
        $this->assertDatabaseHas('regions', [
            "label" => $region->label
        ]);
    }

    public function test_can_delete_region_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $region = Region::first();
        $response = $this->delete(self::REGIONS_ENDPOINT . '/' . $region->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('regions', $region->toArray());
    }
}
