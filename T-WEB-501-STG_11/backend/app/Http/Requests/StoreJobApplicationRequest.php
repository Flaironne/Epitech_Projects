<?php

namespace App\Http\Requests;

use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class StoreJobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(Request $request): bool
    {
        if (Job::findOrFail((int) $request->route('job'))) {
            return true;
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(Request $request): array
    {
        $userId = (int) $request->input('user_id');
        if (!User::find($userId)) {
            return [
                "firstname" => ["required", "string", "max:255"],
                "lastname" => ["required", "string", "max:255"],
                "email" => ["required", "string", "email", "max:255"],
                "phone" => ["required", "numeric", "digits:10"],
            ];
        }
        
        return [
            "user_id" => ["required", "exists:users,id"]
        ];
    }

    public function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'data' => $validator->errors()
        ], 422));
    }
}
