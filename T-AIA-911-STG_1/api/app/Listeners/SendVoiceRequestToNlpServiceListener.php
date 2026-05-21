<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\VoiceRequestCreated;
use App\Jobs\SendToNlpServiceJob;

class SendVoiceRequestToNlpServiceListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(VoiceRequestCreated $event): void
    {
        SendToNlpServiceJob::dispatch($event->voiceRequest);
    }
}
