<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            // recipient
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->string('subject');
            // e.g. email or in-app target
            $table->string('to');
            $table->string('from');
            $table->boolean('is_seen')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
