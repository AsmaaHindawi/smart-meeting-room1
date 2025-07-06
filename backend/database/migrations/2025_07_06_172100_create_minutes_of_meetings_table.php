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
    Schema::create('minutes_of_meetings', function (Blueprint $table) {
        $table->id();
        $table->text('action_items')->nullable();
        $table->text('discussion_points')->nullable();
        $table->text('decisions')->nullable();
        $table->string('file_url')->nullable();
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('minutes_of_meetings');
}

};
