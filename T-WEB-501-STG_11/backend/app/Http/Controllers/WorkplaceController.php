<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\StoreGenericRequest;
use App\Http\Requests\UpdateGenericRequest;
use App\Http\Resources\WorkplaceResource;
use App\Models\Workplace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkplaceController extends Controller
{
    public function index(): JsonResponse
    {
        $workplaces = WorkplaceResource::collection(Workplace::all());
        return response()->json($workplaces);
    }

    public function show(string $id): JsonResponse
    {
        $workplace = Workplace::findOrFail($id);
        return response()->json($workplace);
    }

    public function update(UpdateGenericRequest $request, string $id): JsonResponse
    {
        $workplace = Workplace::findOrFail($id);
        $workplace->update($request->validated());
        return response()->json($workplace);
    }

    public function store(StoreGenericRequest $request): JsonResponse
    {
        $workplace = Workplace::create($request->validated());
        return response()->json($workplace, Http::CREATED->value);
    }

    public function destroy(string $id): JsonResponse
    {
        $workplace = Workplace::findOrFail($id);
        $workplace->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }
}
