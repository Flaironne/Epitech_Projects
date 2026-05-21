<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Status;
use App\Enums\VoiceRequestErrorCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class VoiceRequest extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'raw_transcript',
        'language_code',
        'audio_path',
        'status',
        'error_code',
        'error_message',
        'processed_at',
    ];

    protected $casts = [
        'status' => Status::class,
        'error_code' => VoiceRequestErrorCode::class,
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function analysis()
    {
        return $this->hasOne(VoiceAnalysis::class);
    }

    public function trip()
    {
        return $this->hasOneThrough(Trip::class, VoiceAnalysis::class);
    }

    public function metrics()
    {
        return $this->hasOne(VoiceRequestMetric::class);
    }
}
