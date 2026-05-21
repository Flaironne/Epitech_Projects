<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreVoiceRequest;
use App\Services\VoiceRequestService;

class VoiceRequestController extends Controller
{
    public function __construct(
        private VoiceRequestService $voiceRequestService
    ) {}

    public function store(StoreVoiceRequest $request): \Illuminate\Http\Response
    {
        $this->voiceRequestService->create(
            $request->validated(),
            $request->user()->id
        );

        return response()->noContent(201);
    }
}
