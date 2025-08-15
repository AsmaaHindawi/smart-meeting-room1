<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\MeetingAttendee;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MeetingController extends Controller
{
    public function index()
    {
        return response()->json(
            Meeting::with(['minutes', 'room', 'attendees.user', 'bookings'])->get(),
            200
        );
    }

    public function show($id)
    {
        $meeting = Meeting::with(['minutes', 'room', 'attendees.user', 'bookings'])
            ->findOrFail($id);

        return response()->json($meeting, 200);
    }

    public function store(Request $request)
    {
        // Validate payload (your original fields)
        $validated = $request->validate([
            'title'      => 'required|string|max:255',
            'date'       => 'nullable|date',
            'time'       => 'nullable',
            'start_time' => 'nullable|date',          // optional one-field input
            'duration'   => 'required|integer',
            'attendees'  => 'required|array',
            'attendees.*'=> 'integer|exists:users,id',
            'room_id'    => 'required|integer|exists:rooms,id',
            'recurring'  => 'boolean',
            'video'      => 'boolean',
            'agenda'     => 'nullable|string',
            'mom_id'     => 'nullable|exists:minutes_of_meetings,id',
        ]);

        // If start_time is provided, split into date/time that your schema expects
        if (!empty($validated['start_time'])) {
            $dt = Carbon::parse($validated['start_time']);
            $validated['date'] = $validated['date'] ?? $dt->toDateString();
            $validated['time'] = $validated['time'] ?? $dt->format('H:i:s');
        }

        // Hard rules: date & time must exist by now
        if (empty($validated['date']) || empty($validated['time'])) {
            return response()->json(['message' => 'date and time are required'], 422);
        }

        return DB::transaction(function () use ($validated) {
            // Only the columns that belong to meetings table
            $meetingData = Arr::only($validated, [
                'title','agenda','date','time','duration','room_id','recurring','video','mom_id'
            ]);

            $meeting = Meeting::create($meetingData);

            // Create attendees rows
            $rows = array_map(function ($userId) {
                return [
                    'user_id'         => $userId,
                    'role_in_meeting' => 'participant',
                    'status'          => 'invited',
                    'attended'        => false,
                ];
            }, $validated['attendees']);

            $meeting->attendees()->createMany($rows);

            return response()->json(
                $meeting->load(['attendees.user', 'room']),
                201
            );
        });
    }

    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $validated = $request->validate([
            'room_id'    => 'sometimes|required|exists:rooms,id',
            'mom_id'     => 'sometimes|nullable|exists:minutes_of_meetings,id',
            'title'      => 'sometimes|required|string|max:255',
            'agenda'     => 'sometimes|nullable|string',
            'date'       => 'sometimes|nullable|date',
            'time'       => 'sometimes|nullable',
            'start_time' => 'sometimes|nullable|date',
            'duration'   => 'sometimes|required|integer',
            'recurring'  => 'sometimes|boolean',
            'video'      => 'sometimes|boolean',
            'attendees'  => 'sometimes|array',
            'attendees.*'=> 'integer|exists:users,id',
        ]);

        if (!empty($validated['start_time'])) {
            $dt = Carbon::parse($validated['start_time']);
            // only override if not explicitly provided
            $validated['date'] = $validated['date'] ?? $dt->toDateString();
            $validated['time'] = $validated['time'] ?? $dt->format('H:i:s');
        }

        return DB::transaction(function () use ($meeting, $validated) {
            // Update meeting main fields
            $meeting->update(Arr::only($validated, [
                'title','agenda','date','time','duration','room_id','recurring','video','mom_id'
            ]));

            // If attendees provided, replace the set
            if (array_key_exists('attendees', $validated)) {
                $meeting->attendees()->delete();
                if (!empty($validated['attendees'])) {
                    $rows = array_map(function ($userId) {
                        return [
                            'user_id'         => $userId,
                            'role_in_meeting' => 'participant',
                            'status'          => 'invited',
                            'attended'        => false,
                        ];
                    }, $validated['attendees']);
                    $meeting->attendees()->createMany($rows);
                }
            }

            return response()->json(
                $meeting->load(['attendees.user', 'room']),
                200
            );
        });
    }

    public function destroy($id)
    {
        Meeting::destroy($id);
        return response()->json(null, 204);
    }
}
