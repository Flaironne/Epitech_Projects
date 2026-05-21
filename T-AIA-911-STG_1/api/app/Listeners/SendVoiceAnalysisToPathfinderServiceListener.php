<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\VoiceAnalysisProcessed;
use App\Jobs\SendToPathfinderServiceJob;

class SendVoiceAnalysisToPathfinderServiceListener
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
    public function handle(VoiceAnalysisProcessed $event): void
    {
        SendToPathfinderServiceJob::dispatch($event->voiceAnalysis);
    }
}
