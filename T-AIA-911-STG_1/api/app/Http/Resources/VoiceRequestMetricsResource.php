<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VoiceRequestMetricsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            "cpu_percent" => round($this->cpu_percent, 1),
            "ram_mb" => round($this->ram_mb, 2),
            "cpu_energy" => $this->cpu_energy ? round($this->cpu_energy, 6) : 0.0,
            "ram_energy" => $this->ram_energy ? round($this->ram_energy, 6) : 0.0,
            "emissions" => $this->formatEmission($this->emissions_kg),
            "execution_time_seconds" => $this->execution_time_seconds ? round($this->execution_time_seconds, 3) : 0.0,
        ];
    }

    private function formatEmission(float $kg): array
    {
        if ($kg < 0.001) {
            return [
                'value' => round($kg * 1_000_000, 2),
                'unit' => 'mg'
            ];
        }

        if ($kg < 1) {
            return [
                'value' => round($kg * 1_000, 2),
                'unit' => 'g'
            ];
        }

        return [
            'value' => round($kg, 2),
            'unit' => 'kg'
        ];
    }
}
