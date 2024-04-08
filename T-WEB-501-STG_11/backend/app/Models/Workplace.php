<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Workplace extends Model
{
    use HasFactory;

    protected $fillable = [
        "label",
    ];

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }
}
