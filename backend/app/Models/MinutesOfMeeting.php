<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MinutesOfMeeting extends Model
{
    protected $table = 'minutes_of_meetings';

protected $fillable = [
    'meeting_id',
    'action_items',
    'discussion_points',
    'decisions',
    'file_url'
];


    public function meeting()
    {
        return $this->hasOne(Meeting::class, 'mom_id');
    }
public function attendees() {
    return $this->hasMany(MeetingAttendee::class, 'meeting_id', 'meeting_id'); // Adjust keys as needed
}


}
