<?php

namespace App\Filament\Resources\VoiceAnalyses;

use App\Filament\Resources\VoiceAnalyses\Pages\CreateVoiceAnalysis;
use App\Filament\Resources\VoiceAnalyses\Pages\EditVoiceAnalysis;
use App\Filament\Resources\VoiceAnalyses\Pages\ListVoiceAnalyses;
use App\Filament\Resources\VoiceAnalyses\Pages\ViewVoiceAnalysis;
use App\Filament\Resources\VoiceAnalyses\Schemas\VoiceAnalysisForm;
use App\Filament\Resources\VoiceAnalyses\Schemas\VoiceAnalysisInfolist;
use App\Filament\Resources\VoiceAnalyses\Tables\VoiceAnalysesTable;
use App\Models\VoiceAnalysis;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class VoiceAnalysisResource extends Resource
{
    protected static ?string $model = VoiceAnalysis::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChartBar;

    protected static ?int $navigationSort = 11;

    protected static string|UnitEnum|null $navigationGroup = 'Workflow';

    protected static ?string $recordTitleAttribute = 'id';

    public static function infolist(Schema $schema): Schema
    {
        return VoiceAnalysisInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VoiceAnalysesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVoiceAnalyses::route('/'),
            'view' => ViewVoiceAnalysis::route('/{record}'),
        ];
    }
}
