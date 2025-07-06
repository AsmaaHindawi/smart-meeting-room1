<?php

// File: app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(Booking::with(['user','room','meeting'])->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'    => 'required|exists:users,id',
            'room_id'    => 'required|exists:rooms,id',
            'meeting_id' => 'required|exists:meetings,id',
            'duration'   => 'required|integer|min:1',
            'status'     => 'required|string|in:pending,confirmed,cancelled',
        ]);

        $booking = Booking::create($data);
        return response()->json($booking, 201);
    }

    public function show($id)
    {
        $booking = Booking::with(['user','room','meeting'])->findOrFail($id);
        return response()->json($booking, 200);
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $data = $request->validate([
            'user_id'    => 'sometimes|required|exists:users,id',
            'room_id'    => 'sometimes|required|exists:rooms,id',
            'meeting_id' => 'sometimes|required|exists:meetings,id',
            'duration'   => 'sometimes|required|integer|min:1',
            'status'     => 'string|in:pending,confirmed,cancelled',
        ]);

        $booking->update($data);
        return response()->json($booking, 200);
    }

    public function destroy($id)
    {
        Booking::destroy($id);
        return response()->json(null, 204);
    }
}

