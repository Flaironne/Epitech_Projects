<?php

namespace App\Filament\Resources\VoiceRequests\Pages;

use App\Filament\Resources\VoiceRequests\VoiceRequestResource;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewVoiceRequest extends ViewRecord
{
    protected static string $resource = VoiceRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('view-analysis')
                ->label('View Analysis')
                ->icon('heroicon-o-eye')
                ->color('primary')
                ->visible(
                    fn() =>
                    $this->record->status?->value === 'processed'
                        && $this->record->analysis !== null
                )
                ->url(
                    fn() =>
                    route(
                        'filament.admin.resources.voice-analyses.view',
                        $this->record->analysis
                    )
                )
        ];
    }
}
