<?php

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
        Schema::create('trip_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();

            $table->foreignUuid('trip_id')
                ->constrained('trips')
                ->cascadeOnDelete();

            $table->unsignedInteger('rank')->default(0);
            $table->integer('duration_seconds');
            $table->integer('duration_minutes');

            $table->json('stops');
            $table->json('timeline');

            $table->unsignedSmallInteger('segments_count')->nullable();
            $table->unsignedSmallInteger('transfers_count')->nullable();

            $table->json('neo4j_meta')->nullable();

            $table->unique(['trip_id', 'rank']);
            $table->index(['trip_id', 'duration_seconds']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_options');
    }
};
