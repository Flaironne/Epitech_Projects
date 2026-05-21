<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VoiceRequestController;
use App\Http\Controllers\VoiceAnalysisController;
use App\Http\Controllers\PathfinderController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/authenticated-user', [AuthController::class, 'authenticatedUser']);

    Route::post('/voice-requests', [VoiceRequestController::class, 'store']);

    Route::get('/trip-requests', [PathfinderController::class, 'index']);
    Route::get('/trip-requests/{voiceRequest}', [PathfinderController::class, 'show']);

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/locale', [AuthController::class, 'setLocale']);
});

Route::middleware('microservice')->group(function () {
    Route::post('/callbacks/voice-analyses', [VoiceAnalysisController::class, 'store']);
    Route::post('/callbacks/pathfinder', [PathfinderController::class, 'store']);
});
