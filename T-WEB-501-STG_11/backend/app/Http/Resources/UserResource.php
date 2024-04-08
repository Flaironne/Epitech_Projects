<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "is_admin" => $this->is_admin,
            "region" => RegionResource::make($this->whenLoaded("region")),
            "likes" => LikeResource::collection($this->whenLoaded("likes")),
            "company" => CompanyResource::make($this->whenLoaded("company")),
            "jobs" => JobResource::collection($this->whenLoaded("jobs")),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
