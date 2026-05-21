<?php

namespace App\Filament\Resources\Trips\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TripsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->poll('1s')
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('voiceAnalysis.voiceRequest.raw_transcript')
                    ->label('Transcript')
                    ->searchable(),
                TextColumn::make('departure.name')
                    ->label('Departure')
                    ->searchable(),
                TextColumn::make('destination.name')
                    ->label('Destination')
                    ->searchable(),
                TextColumn::make('options_count')
                    ->label('Options')
                    ->counts('options'),
                TextColumn::make('user.name'),
                TextColumn::make('voice_analysis_id')
                    ->label('Voice Analysis ID')
                    ->toggleable(isToggledHiddenByDefault: true),
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
