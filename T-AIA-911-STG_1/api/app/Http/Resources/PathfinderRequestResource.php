<?php

namespace App\Http\Resources;

use App\Enums\Status;
use Illuminate\Http\Resources\Json\JsonResource;

class PathfinderRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'state' => $this->state(),
            'voice_request' => new VoiceRequestResource($this->resource),
            'voice_analysis' => new VoiceAnalysisResource($this->whenLoaded('analysis')),
            'pathfinder' => [
                'departure' => $this->trip?->departure,
                'destination' => $this->trip?->destination,
                'options' => TripOptionResource::collection($this->trip?->options ?? []),
            ],
            'meta' => [
                'generated_at' => $this->updated_at?->toIso8601String(),
            ],
        ];
    }

    private function state(): string
    {
        if (
            $this->status === Status::Failed ||
            $this->analysis?->status === Status::Failed
        ) {
            return Status::Failed->value;
        }

        if (
            $this->status === Status::Processing ||
            $this->analysis?->status === Status::Processing
        ) {
            return Status::Processing->value;
        }

        if ($this->trip !== null) {
            return Status::Processed->value;
        }

        return Status::Pending->value;
    }
}
