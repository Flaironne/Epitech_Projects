import type { VoiceNavigationResponse } from '@/types/voice';

export const mockVoiceNavigation: VoiceNavigationResponse = {
  status: 'completed',
  requestId: 'c9f3a1b4-2e17-4c9e-9a7d-8a92c3b1d721',
  language: 'fr-FR',
  input: {
    rawTranscript: 'Je pars de Strasbourg et je veux aller à Lyon en passant par Besançon',
  },
  analysis: {
    departure: {
      label: 'Strasbourg',
      coordinates: {
        lat: 48.5734,
        lng: 7.7521,
      },
    },
    destination: {
      label: 'Lyon',
      coordinates: {
        lat: 45.764,
        lng: 4.8357,
      },
    },
    stops: [
      {
        label: 'Besançon',
        coordinates: {
          lat: 47.2378,
          lng: 6.0241,
        },
      },
    ],
  },
  route: {
    totalDuration: {
      value: 16200,
      unit: 'seconds',
      formatted: '4h 30m',
    },
    estimatedArrivalTime: {
      iso: '2025-12-20T18:45:00+01:00',
      formatted: '18:45',
    },
    distance: {
      value: 430,
      unit: 'km',
    },
  },
  timeline: [
    {
      type: 'departure',
      label: 'Strasbourg',
      order: 0,
    },
    {
      type: 'stop',
      label: 'Besançon',
      order: 1,
    },
    {
      type: 'destination',
      label: 'Lyon',
      order: 2,
    },
  ],
  meta: {
    confidence: 0.92,
    generatedAt: '2025-12-20T14:12:00+01:00',
  },
};
