<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VoiceRequestMetric extends Model
{
    use HasUuids;

    protected $fillable = [
        'voice_request_id',
        'cpu_percent',
        'ram_mb',
        'cpu_energy',
        'ram_energy',
        'emissions_kg',
        'execution_time_seconds',
    ];

    protected $casts = [
        'cpu_percent' => 'float',
        'ram_mb' => 'float',
        'cpu_energy' => 'float',
        'ram_energy' => 'float',
        'emissions_kg' => 'float',
        'execution_time_seconds' => 'float',
    ];

    public function voiceRequest(): BelongsTo
    {
        return $this->belongsTo(VoiceRequest::class);
    }
}
