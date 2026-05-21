<?php

namespace App\Filament\Resources\VoiceRequests\Pages;

use App\Filament\Resources\VoiceRequests\VoiceRequestResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Ruelluna\FilamentVoiceTextarea\Forms\Components\VoiceTextarea;

class ListVoiceRequests extends ListRecords
{
    protected static string $resource = VoiceRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('speechInput')
                ->label('Nouvelle analyse vocale')
                ->icon('heroicon-o-microphone')
                ->modalHeading('Saisie vocale')
                ->modalSubmitActionLabel('Valider')
                ->schema([
                    VoiceTextarea::make('description')
                        ->label('Description')
                        ->required(),
                ])
                ->action(function (array $data) {}),
        ];
    }
}
