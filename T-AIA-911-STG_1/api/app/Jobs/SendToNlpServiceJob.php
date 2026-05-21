<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\VoiceRequestErrorCode;
use App\Services\VoiceRequestService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendToNlpServiceJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private readonly \App\Models\VoiceRequest $voiceRequest
    ) {
        $this->onQueue('nlp_service');
    }

    /**
     * Execute the job.
     */
    public function handle(
        VoiceRequestService $voiceRequestService
    ): void {
        try {
            $voiceRequestService->markAsProcessing($this->voiceRequest);

            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(10)->post(
                config('sayway.microservices.nlp_service_url'),
                [
                    'voice_request_id' => $this->voiceRequest->id,
                    'language_code' => $this->voiceRequest->language_code,
                    'raw_transcript' => $this->voiceRequest->raw_transcript,
                ]
            );

            if ($response->failed()) {
                throw new \RuntimeException(
                    'NLP service returned HTTP ' . $response->status()
                );
            }
        } catch (\Throwable $e) {
            $voiceRequestService->markAsFailed(
                $this->voiceRequest,
                VoiceRequestErrorCode::ServiceUnavailable,
                $e->getMessage()
            );

            return;
        }
    }
}
