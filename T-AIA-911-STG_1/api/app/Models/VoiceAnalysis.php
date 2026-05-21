<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Status;
use App\Enums\VoiceAnalysisErrorCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class VoiceAnalysis extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'voice_request_id',
        'analysis',
        'confidence_score',
        'status',
        'error_code',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'analysis' => 'array',
        'confidence_score' => 'float',
        'status' => Status::class,
        'error_code' => VoiceAnalysisErrorCode::class,
        'processed_at' => 'datetime',
    ];

    public function voiceRequest()
    {
        return $this->belongsTo(VoiceRequest::class);
    }

    public function trip()
    {
        return $this->hasOne(Trip::class);
    }
}
