<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\MatchPasswordRule;
use App\Rules\PasswordRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "password" => ["required", new MatchPasswordRule()],
            "firstname" => ["sometimes", "string", "min:1", "max:255",],
            "lastname" => ["string", "min:1", "max:255"],
            "new_password" => ["string", "min:8", "confirmed", new PasswordRule()],
            "phone" => ["numeric", "digits:10"],
            "region_id" => ["nullable", "exists:regions,id"],
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
