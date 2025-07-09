<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request via email/password and
     * return a JSON response with a token.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required','email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($data)) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $user = $request->user();

        // Optionally revoke existing tokens:
        // $user->tokens()->delete();

        $token = $user->createToken($user->username)->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Log out (revoke) the current token.
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(null, 204);
    }
}
