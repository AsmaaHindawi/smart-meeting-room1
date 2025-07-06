<?php

// File: app/Http/Controllers/Api/MeetingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    public function index()
    {
        return response()->json(Meeting::with(['minutes','room','attendees','bookings'])->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'mom_id' => 'required|exists:minutes_of_meetings,id',
            'room_id'=> 'required|exists:rooms,id',
            'title'  => 'required|string|max:255',
            'agenda' => 'nullable|string',
        ]);

        $meeting = Meeting::create($data);
        return response()->json($meeting, 201);
    }

    public function show($id)
    {
        $meeting = Meeting::with(['minutes','room','attendees','bookings'])->findOrFail($id);
        return response()->json($meeting, 200);
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $data = $request->validate([
            'mom_id' => 'sometimes|required|exists:minutes_of_meetings,id',
            'room_id'=> 'sometimes|required|exists:rooms,id',
            'title'  => 'sometimes|required|string|max:255',
            'agenda' => 'nullable|string',
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

