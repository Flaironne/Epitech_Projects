<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
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
            "firstname" => $this->firstname,
            "lastname" => $this->lastname,
            "email" => $this->email,
            "phone" => $this->phone,
            "job" => $this->job_id ? JobResource::make($this->job) : null,
            "user" => UserResource::make($this->whenLoaded("user")),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
