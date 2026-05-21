<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TripOption extends Model
{
    use HasUuids;

    protected $table = 'trip_options';

    protected $fillable = [
        'trip_id',
        'rank',
        'duration_seconds',
        'duration_minutes',
        'segments_count',
        'transfers_count',
        'stops',
        'timeline',
        'neo4j_meta',
    ];

    protected $casts = [
        'timeline' => 'array',
        'stops' => 'array',
        'neo4j_meta' => 'array',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}
