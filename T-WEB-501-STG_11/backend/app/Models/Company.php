<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        "label",
        "stars"
    ];

    protected $casts = [
        "stars" => "integer"
    ];

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }
}
