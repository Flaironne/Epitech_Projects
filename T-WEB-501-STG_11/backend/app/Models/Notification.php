<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        "label", 
        "description", 
        "job_application_id",
        "user_id"
    ];

    protected $casts = [
        "created_at" => "datetime:Y-m-d H:i:s",
        "updated_at" => "datetime:Y-m-d H:i:s"
    ];

    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
