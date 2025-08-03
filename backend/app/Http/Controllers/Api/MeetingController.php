<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index()
    {
        // still eager-load your related minutes, room, attendees, bookings
        return response()->json(
            Meeting::with(['minutes','room','attendees','bookings'])->get(),
            200
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            // ← now nullable so you can create meetings before minutes exist
            'mom_id'  => 'nullable|exists:minutes_of_meetings,id',
            'title'   => 'required|string|max:255',
            'agenda'  => 'nullable|string',
        ]);

        $meeting = Meeting::create($data);

        return response()->json($meeting, 201);
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
