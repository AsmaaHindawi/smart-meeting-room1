<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Meeting extends Model
{
    protected $fillable = [
        'room_id',
        'mom_id',
        'title',
        'agenda',
        // Standardize on one column in DB:
        'start_time',
        'duration',
        'recurring',
        'video',
    ];

    protected $casts = [
        // Ensure Carbon instance and proper JSON serialization
        'start_time' => 'datetime',
        'recurring'  => 'boolean',
        'video'      => 'boolean',
    ];

    /* -------------------------
     | Relationships (unchanged)
     * ------------------------*/
    public function minutes()
    {
        // still point at your minutes-of-meetings table via mom_id
        return $this->belongsTo(MinutesOfMeeting::class, 'mom_id');
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function attendees()
    {
        return $this->hasMany(MeetingAttendee::class)->with('user');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /* ------------------------------------------------------
     | Back-compat virtual attributes for UI (read-only)
     | These let the UI keep using meeting.date / meeting.time
     | even though DB stores a single `start_time` column.
     * -----------------------------------------------------*/
    public function getDateAttribute(): ?string
    {
        return $this->start_time instanceof Carbon
            ? $this->start_time->format('Y-m-d')
            : ( $this->start_time ? Carbon::parse($this->start_time)->format('Y-m-d') : null );
    }

    public function getTimeAttribute(): ?string
    {
        return $this->start_time instanceof Carbon
            ? $this->start_time->format('H:i:s')
            : ( $this->start_time ? Carbon::parse($this->start_time)->format('H:i:s') : null );
    }
}
