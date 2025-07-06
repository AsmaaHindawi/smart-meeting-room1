<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void
{
    Schema::create('meeting_attendees', function (Blueprint $table) {
        $table->id();
        $table->foreignId('meeting_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('role_in_meeting');
        $table->string('status')->default('invited');
        $table->boolean('attended')->default(false);
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('meeting_attendees');
}

};
