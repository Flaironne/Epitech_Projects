<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Status;
use App\Enums\VoiceRequestErrorCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVoiceAnalysisRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'voice_request_id' => 'required|uuid|exists:voice_requests,id',
            'status' => [
                'required',
                'string',
                Rule::enum(Status::class)->only([
                    Status::Processed,
                    Status::Failed
                ])
            ],

            'error' => 'nullable|array',
            'error.code' => [
                'nullable',
                'string',
                Rule::enum(VoiceRequestErrorCode::class),
            ],
            'error.message' => 'nullable|string|max:1000',

            'analysis' => 'sometimes|array',
            'analysis.departure' => 'sometimes|string',
            'analysis.destination' => 'sometimes|string',
            'analysis.stops' => 'nullable|array',
            'analysis.confidence_score' => 'sometimes|numeric|min:0|max:1',
            'analysis.confidence_details' => 'nullable|array',
            'metrics' => 'sometimes|array',
            'metrics.cpu_percent' => 'sometimes|numeric|min:0|max:100',
            'metrics.ram_mb' => 'sometimes|numeric|min:0',
            'metrics.emissions_kg' => 'sometimes|numeric|min:0',
            'metrics.cpu_energy' => 'sometimes|numeric|min:0',
            'metrics.ram_energy' => 'sometimes|numeric|min:0',
            'metrics.execution_time_seconds' => 'sometimes|numeric|min:0',
        ];
    }
}
