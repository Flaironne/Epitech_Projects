<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGenericRequest;
use App\Http\Requests\UpdateGenericRequest;
use App\Http\Resources\RegionResource;
use App\Models\Region;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function index(): JsonResponse
    {
        $regions = RegionResource::collection(Region::all());
        return response()->json($regions);
    }

    public function show(string $id): JsonResponse
    {
        $region = Region::findOrFail($id);
        return response()->json($region);
    }

    public function update(UpdateGenericRequest $request, string $id): JsonResponse
    {
        $region = Region::findOrFail($id);
        $region->update($request->validated());
        return response()->json($region);
    }

    public function store(StoreGenericRequest $request): JsonResponse
    {
        $region = Region::create($request->validated());
        return response()->json($region, 201);
    }

    public function destroy(string $id): JsonResponse
    {
        $region = Region::findOrFail($id);
        $region->delete();
        return response()->json(null, 204);
    }
}
