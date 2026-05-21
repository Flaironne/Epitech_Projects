<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VoiceAnalysisResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            ...$this->analysis,
            'error' => $this->error(),
        ];
    }

    private function error(): ?array
    {
        if ($this->error_code === null && $this->error_message === null) {
            return null;
        }

        return [
            'code' => $this->error_code,
            'message' => $this->error_message,
        ];
    }
}
