<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TripOptionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        $durationMinutes = (int) ($this->duration_minutes ?? 0);
        $durationSeconds = (int) ($this->duration_seconds ?? 0);

        $stops = $this->normalizeJsonArray($this->stops);
        $timeline = $this->normalizeJsonArray($this->timeline);
        $neo4j = $this->normalizeJsonObject($this->neo4j_meta);

        $stopNames = collect($stops)
            ->filter(fn($s) => is_array($s))
            ->map(fn($s) => $s['name'] ?? null)
            ->filter()
            ->values()
            ->all();

        $timelineCompact = collect($timeline)
            ->filter(fn($t) => is_array($t))
            ->map(function ($t) {
                $from = $t['from']['name'] ?? null;
                $to   = $t['to']['name'] ?? null;
                $rel  = $t['relationship_type'] ?? null;

                return [
                    'from' => $from,
                    'to' => $to,
                    'relationship_type' => $rel,
                ];
            })
            ->values()
            ->all();

        return [
            'id' => $this->id,
            'rank' => $this->rank,

            'duration' => [
                'seconds' => $durationSeconds,
                'minutes' => $durationMinutes,
                'human' => $durationMinutes ? $this->formatMinutes($durationMinutes) : null,
            ],

            'counts' => [
                'segments' => $this->segments_count,
                'transfers' => $this->transfers_count,
            ],

            // Version complète si ton front en a besoin
            'stops' => $stops,
            'timeline' => $timeline,

            // Versions “faciles” pour UI
            'stops_summary' => [
                'count' => count($stopNames),
                'names' => $stopNames,
                'path' => $stopNames ? implode(' → ', $stopNames) : null,
            ],

            'timeline_summary' => [
                'count' => count($timelineCompact),
                'steps' => $timelineCompact,
                'compact_lines' => $this->timelineLines($timelineCompact),
            ],

            'neo4j_meta' => $neo4j,

            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }

    private function formatMinutes(int $minutes): string
    {
        $h = intdiv($minutes, 60);
        $m = $minutes % 60;

        if ($h <= 0) {
            return "{$m} min";
        }

        return sprintf('%dh%02d', $h, $m);
    }

    /**
     * @param mixed $value
     * @return array<int, mixed>
     */
    private function normalizeJsonArray($value): array
    {
        if ($value === null) {
            return [];
        }

        // Si c’est déjà casté array
        if (is_array($value)) {
            return $value;
        }

        // Si ça arrive encore en string JSON
        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : [];
        }

        return [];
    }

    /**
     * @param mixed $value
     * @return array<string, mixed>|null
     */
    private function normalizeJsonObject($value): ?array
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value)) {
            // object JSON devient array associatif
            return $value;
        }

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : null;
        }

        return null;
    }

    /**
     * @param array<int, array{from:?string,to:?string,relationship_type:?string}> $timelineCompact
     * @return array<int, string>
     */
    private function timelineLines(array $timelineCompact): array
    {
        return collect($timelineCompact)
            ->map(function ($t) {
                $from = $t['from'] ?? '—';
                $to = $t['to'] ?? '—';
                $rel = $t['relationship_type'] ?? '—';
                return "{$from} → {$to} ({$rel})";
            })
            ->values()
            ->all();
    }
}
