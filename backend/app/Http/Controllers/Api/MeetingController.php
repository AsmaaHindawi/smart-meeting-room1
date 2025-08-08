<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index()
{
    return response()->json(
        Meeting::with([
            'minutes',
            'room',
            'attendees.user', // <-- include user details for each attendee
            'bookings'
        ])->get(),
        200
    );
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
        'title'     => $validated['title'],
        'date'      => $validated['date'],
        'time'      => $validated['time'],
        'duration'  => $validated['duration'],
        'room_id'   => $validated['room_id'],
        'recurring' => $validated['recurring'] ?? false,
        'video'     => $validated['video'] ?? false,
    ]);

    // Insert attendees into meeting_attendees table
    foreach ($validated['attendees'] as $userId) {
        $meeting->attendees()->create([
            'user_id'         => $userId,
            'role_in_meeting' => 'participant', // or pass from request if variable
            'status'          => 'invited',
            'attended'        => false,
        ]);
    }

    // Return meeting with attendees (including user details)
    return response()->json(
        $meeting->load(['attendees.user', 'room']),
        201
    );
}



    public function show($id)
    {
        $meeting = Meeting::with(['minutes','room','attendees','bookings'])
                          ->findOrFail($id);

        return response()->json($meeting, 200);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $data = $request->validate([
            'room_id' => 'sometimes|required|exists:rooms,id',
            // ← allow clearing/changing mom_id on update
            'mom_id'  => 'sometimes|nullable|exists:minutes_of_meetings,id',
            'title'   => 'sometimes|required|string|max:255',
            'agenda'  => 'nullable|string',
        ]);

        $meeting->update($data);

        return response()->json($meeting, 200);
    }

    public function destroy($id)
    {
        Meeting::destroy($id);
        return response()->json(null, 204);
    }
}
