<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            // 1) drop the old foreign key
            $table->dropForeign(['mom_id']);

            // 2) make mom_id nullable
            $table->unsignedBigInteger('mom_id')
                  ->nullable()
                  ->change();

            // 3) re-add the foreign key constraint
            $table->foreign('mom_id')
                  ->references('id')
                  ->on('minutes_of_meetings')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            // reverse: drop FK, make NOT NULL, re-add FK
            $table->dropForeign(['mom_id']);

            $table->unsignedBigInteger('mom_id')
                  ->nullable(false)
                  ->change();

            $table->foreign('mom_id')
                  ->references('id')
                  ->on('minutes_of_meetings')
                  ->onDelete('cascade');
        });
    }
};
