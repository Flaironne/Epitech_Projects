<?php

namespace App\Filament\Resources\VoiceRequests;

use App\Filament\Resources\VoiceRequests\Pages\ListVoiceRequests;
use App\Filament\Resources\VoiceRequests\Pages\ViewVoiceRequest;
use App\Filament\Resources\VoiceRequests\Schemas\VoiceRequestInfolist;
use App\Filament\Resources\VoiceRequests\Tables\VoiceRequestsTable;
use App\Models\VoiceRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class VoiceRequestResource extends Resource
{
    protected static ?string $model = VoiceRequest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMicrophone;

    protected static string|UnitEnum|null $navigationGroup = 'Workflow';

    protected static ?int $navigationSort = 10;

    protected static ?string $recordTitleAttribute = 'id';

    protected static bool $canCreate = false;

    public static function infolist(Schema $schema): Schema
    {
        return VoiceRequestInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return VoiceRequestsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVoiceRequests::route('/'),
            'view' => ViewVoiceRequest::route('/{record}'),
        ];
    }
}
