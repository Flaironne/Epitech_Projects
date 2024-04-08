<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "label" => $this->label,
            "stars" => $this->stars,
            "jobs" => JobResource::collection($this->whenLoaded("jobs")),
            "jobs_count" => $this->when(!is_null($this->jobs_count), $this->jobs_count),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }


}