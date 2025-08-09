<?php

// File: app/Http/Controllers/Api/MinutesOfMeetingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MinutesOfMeeting;
use App\Models\Meeting;

use Illuminate\Http\Request;

class MinutesOfMeetingController extends Controller
{
    // public function index()
    // {
        
    //     return response()->json(MinutesOfMeeting::all(), 200);
    // }
public function index() {
    $minutes = MinutesOfMeeting::with('attendees.user')->get();
    return response()->json($minutes);
}

   
public function store(Request $request)
{
    $data = $request->validate([
        'meeting_id'        => 'required|exists:meetings,id',
        'action_items'      => 'nullable|string',
        'discussion_points' => 'nullable|string',
        'decisions'         => 'nullable|string',
        'file_url'          => 'nullable|url',
        'attendees'         => 'array' // optional
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

// public function storeByMeeting(Request $request, $meetingId)
// {
//     $minutes = Minutes::updateOrCreate(
//         ['meeting_id' => $meetingId],
//         ['content' => $request->input('content')]
//     );

//     return response()->json([
//         'message' => 'Minutes saved successfully',
//         'data' => $minutes
//     ]);
// }

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
 public function getByMeeting($meetingId)
    {
        $minutes = MinutesOfMeeting::where('meeting_id', $meetingId)->first();

        if (!$minutes) {
            return response()->json([
                'message' => 'No minutes found for this meeting',
                'data' => null
            ], 404);
        }

        return response()->json([
            'message' => 'Minutes found',
            'data' => $minutes
        ]);
    }

    // ✅ Save/update minutes for a meeting
    public function storeByMeeting(Request $request, $meetingId)
    {
        $validated = $request->validate([
            'content' => 'required|string'
        ]);

        $minutes = MinutesOfMeeting::updateOrCreate(
            ['meeting_id' => $meetingId],
            ['content' => $validated['content']]
        );

        return response()->json([
            'message' => 'Minutes saved successfully',
            'data' => $minutes
        ]);
    }
}
