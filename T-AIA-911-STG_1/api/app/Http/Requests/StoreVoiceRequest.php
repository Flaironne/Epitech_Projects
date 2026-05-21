<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'raw_transcript' => 'required|string|max:5000',
            'audio_file' => 'nullable|file|mimes:mp3,wav',
            'language_code' => 'nullable|string|size:5',
        ];
    }
}
