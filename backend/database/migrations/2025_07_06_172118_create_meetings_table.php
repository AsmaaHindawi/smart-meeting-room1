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
    Schema::create('meetings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('mom_id')
              ->constrained('minutes_of_meetings')
              ->onDelete('cascade');
        $table->foreignId('room_id')
              ->constrained('rooms')
              ->onDelete('cascade');
        $table->string('title');
        $table->text('agenda')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('meetings');
}

};
