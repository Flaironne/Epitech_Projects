<?php

use App\Enums\Status;
use App\Enums\VoiceAnalysisErrorCode;
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
        Schema::create('voice_analyses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('voice_request_id')
                ->constrained('voice_requests')
                ->cascadeOnDelete();
            $table->json('analysis');
            $table->float('confidence_score')->nullable();
            $table->enum('status', Status::cases())
                ->default(Status::Pending);
            $table->enum('error_code', VoiceAnalysisErrorCode::cases())
                ->nullable()
                ->default(null);
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')
                ->comment('Timestamp when the voice analysis was processed by the pathfinder service')
                ->nullable();
            $table->index('voice_request_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voice_analyses');
    }
};
