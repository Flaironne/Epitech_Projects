<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Trip extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'voice_analysis_id',
        'departure',
        'destination',
    ];

    protected $casts = [
        'departure' => 'array',
        'destination' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function options()
    {
        return $this->hasMany(TripOption::class)
            ->orderBy('rank');
    }

    public function voiceAnalysis()
    {
        return $this->belongsTo(VoiceAnalysis::class);
    }
}
