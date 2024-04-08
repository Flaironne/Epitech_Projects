<?php

namespace Tests\Feature\Api;

use App\Models\Type;
use Tests\TestCase;

class TypeTest extends TestCase
{
    const TYPES_ENDPOINT = self::API_PREFIX . '/types';
    const TYPE_JSON_STRUCTURE = [
        'id',
        'label',
        'created_at',
        'updated_at',
    ];

    public function test_cant_get_types_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $response = $this->get(self::TYPES_ENDPOINT);
        $response->assertStatus(403);
    }
    
    public function test_can_get_types_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $response = $this->get(self::TYPES_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::TYPE_JSON_STRUCTURE
        ]);
        $this->assertCount(Type::count(), $response->json());
    }

    public function test_cant_create_type_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $type = Type::factory()->make();
        $response = $this->post(self::TYPES_ENDPOINT, $type->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('types', $type->toArray());
    }

    public function test_can_create_type_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $type = Type::factory()->make();
        $response = $this->post(self::TYPES_ENDPOINT, $type->toArray());
        $response->assertStatus(201);
        $this->assertDatabaseHas('types', $type->toArray());
    }

    public function test_can_update_type_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $type = Type::first();
        $type->label = "Updated label";
        $response = $this->put(self::TYPES_ENDPOINT . '/' . $type->id, [
            'label' => $type->label
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::TYPE_JSON_STRUCTURE);
        $this->assertDatabaseHas('types', [
            "label" => $type->label
        ]);
    }

    public function test_can_delete_type_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $type = Type::first();
        $response = $this->delete(self::TYPES_ENDPOINT . '/' . $type->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('types', $type->toArray());
    }
}
