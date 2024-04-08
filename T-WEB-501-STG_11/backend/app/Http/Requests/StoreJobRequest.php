<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreJobRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {

        if ($this->user() === null || !($this->user() instanceof User)) {
            return false;
        }

        return $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "label" => ["required","string"],
            "description" => ["required","string"],
            "salary" => ["required","string", "max:255"],
            "duration" => ["required","string", "max:255"],
            "type_id" =>["required","integer", "exists:types,id"],
            "workplace_id" => ["required","integer", "exists:workplaces,id"],
            "region_id" => ["required","integer", "exists:regions,id"],
            "company_id" => ["required","integer", "exists:companies,id"]
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
