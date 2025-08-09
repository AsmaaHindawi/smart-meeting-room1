<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('minutes_of_meetings', function (Blueprint $table) {
            $table->unsignedBigInteger('meeting_id')->after('id');

            
        });
    }

    public function down(): void
    {
        Schema::table('minutes_of_meetings', function (Blueprint $table) {
           
            $table->dropColumn('meeting_id');
        });
    }
};
