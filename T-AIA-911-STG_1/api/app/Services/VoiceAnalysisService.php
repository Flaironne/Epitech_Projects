<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Status;
use App\Enums\VoiceAnalysisErrorCode;
use App\Enums\VoiceRequestErrorCode;
use App\Models\VoiceAnalysis;
use App\Models\VoiceRequest;
use App\Models\VoiceRequestMetric;
use Illuminate\Support\Facades\DB;

class VoiceAnalysisService
{
    public function __construct(
        private VoiceRequestService $voiceRequestService
    ) {}

    public function create(array $data): VoiceAnalysis | null
    {
        return DB::transaction(function () use ($data) {
            $voiceRequest = VoiceRequest::findOrFail($data['voice_request_id']);

            $status = $data['status'];

            if ($status === Status::Failed->value) {
                $this->voiceRequestService->markAsFailed(
                    $voiceRequest,
                    VoiceRequestErrorCode::from(
                        $data['error']['code']
                    ),
                    $data['error']['message']
                );
                return null;
            }

            $analysis = $data['analysis'];

            $voiceRequest->status = $status;
            $voiceRequest->processed_at = now();
            $voiceRequest->save();

            $voiceAnalysis = VoiceAnalysis::create([
                'voice_request_id' => $voiceRequest->id,
                'status' => $status,
                'analysis' => $analysis,
                'confidence_score' => $analysis['confidence_score'],
                'error_code' => $data['error']['code'] ?? null,
                'error_message' => $data['error']['message'] ?? null,
            ]);

            VoiceRequestMetric::create([
                'voice_request_id' => $voiceRequest->id,
                'cpu_percent' => $data['metrics']['cpu_percent'],
                'ram_mb' => $data['metrics']['ram_mb'],
                'cpu_energy' => $data['metrics']['cpu_energy'],
                'ram_energy' => $data['metrics']['ram_energy'],
                'emissions_kg' => $data['metrics']['emissions_kg'],
                'execution_time_seconds' => $data['metrics']['execution_time_seconds'],
            ]);

            event(new \App\Events\VoiceAnalysisProcessed($voiceAnalysis));

            return $voiceAnalysis;
        });
    }

    public function markAsFailed(
        VoiceAnalysis $voiceAnalysis,
        VoiceAnalysisErrorCode $errorCode,
        ?string $errorMessage = null
    ): void {
        $voiceAnalysis->update([
            'status' => Status::Failed,
            'error_code' => $errorCode,
            'error_message' => $errorMessage,
            'processed_at' => now(),
        ]);
    }

    public function markAsProcessing(VoiceAnalysis $voiceAnalysis): void
    {
        $voiceAnalysis->status = Status::Processing;
        $voiceAnalysis->save();
    }
}
