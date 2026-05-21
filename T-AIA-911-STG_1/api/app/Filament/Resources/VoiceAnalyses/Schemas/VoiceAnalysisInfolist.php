<?php

namespace App\Filament\Resources\VoiceAnalyses\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VoiceAnalysisInfolist
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
                            TextEntry::make('id')
                                ->label('Analysis ID')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('voice_request_id')
                                ->label('Voice Request ID')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('voiceRequest.user.email')
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

                            TextEntry::make('processed_at')
                                ->label('Processed')
                                ->dateTime('d/m/Y H:i')
                                ->placeholder('—')
                                ->columnSpan(4),
                        ]),

                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('voiceRequest.language_code')
                                ->label('Language Code')
                                ->columnSpan(4),

                            TextEntry::make('confidence_score')
                                ->label('Confidence score')
                                ->formatStateUsing(
                                    fn($state) =>
                                    $state !== null
                                        ? number_format($state * 100, 2) . '%'
                                        : '—'
                                )
                                ->columnSpan(4),

                            TextEntry::make('status')
                                ->label('Status')
                                ->badge()
                                ->columnSpan(4),
                        ]),
                ]),

            // Add a section with the analysis json data, formatted and copyable
            Section::make('Analysis')
                ->columnSpanFull()
                ->description('Parsed analysis results (copyable).')
                ->schema([
                    Grid::make(12)
                        ->columnSpanFull()
                        ->schema([
                            TextEntry::make('analysis.departure')
                                ->label('Departure')
                                ->placeholder('—')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('analysis.destination')
                                ->label('Destination')
                                ->placeholder('—')
                                ->copyable()
                                ->columnSpan(4),

                            TextEntry::make('analysis.confidence_score')
                                ->label('Confidence score')
                                ->formatStateUsing(fn($state) => $state !== null ? number_format($state * 100, 2) . '%' : '—')
                                ->columnSpan(4),
                        ]),

                    TextEntry::make('analysis')
                        ->label('Full analysis JSON')
                        ->placeholder('—')
                        ->copyable()
                        ->extraAttributes(['class' => 'font-mono whitespace-pre-wrap'])
                        ->formatStateUsing(function ($state) {
                            if ($state === null) {
                                return null;
                            }

                            // Si c'est déjà une string JSON, on la "pretty print" quand possible
                            if (is_string($state)) {
                                $decoded = json_decode($state, true);

                                return json_last_error() === JSON_ERROR_NONE
                                    ? json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                                    : $state;
                            }

                            // Si c'est un array / objet => stringify proprement
                            return json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                        })
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
        ]);
    }
}
