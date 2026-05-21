<?php

namespace App\Filament\Resources\Trips\RelationManagers;

use Filament\Actions\Action;
use Filament\Forms;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;

class TripOptionsRelationManager extends RelationManager
{
    protected static string $relationship = 'options';

    protected static ?string $title = 'Options';
    protected static ?string $recordTitleAttribute = 'id';

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('rank', 'asc')
            ->paginated([10, 25, 50, 100])
            ->columns([
                Tables\Columns\TextColumn::make('rank')
                    ->label('Rank')
                    ->sortable()
                    ->badge(),

                Tables\Columns\TextColumn::make('duration_minutes')
                    ->label('Duration')
                    ->sortable()
                    ->badge()
                    ->formatStateUsing(function ($state, $record) {
                        $minutes = (int) ($record->duration_minutes ?? $state ?? 0);
                        if (! $minutes) {
                            return '—';
                        }
                        $h = intdiv($minutes, 60);
                        $m = $minutes % 60;
                        return sprintf('%d min (%02d:%02d)', $minutes, $h, $m);
                    }),

                Tables\Columns\TextColumn::make('segments_count')
                    ->label('Segments')
                    ->sortable()
                    ->badge()
                    ->formatStateUsing(fn($state) => $state ?? '—'),

                Tables\Columns\TextColumn::make('transfers_count')
                    ->label('Transfers')
                    ->sortable()
                    ->badge()
                    ->formatStateUsing(fn($state) => $state ?? '—'),

                Tables\Columns\TextColumn::make('stops_summary')
                    ->label('Stops')
                    ->wrap()
                    ->limit(80)
                    ->state(function ($record) {
                        $stops = $record->stops ?? [];
                        if (!is_array($stops) || empty($stops)) return '—';

                        // dédoublonnage par id (ou name si pas d'id)
                        $unique = collect($stops)
                            ->filter(fn($s) => is_array($s))
                            ->unique(fn($s) => $s['id'] ?? $s['name'] ?? null)
                            ->values();

                        return $unique->pluck('name')->filter()->implode(' → ');
                    }),

                Tables\Columns\TextColumn::make('neo4j_meta.raw_path_length')
                    ->label('Neo4j len')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->badge()
                    ->formatStateUsing(fn($state) => $state ?? '—'),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\Filter::make('few_transfers')
                    ->label('≤ 1 transfer')
                    ->query(fn($query) => $query->where('transfers_count', '<=', 1)),

                Tables\Filters\Filter::make('fast')
                    ->label('≤ 3h')
                    ->query(fn($query) => $query->where('duration_minutes', '<=', 180)),
            ])->actions([
                Action::make('details')
                    ->label('Details')
                    ->icon('heroicon-o-eye')
                    ->modalHeading(fn($record) => "Option #{$record->rank}")
                    ->modalWidth('7xl')
                    ->modalSubmitAction(false)
                    ->action(fn() => null)
                    ->fillForm(fn($record) => [
                        'rank' => $record->rank,
                        'duration_minutes' => $record->duration_minutes,
                        'segments_count' => $record->segments_count,
                        'transfers_count' => $record->transfers_count,

                        'stops_pretty' => collect($record->stops ?? [])->pluck('name')->filter()->implode(' → ') ?: '—',

                        'timeline_pretty' => collect($record->timeline ?? [])->map(function ($step) {
                            $from = $step['from']['name'] ?? '—';
                            $to   = $step['to']['name'] ?? '—';
                            $rel  = $step['relationship_type'] ?? '—';
                            return "{$from} → {$to} ({$rel})";
                        })->implode("\n") ?: '—',

                        'neo4j_meta_pretty' => $record->neo4j_meta
                            ? json_encode($record->neo4j_meta, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                            : '—',

                        'raw_json_debug' => json_encode([
                            'id' => $record->id,
                            'rank' => $record->rank,
                            'duration_seconds' => $record->duration_seconds,
                            'duration_minutes' => $record->duration_minutes,
                            'segments_count' => $record->segments_count,
                            'transfers_count' => $record->transfers_count,
                            'stops' => $record->stops,
                            'timeline' => $record->timeline,
                            'neo4j_meta' => $record->neo4j_meta,
                        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                    ])
                    ->form([
                        Section::make('Summary')
                            ->schema([
                                Grid::make(12)->schema([
                                    TextInput::make('rank')
                                        ->label('Rank')
                                        ->disabled()
                                        ->columnSpan(2),

                                    TextInput::make('duration_minutes')
                                        ->label('Duration (min)')
                                        ->disabled()
                                        ->columnSpan(4),

                                    TextInput::make('segments_count')
                                        ->label('Segments')
                                        ->disabled()
                                        ->columnSpan(3),

                                    TextInput::make('transfers_count')
                                        ->label('Transfers')
                                        ->disabled()
                                        ->columnSpan(3),
                                ]),
                            ]),

                        Section::make('Route overview')
                            ->schema([
                                Textarea::make('stops_pretty')
                                    ->label('Stops')
                                    ->disabled()
                                    ->rows(3)
                                    ->columnSpanFull(),

                                Textarea::make('timeline_pretty')
                                    ->label('Timeline')
                                    ->disabled()
                                    ->rows(6)
                                    ->extraAttributes(['class' => 'font-mono'])
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Neo4j')
                            ->schema([
                                Textarea::make('neo4j_meta_pretty')
                                    ->label('Neo4j metadata')
                                    ->disabled()
                                    ->rows(6)
                                    ->extraAttributes(['class' => 'font-mono whitespace-pre-wrap'])
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Raw JSON (debug)')
                            ->collapsible()
                            ->collapsed()
                            ->schema([
                                Textarea::make('raw_json_debug')
                                    ->label('Full payload')
                                    ->disabled()
                                    ->rows(12)
                                    ->extraAttributes(['class' => 'font-mono whitespace-pre-wrap'])
                                    ->columnSpanFull(),
                            ]),
                    ])
            ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('rank')->numeric()->required(),
            Forms\Components\TextInput::make('duration_seconds')->numeric()->required(),
            Forms\Components\TextInput::make('duration_minutes')->numeric()->required(),
        ]);
    }
}
