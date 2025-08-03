<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class UpdateRolesEnumInUsersTable extends Migration
{
    public function up(): void
    {
        DB::statement("
          ALTER TABLE `users`
          MODIFY COLUMN `roles`
            ENUM('admin','user','employee')
            NOT NULL
            DEFAULT 'user'
        ");
    }

    public function down(): void
    {
        DB::statement("
          ALTER TABLE `users`
          MODIFY COLUMN `roles`
            ENUM('admin','user')
            NOT NULL
            DEFAULT 'user'
        ");
    }
}
