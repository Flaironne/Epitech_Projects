<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\StoreGenericRequest;
use App\Http\Requests\UpdateGenericRequest;
use App\Http\Resources\TypeResource;
use App\Models\Type;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    public function index()
    {
        $types = TypeResource::collection(\App\Models\Type::all());
        return response()->json($types);
    }
    
    public function show(string $id): JsonResponse
    {
        $type = Type::findOrFail($id);
        return response()->json($type);
    }

    public function update(UpdateGenericRequest $request, string $id): JsonResponse
    {
        $type = Type::findOrFail($id);
        $type->update($request->validated());
        return response()->json($type);
    }

    public function store(StoreGenericRequest $request): JsonResponse
    {
        $type = Type::create($request->validated());
        return response()->json($type, Http::CREATED->value);
    }

    public function destroy(string $id): JsonResponse
    {
        $type = Type::findOrFail($id);
        $type->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }
}
