<?php

namespace App\Http\Resources;

use App\Services\VoiceRequestService;
use Illuminate\Http\Resources\Json\JsonResource;

class VoiceRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'status' => $this->status,
            'language' => $this->language_code,
            'input' => [
                'raw_transcript' => $this->raw_transcript,
                'audio_url' => app(VoiceRequestService::class)->generateTemporaryAudioUrl($this->resource),
            ],
            'metrics' => new VoiceRequestMetricsResource($this->whenLoaded('metrics')),
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
