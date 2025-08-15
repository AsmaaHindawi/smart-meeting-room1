<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            // These checks are safe to run on any teammate DB state. :contentReference[oaicite:0]{index=0}

            if (! Schema::hasColumn('meetings', 'date')) {
                $table->date('date')->nullable()->index()->after('agenda');
            }

            if (! Schema::hasColumn('meetings', 'time')) {
                $table->time('time')->nullable()->index()->after('date');
            }

            if (! Schema::hasColumn('meetings', 'duration')) {
                $table->unsignedInteger('duration')->nullable()->after('time');
            }

            if (! Schema::hasColumn('meetings', 'recurring')) {
                $table->boolean('recurring')->default(false)->after('duration');
            }

            if (! Schema::hasColumn('meetings', 'video')) {
                $table->boolean('video')->default(false)->after('recurring');
            }
        });
    }

    public function down(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            // Only drop if present (safe down). :contentReference[oaicite:1]{index=1}
            if (Schema::hasColumn('meetings', 'video'))     $table->dropColumn('video');
            if (Schema::hasColumn('meetings', 'recurring')) $table->dropColumn('recurring');
            if (Schema::hasColumn('meetings', 'duration'))  $table->dropColumn('duration');
            if (Schema::hasColumn('meetings', 'time'))      $table->dropColumn('time');
            if (Schema::hasColumn('meetings', 'date'))      $table->dropColumn('date');
        });
    }
};
