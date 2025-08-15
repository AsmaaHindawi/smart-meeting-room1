<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('meetings', 'date')) {
            Schema::table('meetings', function (Blueprint $table) {
                $table->date('date')->nullable()->index();
            });
        }

        if (! Schema::hasColumn('meetings', 'time')) {
            Schema::table('meetings', function (Blueprint $table) {
                $table->time('time')->nullable()->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('meetings', 'date')) {
            Schema::table('meetings', function (Blueprint $table) {
                $table->dropColumn('date');
            });
        }

        if (Schema::hasColumn('meetings', 'time')) {
            Schema::table('meetings', function (Blueprint $table) {
                $table->dropColumn('time');
            });
        }
    }
};
