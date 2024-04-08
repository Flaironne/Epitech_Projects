<?php

namespace Tests\Feature\Api;

use App\Models\Job;
use Tests\TestCase;

class FilterTest extends TestCase
{
	const FILTER_ENDPOINT = self::API_PREFIX . '/filters';

	public function test_can_get_filters_without_authentication()
	{
		$response = $this->get(self::FILTER_ENDPOINT);
		$response->assertStatus(200);
		$response->assertJsonStructure([
			'regions',
			'workplaces',
			'types'
		]);
	}

	public function test_search_can_be_performed()
	{
		Job::factory()->create([
			'label' => 'test create a job !',
			'region_id' => 1,
			'workplace_id' => 1,
			'type_id' => 1
		]);
	
		$search = 'test create a job !';
		$regionId = 1;
		$workplaceId = 1;
		$typeId = 1;

		$params = [
			'search' => $search,
			'region_id' => $regionId,
			'workplace_id' => $workplaceId,
			'type_id' => $typeId
		];

		$response = $this->get(self::API_PREFIX . '/search?' . http_build_query($params));
		$response->assertStatus(200);
		$response->assertJsonCount(1);
	}
}
