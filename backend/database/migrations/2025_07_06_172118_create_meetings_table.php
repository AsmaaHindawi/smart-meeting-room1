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

        $table->date('date')->nullable();
        $table->time('time')->nullable();
        $table->integer('duration')->nullable();
         $table->boolean('recurring')->default(false);
        $table->boolean('video')->default(false);
    });
}

public function down(): void
{
    Schema::dropIfExists('meetings');
}

};
