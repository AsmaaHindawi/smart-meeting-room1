<?php

// File: app/Http/Controllers/Api/MinutesOfMeetingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MinutesOfMeeting;
use App\Models\Meeting;

use Illuminate\Http\Request;

class MinutesOfMeetingController extends Controller
{
    public function index()
    {
        return response()->json(MinutesOfMeeting::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'action_items'      => 'nullable|string',
            'discussion_points' => 'nullable|string',
            'decisions'         => 'nullable|string',
            'file_url'          => 'nullable|url',
        ]);

        $mom = MinutesOfMeeting::create($data);
        return response()->json($mom, 201);
    }

    public function show($id)
    {
        $mom = MinutesOfMeeting::findOrFail($id);
        return response()->json($mom, 200);
    }
    public function showByMeetingId($meetingId)
{
    $mom = MinutesOfMeeting::where('meeting_id', $meetingId)->first();

    if (!$mom) {
        return response()->json(['message' => 'Minutes not found for this meeting'], 404);
    }

    return response()->json($mom, 200);
}


    public function update(Request $request, $id)
    {
        $mom = MinutesOfMeeting::findOrFail($id);

        $data = $request->validate([
            'action_items'      => 'nullable|string',
            'discussion_points' => 'nullable|string',
            'decisions'         => 'nullable|string',
            'file_url'          => 'nullable|url',
        ]);

        $mom->update($data);
        return response()->json($mom, 200);
    }

    public function destroy($id)
    {
        MinutesOfMeeting::destroy($id);
        return response()->json(null, 204);
    }
    public function meetingsWithAttendees()
{
    $meetings = Meeting::with('attendees:id,name,email')->get();
    return response()->json($meetings, 200);
}

}
