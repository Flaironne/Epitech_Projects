<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Like;
use App\Models\Region;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    const messageStart = "  Seeding ";

    private function print(string $message): void
    {
        $this->command->info(self::messageStart . $message . "...");
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->print('regions');
        array_map(function ($region) {
            Region::create([
                "label" => $region
            ]);
        }, [
            "Auvergne-Rhône-Alpes",
            "Bourgogne-Franche-Comté",
            "Bretagne",
            "Centre-Val de Loire",
            "Corse",
            "Grand Est",
            "Hauts-de-France",
            "Île-de-France",
            "Normandie",
            "Nouvelle-Aquitaine",
            "Occitanie",
            "Pays de la Loire",
            "Provence-Alpes-Côte d'Azur",
            "DOM or other"
        ]);

        $this->print("workplaces");
        array_map(function ($workplace) {
            \App\Models\Workplace::create([
                "label" => $workplace
            ]);
        }, [
            "Remote",
            "Office",
            "Hybrid"
        ]);

        $this->print('types');
        array_map(function ($type) {
            \App\Models\Type::create([
                "label" => $type
            ]);
        }, [
            "Permanent Contract",
            "Fixed-Term Contract",
            "Internship",
            "Apprenticeship",
            "Freelance"
        ]);

        $this->print("companies");
        array_map(function ($company) {
            \App\Models\Company::create([
                "label" => $company,
                "stars" => rand(1, 5)
            ]);
        }, [
            "Airbus",
            "Air France",
            "Amazon",
            "Apple",
            "BNP Paribas",
            "Bouygues",
            "Capgemini",
            "Carrefour",
            "Engie",
            "EY",
            "Faurecia",
            "Groupe ADP",
            "Google",
            "L'Oréal",
            "LVMH",
            "Orange",
            "Renault",
            "MG Group",
            "Sanofi",
            "Epitech",
            "Ferrero",
            "Facebook",
            "Microsoft",
            "Twitter",
            "Snapchat",
            "TikTok",
            "Twitch",
            "Tinder",
            "Uber",
            "Uber Eats",
            "Deliveroo",
            "Just Eat",
            "Spotify",
            "Konami",
        ]);

        $this->print("custom users with jobs, likes and applications");
        array_map(function ($user) {
            $user = \App\Models\User::factory()->create([
                "email" => $user["email"],
                "password" => $user["password"],
                "firstname" => $user["firstname"],
                "lastname" => $user["lastname"],
                "region_id" => null,
                "is_admin" => $user["is_admin"],
                "phone" => "0123456789"
            ]);
            $user->jobs()->saveMany(\App\Models\Job::factory(25)->make());
        }, [
            [
                "firstname" => "Florian",
                "lastname" => "Wu",
                "email" => "wuflorian2000@gmail.com",
                "password" => "password",
                "is_admin" => true,
                "likes_count" => 5
            ],
            [
                "firstname" => "Alexis",
                "lastname" => "Henry",
                "email" => "alexis.henry150357@gmail.com",
                "password" => "password",
                "is_admin" => true,
                "likes_count" => 0
            ]
        ]);

        $this->command->info("");
    }
}
