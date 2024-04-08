<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
            "description" => $this->description,
            "duration" => $this->duration,
            "salary" => $this->salary,
            "type" => TypeResource::make($this->type),
            "region" => RegionResource::make($this->region),
            "company" => CompanyResource::make($this->company),
            "user" => UserResource::make($this->whenLoaded("user")),
            "workplace" => WorkplaceResource::make($this->workplace),
            "likes" => LikeResource::collection($this->whenLoaded("likes")),
            "likes_count" => $this->whenLoaded("likes") ? $this->likes->count() : 0,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
