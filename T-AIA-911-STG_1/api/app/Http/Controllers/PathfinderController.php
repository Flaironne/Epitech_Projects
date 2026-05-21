<?php

namespace App\Http\Controllers;

use App\Http\Resources\PathfinderRequestResource;
use App\Models\VoiceRequest;
use App\Services\PathfinderService;
use Illuminate\Http\Request;

class PathfinderController extends Controller
{
    public function __construct(
        private PathfinderService $pathfinderService
    ) {}

    public function index(Request $request)
    {
        $voiceRequests = $request->user()
            ->voiceRequests()
            ->with('analysis', 'metrics', 'trip.options')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return PathfinderRequestResource::collection($voiceRequests);
    }

    public function show(VoiceRequest $voiceRequest): PathfinderRequestResource
    {
        return new PathfinderRequestResource($voiceRequest->load('metrics'));
    }

    public function store(Request $request): \Illuminate\Http\Response | \Illuminate\Http\JsonResponse
    {
        try {
            $this->pathfinderService->createTripFromVoiceAnalysis($request);

            return response()->noContent(201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing the request.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
