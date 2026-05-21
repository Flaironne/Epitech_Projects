<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum Status: string implements HasIcon, HasColor, HasLabel
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Processed = 'processed';
    case Failed = 'failed';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::Pending => 'Pending',
            self::Processing => 'Processing',
            self::Processed => 'Processed',
            self::Failed => 'Failed',
        };
    }

    public function getIcon(): Heroicon
    {
        return match ($this) {
            self::Pending => Heroicon::Clock,
            self::Processing => Heroicon::Cog,
            self::Processed => Heroicon::CheckCircle,
            self::Failed => Heroicon::XCircle,
        };
    }

    public function getColor(): ?string
    {
        return match ($this) {
            self::Pending => 'gray',
            self::Processing => 'warning',
            self::Processed => 'success',
            self::Failed => 'danger',
        };
    }
}
