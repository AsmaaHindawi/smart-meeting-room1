<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'location',
        'capacity',
        'features',
        'is_active',
    ];

    // ← Cast our JSON and boolean columns
    protected $casts = [
        'features'  => 'array',
        'is_active' => 'boolean',
    ];

    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
