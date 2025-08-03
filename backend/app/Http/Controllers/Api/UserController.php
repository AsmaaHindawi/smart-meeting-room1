<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Return a list of all users.
     */
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    /**
     * Validate and create a new user.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:255|unique:users,username',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            // now allows admin, user, or employee
            'roles'    => 'required|in:admin,user,employee',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return response()->json($user, 201);
    }

    /**
     * Show a single user by ID.
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user, 200);
    }

    /**
     * Validate and update an existing user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'username' => 'sometimes|required|string|max:255|unique:users,username,' . $id,
            'email'    => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
            // now allows admin, user, or employee
            'roles'    => 'sometimes|in:admin,user,employee',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return response()->json($user, 200);
    }

    /**
     * Delete a user by ID.
     */
    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}
