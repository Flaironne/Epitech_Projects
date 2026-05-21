<?php

declare(strict_types=1);

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;
use Filament\Support\Icons\Heroicon;

enum VoiceRequestErrorCode: string implements HasIcon, HasColor, HasLabel
{
    case NlpCrashed = 'nlp_crashed';
    case NlpTimeout = 'nlp_timeout';
    case LowConfidence = 'low_confidence';
    case CallbackFailed = 'callback_failed';
    case InvalidRequest = 'invalid_request';
    case ServiceUnavailable = 'service_unavailable';

    public function getLabel(): ?string
    {
        return match ($this) {
            self::NlpCrashed => 'NLP Crashed',
            self::NlpTimeout => 'NLP Timeout',
            self::LowConfidence => 'Low Confidence',
            self::InvalidRequest => 'Invalid Request',
            self::CallbackFailed => 'Callback Failed',
            self::ServiceUnavailable => 'Service Unavailable',
        };
    }

    public function getIcon(): Heroicon
    {
        return match ($this) {
            self::NlpTimeout => Heroicon::Clock,
            self::NlpCrashed => Heroicon::CpuChip,
            self::InvalidRequest => Heroicon::XCircle,
            self::LowConfidence => Heroicon::ExclamationCircle,
            self::CallbackFailed => Heroicon::XMark,
            self::ServiceUnavailable => Heroicon::ExclamationTriangle,
        };
    }

    public function getColor(): ?string
    {
        return match ($this) {
            self::NlpTimeout => 'gray',
            self::NlpCrashed => 'danger',
            self::LowConfidence => 'warning',
            self::InvalidRequest => 'danger',
            self::CallbackFailed => 'danger',
            self::ServiceUnavailable => 'warning',
        };
    }
}
