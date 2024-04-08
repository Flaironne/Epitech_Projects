<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\LikeResource;
use App\Http\Resources\NotificationResource;
use App\Http\Resources\UserResource;
use App\Models\Like;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class  AuthController extends Controller
{

    public function me()
    {
        $user = User::with('region')->find(auth()->user()->id);
        return response()->json([
            'user' => UserResource::make($user),
        ]);
    }

    public function notifications()
    {
        /**
         * @var User $user
         */
        $user = auth()->user();
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        return response()->json(NotificationResource::collection($notifications));
    }

    public function likes(Request $request)
    {
        if ($request->get('id')) {
            $likes = Like::where('user_id', auth()->user()->id)->pluck('job_id');
            return response()->json($likes);
        }

        $likes = Like::with('job')->where('user_id', auth()->user()->id)->orderBy('created_at', 'desc')->get();
        return response()->json(LikeResource::collection($likes));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials)) {
            $user = User::with('region')->find(auth()->user()->id);
            $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json([
                'user' => UserResource::make($user),
                'token' => $token,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials'
        ], 401);
    }

    public function register(RegisterRequest $request)
    {
        $user = \App\Models\User::create($request->validated());
        $user->load('region');
        return response()->json([
            'success' => true
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }
}
