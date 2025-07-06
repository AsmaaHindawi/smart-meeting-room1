<?php

// File: app/Http/Controllers/Api/NotificationController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(Notification::with('user')->get(), 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'  => 'required|exists:users,id',
            'subject'  => 'required|string|max:255',
            'to'       => 'required|string|max:255',
            'from'     => 'required|string|max:255',
            'is_seen'  => 'boolean',
        ]);

        $notification = Notification::create($data);
        return response()->json($notification, 201);
    }

    public function show($id)
    {
        $notification = Notification::with('user')->findOrFail($id);
        return response()->json($notification, 200);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $data = $request->validate([
            'user_id'  => 'sometimes|required|exists:users,id',
            'subject'  => 'sometimes|required|string|max:255',
            'to'       => 'sometimes|required|string|max:255',
            'from'     => 'sometimes|required|string|max:255',
            'is_seen'  => 'boolean',
        ]);

        $notification->update($data);
        return response()->json($notification, 200);
    }

    public function destroy($id)
    {
        Notification::destroy($id);
        return response()->json(null, 204);
    }
}
