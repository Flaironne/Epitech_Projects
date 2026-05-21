<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\VoiceAnalysisErrorCode;
use App\Services\VoiceAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class SendToPathfinderServiceJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 1;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private readonly \App\Models\VoiceAnalysis $voiceAnalysis
    ) {
        $this->onQueue('pathfinder_service');
    }

    /**
     * Execute the job.
     */
    public function handle(
        VoiceAnalysisService $voiceAnalysisService
    ): void {
        try {
            $voiceAnalysisService->markAsProcessing($this->voiceAnalysis);

            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::timeout(10)->post(
                config('sayway.microservices.pathfinder_service_url'),
                [
                    'voice_analysis_id' => $this->voiceAnalysis->id,
                    'departure' => $this->voiceAnalysis->analysis['departure'],
                    'destination' => $this->voiceAnalysis->analysis['destination'],
                ]
            );

            if ($response->failed()) {
                throw new \RuntimeException(
                    'Pathfinder service returned HTTP ' . $response->status()
                );
            }
        } catch (\Throwable $e) {
            $voiceAnalysisService->markAsFailed(
                $this->voiceAnalysis,
                VoiceAnalysisErrorCode::PathfinderTimeout,
                $e->getMessage()
            );

            throw $e;
        }
    }
}
