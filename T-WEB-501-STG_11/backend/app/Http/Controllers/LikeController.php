<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\LikeRequest;
use App\Http\Resources\LikeResource;
use App\Models\Like;

class LikeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(LikeResource::collection(Like::with('job')->orderBy('created_at', 'desc')->get()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function like(LikeRequest $request)
    {
        if (Like::where('job_id', $request->job_id)->where('user_id', auth()->user()->id)->exists()) {
            return response()->json(['message' => 'You already liked this job'], Http::BAD_REQUEST->value);
        }

        $like = Like::create([
            ...$request->validated(),
            'user_id' => auth()->user()->id
        ]);
        return response()->json(LikeResource::make($like), Http::CREATED->value);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function unlike(LikeRequest $request)
    {
        $like = Like::where('job_id', $request->job_id)->where('user_id', auth()->user()->id)->firstOrFail();
        $like->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $like = Like::findOrFail($id);
        $like->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }
}
