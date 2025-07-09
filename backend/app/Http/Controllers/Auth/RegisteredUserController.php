<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles'    => ['required', 'in:admin,user'],
        ]);

        // Create the user using the validated fields...
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'roles'    => $request->roles,
        ]);

        // Issue a token
        $token = $user->createToken($request->username)->plainTextToken;

        // Return JSON response
        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }
}
