<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $fillable = [
        'mom_id',
        'room_id',
        'title',
        'agenda',
    ];

    public function minutes()
    {
        return $this->belongsTo(MinutesOfMeeting::class, 'mom_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function attendees()
    {
        return $this->hasMany(MeetingAttendee::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
