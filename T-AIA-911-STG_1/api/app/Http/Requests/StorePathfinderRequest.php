<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\Status;
use App\Enums\VoiceAnalysisErrorCode;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePathfinderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'voice_analysis_id' => 'required|uuid|exists:voice_analyses,id',
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
                Rule::enum(VoiceAnalysisErrorCode::class),
            ],
            'error.message' => 'nullable|string|max:1000',

            'analysis.options_count'     => ['nullable', 'integer', 'min:0'],
            'analysis.departure'           => ['nullable', 'array'],
            'analysis.departure.id'        => ['nullable', 'string'],
            'analysis.departure.name'      => ['nullable', 'string'],
            'analysis.departure.lat'       => ['nullable', 'numeric'],
            'analysis.departure.lon'       => ['nullable', 'numeric'],
            'analysis.destination'         => ['nullable', 'array'],
            'analysis.destination.id'      => ['nullable', 'string'],
            'analysis.destination.name'    => ['nullable', 'string'],
            'analysis.destination.lat'     => ['nullable', 'numeric'],
            'analysis.destination.lon'     => ['nullable', 'numeric'],
            'analysis.options'                       => ['sometimes', 'array'],
            'analysis.options.*.stops'               => ['sometimes', 'array'],
            'analysis.options.*.stops.*.id'          => ['sometimes', 'string'],
            'analysis.options.*.stops.*.name'        => ['sometimes', 'string'],
            'analysis.options.*.stops.*.lat'         => ['nullable', 'numeric'],
            'analysis.options.*.stops.*.lon'         => ['nullable', 'numeric'],
            'analysis.options.*.rank'                => ['sometimes', 'integer', 'min:1'],
            'analysis.options.*.duration_minutes'    => ['sometimes', 'integer', 'min:0'],
            'analysis.options.*.duration_seconds'    => ['sometimes', 'integer', 'min:0'],
            'analysis.options.*.segments_count'      => ['sometimes', 'integer', 'min:0'],
            'analysis.options.*.transfers_count'     => ['sometimes', 'integer', 'min:0'],
            'analysis.options.*.timeline'                           => ['sometimes', 'array'],
            'analysis.options.*.timeline.*.from'                    => ['sometimes', 'array'],
            'analysis.options.*.timeline.*.from.id'                 => ['sometimes', 'string'],
            'analysis.options.*.timeline.*.from.name'               => ['sometimes', 'string'],
            'analysis.options.*.timeline.*.from.lat'                => ['nullable', 'numeric'],
            'analysis.options.*.timeline.*.from.lon'                => ['nullable', 'numeric'],
            'analysis.options.*.timeline.*.to'                      => ['sometimes', 'array'],
            'analysis.options.*.timeline.*.to.id'                   => ['sometimes', 'string'],
            'analysis.options.*.timeline.*.to.name'                 => ['sometimes', 'string'],
            'analysis.options.*.timeline.*.to.lat'                  => ['nullable', 'numeric'],
            'analysis.options.*.timeline.*.to.lon'                  => ['nullable', 'numeric'],
            'analysis.options.*.timeline.*.relationship_type'       => ['nullable', 'string'],
            'analysis.options.*.neo4j_meta' => ['nullable', 'array'],
        ];
    }
}
