<?php

namespace App\Filament\Resources\VoiceAnalyses\Pages;

use App\Enums\Status;
use App\Filament\Resources\VoiceAnalyses\VoiceAnalysisResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewVoiceAnalysis extends ViewRecord
{
    protected static string $resource = VoiceAnalysisResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('view-request')
                ->label('View Request')
                ->icon('heroicon-o-eye')
                ->color('gray')
                ->url(
                    fn() =>
                    route(
                        'filament.admin.resources.voice-requests.view',
                        $this->record->voiceRequest
                    )
                ),
            Action::make('view-pathfinder-response')
                ->label('Pathfinder Response')
                ->icon('heroicon-o-eye')
                ->color('primary')
                ->url(
                    fn() =>
                    route(
                        'filament.admin.resources.trips.view',
                        $this->record->trip
                    )
                )
        ];
    }
}
