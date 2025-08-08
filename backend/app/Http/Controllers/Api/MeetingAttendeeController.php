<?php

// File: app/Http/Controllers/Api/MeetingAttendeeController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MeetingAttendee;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingAttendeeController extends Controller
{
    public function index()
    {
        return response()->json(MeetingAttendee::with(['user','meeting'])->get(), 200);
    }

 public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'date' => 'required|date',
        'time' => 'required',
        'duration' => 'required|integer',
        'attendees' => 'required|array',
        'attendees.*' => 'integer|exists:users,id', // validate each attendee ID
        'room_id' => 'required|integer|exists:rooms,id',
        'recurring' => 'boolean',
        'video' => 'boolean',
    ]);

    // Create the meeting
    $meeting = Meeting::create([
        'title' => $validated['title'],
        'date' => $validated['date'],
        'time' => $validated['time'],
        'duration' => $validated['duration'],
        'room_id' => $validated['room_id'],
        'recurring' => $validated['recurring'] ?? false,
        'video' => $validated['video'] ?? false,
    ]);

    // Insert attendees into meeting_attendees
    foreach ($validated['attendees'] as $userId) {
        $meeting->attendees()->create([
            'user_id' => $userId,
            'role_in_meeting' => 'participant', // default role, change if needed
            'status' => 'invited',
            'attended' => false,
        ]);
    }

    return response()->json($meeting->load('attendees.user'), 201);
}


    public function show($id)
    {
        $attendee = MeetingAttendee::with(['user','meeting'])->findOrFail($id);
        return response()->json($attendee, 200);
    }

    public function update(Request $request, $id)
    {
        $attendee = MeetingAttendee::findOrFail($id);

        $data = $request->validate([
            'meeting_id'     => 'sometimes|required|exists:meetings,id',
            'user_id'        => 'sometimes|required|exists:users,id',
            'role_in_meeting'=> 'sometimes|required|string|max:255',
            'status'         => 'string|in:invited,accepted,declined',
            'attended'       => 'boolean',
        ]);

        $attendee->update($data);
        return response()->json($attendee, 200);
    }

    public function destroy($id)
    {
        MeetingAttendee::destroy($id);
        return response()->json(null, 204);
    }

    // MeetingAttendeeController.php

public function getByMeeting($meetingId)
{
    $attendees = MeetingAttendee::with('user')
        ->where('meeting_id', $meetingId)
        ->get();

    return response()->json($attendees);
}

}
