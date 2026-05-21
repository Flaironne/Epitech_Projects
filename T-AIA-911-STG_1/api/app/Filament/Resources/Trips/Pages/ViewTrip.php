<?php

namespace App\Filament\Resources\Trips\Pages;

use App\Filament\Resources\Trips\TripResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\ViewRecord;

class ViewTrip extends ViewRecord
{
    protected static string $resource = TripResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('view-analysis')
                ->label('View Analysis')
                ->icon('heroicon-o-eye')
                ->color('primary')
                ->url(
                    fn() =>
                    route(
                        'filament.admin.resources.voice-analyses.view',
                        $this->record->voiceAnalysis
                    )
                )
        ];
    }
}
