<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\MatchOrUniqueEmailRule;
use App\Rules\PasswordRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(Request $request): array
    {
        $user = User::find($request->route("user"));

        return [
            "email" => ["string", "email", "max:255", new MatchOrUniqueEmailRule($user)],
            "firstname" => ["string", "max:255"],
            "lastname" => ["string", "max:255"],
            "password" => ["string", "min:8", new PasswordRule()],
            "phone" => ["numeric", "digits:10"],
            "region_id" => ["exists:regions,id"],
            "is_admin" => ["boolean"],
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
