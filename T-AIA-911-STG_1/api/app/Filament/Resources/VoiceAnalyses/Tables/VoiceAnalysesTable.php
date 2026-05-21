<?php

namespace App\Filament\Resources\VoiceAnalyses\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class VoiceAnalysesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->poll('1s')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('status')
                    ->badge()
                    ->searchable(),
                TextColumn::make('voiceRequest.raw_transcript')
                    ->label('Transcript')
                    ->searchable(),
                TextColumn::make('analysis.departure')
                    ->label('Departure')
                    ->searchable(),
                TextColumn::make('analysis.destination')
                    ->label('Destination')
                    ->searchable(),
                TextColumn::make('confidence_score')
                    ->formatStateUsing(fn($state) => sprintf('%.2f%%', $state * 100))
                    ->sortable()
                    ->searchable(),
                TextColumn::make('processed_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('id')
                    ->label('ID')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([])
            ->recordActions([
                ViewAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
