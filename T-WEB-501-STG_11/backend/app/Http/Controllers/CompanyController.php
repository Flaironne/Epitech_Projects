<?php

namespace App\Http\Controllers;

use App\Enums\Http;
use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = Company::withCount('jobs')->get();
        return response()->json(CompanyResource::collection($companies));
    }
    
    public function show(string $id): JsonResponse
    {
        $company = Company::findOrFail($id);
        return response()->json($company);
    }

    public function update(UpdateCompanyRequest $request, string $id): JsonResponse
    {
        $company = Company::findOrFail($id);
        $company->update($request->validated());
        return response()->json(CompanyResource::make($company));
    }

    public function store(StoreCompanyRequest $request): JsonResponse
    {
        $company = Company::create($request->validated());
        return response()->json(null, Http::CREATED->value);
    }

    public function destroy(string $id): JsonResponse
    {
        $company = Company::findOrFail($id);
        $company->delete();
        return response()->json(null, Http::NO_CONTENT->value);
    }
}
