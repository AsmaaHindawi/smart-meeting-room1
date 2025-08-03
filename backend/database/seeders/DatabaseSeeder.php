<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Test user
        DB::table('users')->insert([
            'username'   => 'testuser',
            'email'      => 'test@example.com',
            'password'   => Hash::make('secret123'),
            'roles'      => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Default admin for login testing
        DB::table('users')->insert([
            'username'   => 'admin1',
            'email'      => 'admin1@example.com',
            'password'   => Hash::make('secret123'),
            'roles'      => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
