<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Http\Resources\LikeResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        return response()->json(UserResource::collection(User::all()));
    }

    public function store(StoreUserRequest $request)
    {
        User::create($request->validated());
        return response()->json(null, Http::CREATED->value);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(UserResource::make(User::with(["region"])->findOrFail($id)));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, string $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->validated());
        return response()->json(UserResource::make($user));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }

    public function likes(User $user): JsonResponse
    {
        return response()->json(LikeResource::collection($user->likes));
    }
}
