<?php

namespace App\Filament\Resources\VoiceAnalyses\Pages;

use App\Filament\Resources\VoiceAnalyses\VoiceAnalysisResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Ruelluna\FilamentVoiceTextarea\Forms\Components\VoiceTextarea;

class ListVoiceAnalyses extends ListRecords
{
    protected static string $resource = VoiceAnalysisResource::class;

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
                        ->enableVoice()
                        ->required(),
                ])
                ->action(function (array $data) {}),
        ];
    }
}
