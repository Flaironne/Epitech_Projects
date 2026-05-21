<?php

use App\Enums\VoiceRequestMetricStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('voice_request_metrics', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('voice_request_id')
                ->constrained('voice_requests')
                ->cascadeOnDelete();
            $table->float('cpu_percent')->nullable();
            $table->float('ram_mb')->nullable();
            $table->float('cpu_energy')->nullable();
            $table->float('ram_energy')->nullable();
            $table->float('emissions_kg')->nullable();
            $table->float('execution_time_seconds')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voice_request_metrics');
    }
};
