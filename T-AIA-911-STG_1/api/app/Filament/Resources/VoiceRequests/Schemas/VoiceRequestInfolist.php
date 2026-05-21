<?php

namespace App\Filament\Resources\VoiceRequests\Schemas;

use App\Services\VoiceRequestService;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VoiceRequestInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Overview')
                ->description('Key details and processing status.')
                ->columns(12)
                ->schema([
                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('user.email')
                                ->label('User')
                                ->placeholder('—')
                                ->columnSpan(4),

                            TextEntry::make('language_code')
                                ->label('Language')
                                ->placeholder('—')
                                ->columnSpan(4),

                            TextEntry::make('status')
                                ->label('Status')
                                ->badge()
                                ->columnSpan(4),
                        ]),

                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('created_at')
                                ->label('Created')
                                ->dateTime('d/m/Y H:i')
                                ->placeholder('—')
                                ->columnSpan(4),

                            TextEntry::make('updated_at')
                                ->label('Last updated')
                                ->dateTime('d/m/Y H:i')
                                ->placeholder('—')
                                ->columnSpan(4),

                            TextEntry::make('processed_at')
                                ->label('Processed')
                                ->dateTime('d/m/Y H:i')
                                ->placeholder('—')
                                ->columnSpan(4),
                        ]),
                ]),

            Section::make('Transcript')
                ->description('Recognized text (copyable).')
                ->schema([
                    TextEntry::make('raw_transcript')
                        ->label('Raw transcript')
                        ->placeholder('—')
                        ->copyable()
                        ->columnSpanFull(),
                ]),

            Section::make('Error details')
                ->columnSpanFull()
                ->description('Shown only when an error is present.')
                ->visible(fn($record) => filled($record->error_code) || filled($record->error_message))
                ->schema([
                    TextEntry::make('error_code')
                        ->label('Error code')
                        ->badge()
                        ->visible(fn($record) => filled($record->error_code))
                        ->columnSpan(3),

                    TextEntry::make('error_message')
                        ->label('Error message')
                        ->placeholder('—')
                        ->columnSpanFull(),
                ]),

            Section::make('Audio')
                ->columnSpanFull()
                ->description('Source file and temporary access link.')
                ->schema([
                    TextEntry::make('audio_path')
                        ->label('Audio path')
                        ->placeholder('—')
                        ->copyable()
                        ->extraAttributes(['class' => 'font-mono'])
                        ->columnSpanFull(),

                    TextEntry::make('audio_url')
                        ->label('Audio link')
                        ->state(function ($record) {
                            if (! $record->audio_path) {
                                return null;
                            }

                            return app(VoiceRequestService::class)
                                ->generateTemporaryAudioUrl($record);
                        })
                        ->url(fn($state) => $state, shouldOpenInNewTab: true)
                        ->placeholder('—')
                        ->extraAttributes(['class' => 'font-mono'])
                        ->columnSpanFull(),
                ]),
        ]);
    }
}
