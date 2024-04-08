<?php

namespace Tests\Feature\Api;

use App\Models\Company;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    const COMPANIES_ENDPOINT = self::API_PREFIX . '/companies';
    const COMPANY_JSON_STRUCTURE = [
        'id',
        'label',
        'stars',
        'created_at',
        'updated_at',
    ];

    public function test_can_get_all_companies_withouth_authentication()
    {
        $response = $this->get(self::COMPANIES_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::COMPANY_JSON_STRUCTURE
        ]);
        $this->assertCount(Company::count(), $response->json());
    }

    public function test_can_get_companies_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $response = $this->get(self::COMPANIES_ENDPOINT);
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => self::COMPANY_JSON_STRUCTURE
        ]);
        $this->assertCount(Company::count(), $response->json());
    }

    public function test_cant_create_companies_when_authenticated_as_user()
    {
        $this->loginAsUser();
        $companies = Company::factory()->make();
        $response = $this->post(self::COMPANIES_ENDPOINT, $companies->toArray());
        $response->assertStatus(403);
        $this->assertDatabaseMissing('companies', $companies->toArray());
    }

    public function test_can_create_companies_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $companies = Company::factory()->make();
        $response = $this->post(self::COMPANIES_ENDPOINT, $companies->toArray());
        $response->assertStatus(201);
        $this->assertDatabaseHas('companies', $companies->toArray());
    }

    public function test_can_update_companies_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $companies = Company::first();
        $companies->label = "Updated label";
        $response = $this->put(self::COMPANIES_ENDPOINT . '/' . $companies->id, [
            'label' => $companies->label
        ]);
        $response->assertStatus(200);
        $response->assertJsonStructure(self::COMPANY_JSON_STRUCTURE);
        $this->assertDatabaseHas('companies', [
            "label" => $companies->label
        ]);
    }

    public function test_can_delete_companies_when_authenticated_as_admin()
    {
        $this->loginAsAdmin();
        $companies = Company::first();
        $response = $this->delete(self::COMPANIES_ENDPOINT . '/' . $companies->id);
        $response->assertStatus(204);
        $this->assertDatabaseMissing('companies', $companies->toArray());
    }
}
