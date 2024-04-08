<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\SearchRequest;
use App\Http\Requests\StoreJobRequest;
use App\Http\Requests\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Http\Resources\RegionResource;
use App\Http\Resources\TypeResource;
use App\Http\Resources\WorkplaceResource;
use App\Models\Job;
use App\Models\Region;
use App\Models\Type;
use App\Models\User;
use App\Models\Workplace;
use App\ResponseContent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{

    const JOBS_PAGINATE = 8;
    const RELATIONS = ["company", "user", "region", "workplace", "type"];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        if ($request->get("all")) {
            $jobs = Job::with(self::RELATIONS)->get();
        } else {
            $jobs = Job::with(self::RELATIONS)->paginate(self::JOBS_PAGINATE);
        }
        
        return response()->json(JobResource::collection($jobs));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobRequest $request): JsonResponse
    {
        if ($request->validated()) {
            $job = Job::create([
                ...$request->validated(),
                "user_id" => auth()->user()->id
            ]);
            $job->load(self::RELATIONS);
            return response()->json(null, Http::CREATED->value);
        } else {
            return response()->json(null, Http::BAD_REQUEST->value);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $job = Job::with(self::RELATIONS)->findOrFail($id);
        if ($job === null) return response()->json(null, Http::NOT_FOUND->value);
        return response()->json(new JobResource($job));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobRequest $request, string $id)
    {
        $job = Job::findOrFail($id);
        if ($job === null) return response()->json(null, Http::NOT_FOUND->value);
        $job->update($request->validated());
        $job->save();
        $job->load(self::RELATIONS);
        return response()->json(new JobResource($job));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail(auth()->user()->id);
        $job = Job::findOrFail($id);
        if ($job) {
            if ($user->isAdmin()) {
                $job->delete();
                return response()->json(null, Http::NO_CONTENT->value);
            } else {
                return response()->json(ResponseContent::forbidden(), Http::FORBIDDEN->value);
            }
        } else {
            return response()->json(null, Http::NOT_FOUND->value);
        }
    }

    public function filters()
    {
        return response()->json([
            "regions" => RegionResource::collection(Region::all()),
            "workplaces" => WorkplaceResource::collection(Workplace::all()),
            "types" => TypeResource::collection(Type::all())
        ]);
    }

    public function search(SearchRequest $request)
    {
        $filters = $request->validated();
        $wheres = [];

        foreach (array_keys($filters) as $key) {
            if ($key !== "search" && $filters[$key] !== null) {
                if (!($key === "region" && $filters["key"] === "All")) {
                    $wheres[] = [$key, "=", $filters[$key]];
                }
            }
        }

        $jobs = Job::with(self::RELATIONS)
            ->where($wheres)
            ->where(function ($query) use ($filters) {
                $search = $filters["search"] ?? null;
                if ($search !== null) {
                    $query->where("label", "like", "%" . $search . "%")
                        ->orWhere("description", "like", "%" . $search . "%")
                        ->orWhereHas("company", function ($query) use ($search) {
                            $query->where("label", "like", "%" . $search . "%");
                        });
                }
            })
            ->paginate(self::JOBS_PAGINATE);

        return response()->json(JobResource::collection($jobs));
    }
}
