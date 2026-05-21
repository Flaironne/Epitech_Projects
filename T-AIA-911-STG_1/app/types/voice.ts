// types.ts

export type VoiceNavigationStatus = 'analyzing' | 'completed' | 'error';

export interface VoiceNavigationResponse {
  status: VoiceNavigationStatus;
  requestId?: string;
  language?: string;
  input?: VoiceNavigationInput;
  analysis?: VoiceNavigationAnalysis;
  route?: VoiceNavigationRoute;
  timeline?: VoiceNavigationTimelineItem[];
  meta?: VoiceNavigationMeta;
  progress?: number;
  error?: VoiceNavigationError;
}

export interface VoiceNavigationInput {
  rawTranscript: string;
}

export interface VoiceNavigationAnalysis {
  departure: LocationPoint;
  destination: LocationPoint;
  stops: LocationPoint[];
}

export interface LocationPoint {
  label: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface VoiceNavigationRoute {
  totalDuration: Duration;
  estimatedArrivalTime: EstimatedArrivalTime;
  distance: Distance;
}

export interface Duration {
  value: number;
  unit: 'seconds';
  formatted: string;
}

export interface EstimatedArrivalTime {
  iso: string;
  formatted: string;
}

export interface Distance {
  value: number;
  unit: 'km';
}

export type TimelineItemType = 'departure' | 'stop' | 'destination';

export interface VoiceNavigationTimelineItem {
  type: TimelineItemType;
  label: string;
  order: number;
}

export interface VoiceNavigationMeta {
  confidence: number;
  generatedAt: string;
}

export interface VoiceNavigationError {
  code: string;
  message: string;
}
