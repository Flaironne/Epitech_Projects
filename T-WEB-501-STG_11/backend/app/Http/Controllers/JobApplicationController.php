<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Events\JobApplicationSubmitted;
use App\Events\JobApplicationSubmittedEvent;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use App\Models\JobApplication;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applications = JobApplication::orderBy('created_at', 'desc')->get();
        return response()->json(JobApplicationResource::collection($applications));
    }

    public function me()
    {
        $applications = JobApplication::with('job')->where('user_id', auth()->id())->orderBy('created_at', 'desc')->get();
        return response()->json(JobApplicationResource::collection($applications));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobApplicationRequest $request)
    {
        $jobId = (int) $request->route('job');
        $jobApplication = JobApplication::create([
            "job_id" => $jobId,
            ...$request->validated()
        ]);
        $jobApplication->load('user');

        event(new JobApplicationSubmittedEvent($jobApplication));
        
        return response()->json([
            "success" => true,
            "message" => "Job application created successfully",
            "job_application" => JobApplicationResource::make($jobApplication)
        ], Http::CREATED->value);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }
}
