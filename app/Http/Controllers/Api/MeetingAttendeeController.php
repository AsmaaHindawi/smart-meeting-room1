<?php

// File: app/Http/Controllers/Api/MeetingAttendeeController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MeetingAttendee;
use Illuminate\Http\Request;

class MeetingAttendeeController extends Controller
{
    public function index()
    {
        return response()->json(MeetingAttendee::with(['user','meeting'])->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'meeting_id'     => 'required|exists:meetings,id',
            'user_id'        => 'required|exists:users,id',
            'role_in_meeting'=> 'required|string|max:255',
            'status'         => 'required|string|in:invited,accepted,declined',
            'attended'       => 'boolean',
        ]);

        $attendee = MeetingAttendee::create($data);
        return response()->json($attendee, 201);
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
}
