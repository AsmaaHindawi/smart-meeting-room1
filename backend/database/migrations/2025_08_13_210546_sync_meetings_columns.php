<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('meetings', function (Blueprint $table) {
            // add only if missing (safe to run multiple times)
            if (! Schema::hasColumn('meetings', 'date')) {
                $table->date('date')->nullable()->index()->after('agenda');
            }
            if (! Schema::hasColumn('meetings', 'time')) {
                $table->time('time')->nullable()->index()->after('date');
            }
            if (! Schema::hasColumn('meetings', 'duration')) {
                $table->integer('duration')->nullable()->after('time');
            }
            if (! Schema::hasColumn('meetings', 'recurring')) {
                $table->boolean('recurring')->default(false)->after('duration');
            }
            if (! Schema::hasColumn('meetings', 'video')) {
                $table->boolean('video')->default(false)->after('recurring');
            }
            if (! Schema::hasColumn('meetings', 'agenda')) {
                $table->text('agenda')->nullable()->after('title');
            }
        });
    }

    public function down(): void
    {
        // no-op: we don't want to drop columns accidentally
    }
};
