<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoiceAnalysisRequest;
use App\Services\VoiceAnalysisService;

class VoiceAnalysisController extends Controller
{
    public function __construct(
        private VoiceAnalysisService $voiceAnalysisService
    ) {}

    public function store(StoreVoiceAnalysisRequest $request): \Illuminate\Http\Response
    {
        $this->voiceAnalysisService->create($request->validated());

        return response()->noContent(201);
    }
}
