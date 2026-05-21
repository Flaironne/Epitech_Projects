<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\Status;
use App\Enums\VoiceRequestErrorCode;
use App\Models\VoiceRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use function Illuminate\Support\now;

class VoiceRequestService
{
    public function generateTemporaryAudioUrl(VoiceRequest $voiceRequest): ?string
    {
        $path = $voiceRequest->audio_path;

        if (!$path) return null;

        return \Illuminate\Support\Facades\Storage::temporaryUrl(
            $path,
            now()->plus(minutes: 10)
        );
    }

    public function create(array $data, string $userId): VoiceRequest
    {
        return DB::transaction(function () use ($data, $userId) {

            $audioPath = null;

            if (
                isset($data['audio_file']) &&
                $data['audio_file'] instanceof UploadedFile
            ) {
                $audioPath = $data['audio_file']
                    ->store("audios/{$userId}");
            }

            $voiceRequest = VoiceRequest::create([
                'id' => Str::uuid(),
                'user_id' => $userId,
                'raw_transcript' => $data['raw_transcript'],
                'language_code' => $data['language_code'] ?? 'fr-FR',
                'audio_path' => $audioPath,
                'status' => Status::Pending,
            ]);

            event(new \App\Events\VoiceRequestCreated($voiceRequest));

            return $voiceRequest;
        });
    }

    public function markAsFailed(
        VoiceRequest $voiceRequest,
        VoiceRequestErrorCode $errorCode,
        string $errorMessage
    ): void {
        $voiceRequest->status = Status::Failed;
        $voiceRequest->processed_at = now();
        $voiceRequest->error_code = $errorCode;
        $voiceRequest->error_message = $errorMessage;
        $voiceRequest->save();
    }

    public function markAsProcessing(VoiceRequest $voiceRequest): void
    {
        $voiceRequest->status = Status::Processing;
        $voiceRequest->save();
    }
}
