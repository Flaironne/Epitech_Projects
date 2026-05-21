<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Request;
use App\Enums\Status;
use App\Enums\VoiceAnalysisErrorCode;
use App\Http\Requests\StorePathfinderRequest;
use App\Models\Trip;
use App\Models\VoiceAnalysis;
use Illuminate\Support\Facades\DB;

class PathfinderService
{
    public function __construct(
        private VoiceAnalysisService $voiceAnalysisService
    ) {}

    public function createTripFromVoiceAnalysis(Request $request): void
    {
        try {
            DB::transaction(function () use ($request) {
                $analysis = VoiceAnalysis::findOrFail($request->voice_analysis_id);

                $status = $request->status;

                if ($status === Status::Failed->value) {
                    $this->voiceAnalysisService->markAsFailed(
                        $analysis,
                        VoiceAnalysisErrorCode::from(
                            $request->error['code']
                        ),
                        $request->error['message']
                    );
                    return null;
                }

                $analysis->status = Status::Processed;
                $analysis->processed_at = now();
                $analysis->save();

                $trip = Trip::create([
                    'user_id' => $analysis->voiceRequest->user_id,
                    'voice_analysis_id' => $analysis->id,
                    'departure' => $request->analysis['departure'],
                    'destination' => $request->analysis['destination'],
                ]);

                foreach ($request->analysis['options'] as $option) {
                    $trip->options()->create([
                        'rank' => $option['rank'],
                        'duration_minutes' => $option['duration_minutes'],
                        'duration_seconds' => $option['duration_seconds'],
                        'segments_count' => $option['segments_count'],
                        'transfers_count' => $option['transfers_count'],
                        'stops' => $option['stops'],
                        'timeline' => $option['timeline'],
                        'neo4j_meta' => $option['neo4j_meta'] ?? null,
                    ]);
                }
            });
        } catch (\Throwable $e) {
            $this->voiceAnalysisService->markAsFailed(
                VoiceAnalysis::find($request->voice_analysis_id),
                VoiceAnalysisErrorCode::PathfinderCrashed,
                $e->getMessage()
            );

            throw $e;
        }
    }
}
