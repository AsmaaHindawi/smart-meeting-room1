<?php

// File: app/Http/Controllers/Api/RoomController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'location'  => 'required|string|max:255',
            'capacity'  => 'required|integer|min:1',
            'features'  => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $room = Room::create($data);
        return response()->json($room, 201);
    }

    public function show($id)
    {
        $room = Room::findOrFail($id);
        return response()->json($room, 200);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $data = $request->validate([
            'location'  => 'sometimes|required|string|max:255',
            'capacity'  => 'sometimes|required|integer|min:1',
            'features'  => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $room->update($data);
        return response()->json($room, 200);
    }

    public function destroy($id)
    {
        Room::destroy($id);
        return response()->json(null, 204);
    }
}


