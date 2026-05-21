<?php

use App\Enums\Status;
use App\Enums\VoiceRequestErrorCode;
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
        Schema::create('voice_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->text('raw_transcript');
            $table->string('language_code', 10)->default('fr-FR');
            $table->enum('status', Status::cases())
                ->default(Status::Pending);
            $table->string('audio_path')->nullable();
            $table->enum('error_code', VoiceRequestErrorCode::cases())
                ->nullable()
                ->default(null);
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')
                ->comment('Timestamp when the voice request was processed by the nlp service')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voice_requests');
    }
};
