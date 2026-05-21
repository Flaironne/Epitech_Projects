<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum VoiceAnalysisErrorCode: string implements HasIcon, HasColor, HasLabel
{
    case CallbackFailed = 'callback_failed';
    case PathfinderCrashed = 'pathfinder_crashed';
    case PathfinderTimeout = 'pathfinder_timeout';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::CallbackFailed => 'Callback Failed',
            self::PathfinderCrashed => 'Pathfinder Crashed',
            self::PathfinderTimeout => 'Pathfinder Timeout',
        };
    }

    public function getIcon(): Heroicon
    {
        return match ($this) {
            self::CallbackFailed => Heroicon::XMark,
            self::PathfinderCrashed => Heroicon::XMark,
            self::PathfinderTimeout => Heroicon::Clock,
        };
    }

    public function getColor(): ?string
    {
        return match ($this) {
            self::CallbackFailed => 'danger',
            self::PathfinderCrashed => 'danger',
            self::PathfinderTimeout => 'warning',
        };
    }
}
