<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Region;
use App\Models\Type;
use App\Models\User;
use App\Models\Workplace;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "label" => $this->faker->jobTitle,
            "description" => $this->faker->realText(1200),
            "salary" => (string) $this->faker->numberBetween(1000, 10000),
            "duration" => $this->faker->numberBetween(1, 48) . " months",
            "company_id" => Company::inRandomOrder()->first()->id,
            "workplace_id" => Workplace::inRandomOrder()->first()->id,
            "user_id" => User::where('is_admin', true)->first()->id,
            "type_id" => Type::inRandomOrder()->first()->id,
            "region_id" => Region::inRandomOrder()->first()->id,
        ];
    }
}
