<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Breeze auth controllers
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Your API resource controllers
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\MinutesOfMeetingController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\MeetingAttendeeController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| Public (unauthenticated) routes
|--------------------------------------------------------------------------
*/

// User registration
Route::post('register', [RegisteredUserController::class,       'store']);

// User login (token‐based)
Route::post('login',    [AuthenticatedSessionController::class, 'store']);

// Forgot password (send reset link)
Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);

// Reset password
Route::post('reset-password',  [NewPasswordController::class,       'store']);

/*
|--------------------------------------------------------------------------
| Protected routes (require valid Sanctum token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Get current user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout (revoke token)
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy']);

    // CRUD for all your entities
    Route::apiResource('users',         UserController::class);
    Route::apiResource('rooms',         RoomController::class);
    Route::apiResource('meetings',      MeetingController::class);
    Route::apiResource('minutes',       MinutesOfMeetingController::class);
    Route::apiResource('bookings',      BookingController::class);
    Route::apiResource('attendees',     MeetingAttendeeController::class);
    Route::apiResource('notifications', NotificationController::class);
});
