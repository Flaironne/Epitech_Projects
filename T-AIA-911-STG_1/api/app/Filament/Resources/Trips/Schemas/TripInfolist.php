<?php

namespace App\Filament\Resources\Trips\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TripInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([

            Section::make('Overview')
                ->columnSpanFull()
                ->description('Analysis metadata and processing state.')
                ->columns(12)
                ->schema([
                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('voice_analysis_id')
                                ->label('Analysis ID')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('voiceAnalysis.voice_request_id')
                                ->label('Voice Request ID')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('user.email')
                                ->label('User')
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

                            TextEntry::make('voiceAnalysis.voiceRequest.language_code')
                                ->label('Language')
                                ->placeholder('—')
                                ->columnSpan(4),
                        ]),
                ]),

            Section::make('Analysis')
                ->columnSpanFull()
                ->description('Parsed analysis results (copyable).')
                ->schema([
                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('departure.name')
                                ->label('Departure')
                                ->placeholder('—')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('destination.name')
                                ->label('Destination')
                                ->placeholder('—')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('voiceAnalysis.confidence_score')
                                ->label('Confidence score')
                                ->formatStateUsing(fn($state) => $state !== null ? number_format($state * 100, 2) . '%' : '—')
                                ->columnSpan(4),
                        ]),

                    TextEntry::make('voiceAnalysis.analysis')
                        ->label('Full analysis JSON')
                        ->placeholder('—')
                        ->copyable()
                        ->extraAttributes(['class' => 'font-mono whitespace-pre-wrap'])
                        ->formatStateUsing(function ($state) {
                            if ($state === null) {
                                return null;
                            }

                            if (is_string($state)) {
                                $decoded = json_decode($state, true);

                                return json_last_error() === JSON_ERROR_NONE
                                    ? json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                                    : $state;
                            }

                            return json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                        })
                        ->columnSpanFull(),
                ]),


        ]);
    }
}
