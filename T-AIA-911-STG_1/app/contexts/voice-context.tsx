import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { createContext, FC, ReactNode, useEffect, useRef, useState } from 'react';
import { useSession } from '@/hooks/use-session';
import { useApi } from '@/hooks/use-api';
import type { TripRequest } from '@/types/trip';

export type VoiceContextType = {
  recognizing: boolean;
  transcript: string;
  startRecognition: () => void;
  stopRecognition: () => void;
  submitting: boolean;
  latestTrip: TripRequest | null;
  error: string | null;
  cancelRequest: () => void;
};

export const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [recognizing, setRecognizing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [latestTrip, setLatestTrip] = useState<TripRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSession();
  const { api } = useApi(session?.access_token ?? null);

  const silenceTimeout = useRef<NodeJS.Timeout | null>(null);
  const finalTranscript = useRef('');
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const requestTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.stop();
      if (silenceTimeout.current) clearTimeout(silenceTimeout.current);
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (requestTimeout.current) clearTimeout(requestTimeout.current);
    };
  }, []);

  const pollForTrip = async () => {
    try {
      const response = await api.get<{ data: TripRequest[] }>('/trip-requests');
      if (!response.data || response.data.length === 0) {
        return;
      }
      
      const latest = response.data[0];
      if (latest.state === 'processed') {
        if (!latest.pathfinder?.departure || !latest.pathfinder?.destination) {
          setSubmitting(false);
          setError('Impossible de comprendre votre demande. Veuillez réessayer.');
          if (pollInterval.current) {
            clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
          if (requestTimeout.current) {
            clearTimeout(requestTimeout.current);
            requestTimeout.current = null;
          }
          return;
        }
        setLatestTrip(latest);
        setSubmitting(false);
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        }
        if (requestTimeout.current) {
          clearTimeout(requestTimeout.current);
          requestTimeout.current = null;
        }
      }
    } catch (error) {
      console.error('Failed to poll trip:', error);
      setSubmitting(false);
      setError('Erreur de connexion. Veuillez réessayer.');
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
        pollInterval.current = null;
      }
      if (requestTimeout.current) {
        clearTimeout(requestTimeout.current);
        requestTimeout.current = null;
      }
    }
  };

  const sendToBackend = async (text: string) => {
    if (!text.trim()) return;
    
    setSubmitting(true);
    setLatestTrip(null);
    setError(null);
    try {
      await api.post('/voice-requests', {
        raw_transcript: text,
        language_code: 'fr-FR',
      });
      console.log('Voice request sent');
      setTranscript('');
      finalTranscript.current = '';
      
      if (pollInterval.current) clearInterval(pollInterval.current);
      if (requestTimeout.current) clearTimeout(requestTimeout.current);
      
      pollInterval.current = setInterval(pollForTrip, 2000);
      // @ts-ignore
      requestTimeout.current = setTimeout(() => {
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
          pollInterval.current = null;
        }
        if (requestTimeout.current) {
          requestTimeout.current = null;
        }
        setSubmitting(false);
        setError('La recherche prend plus de temps que prévu. Veuillez réessayer.');
      }, 30000);
    } catch (error) {
      console.error('Failed to send voice request:', error);
      setSubmitting(false);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const cancelRequest = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
    if (requestTimeout.current) {
      clearTimeout(requestTimeout.current);
      requestTimeout.current = null;
    }
    setSubmitting(false);
    setTranscript('');
    finalTranscript.current = '';
  };

  const resetSilenceTimer = () => {
    if (silenceTimeout.current) clearTimeout(silenceTimeout.current);
    // @ts-ignore
    silenceTimeout.current = setTimeout(() => {
      const text = finalTranscript.current;
      ExpoSpeechRecognitionModule.stop();
      setRecognizing(false);
      sendToBackend(text);
    }, 2000);
  };

  const startRecognition = async () => {
    if (recognizing || submitting) return;

    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) return;

    setTranscript('');
    setError(null);
    finalTranscript.current = '';

    try {
      await ExpoSpeechRecognitionModule.start({
        lang: 'fr-FR',
        interimResults: true,
        continuous: true,
      });
    } catch {
      setError('Impossible de démarrer la reconnaissance vocale.');
      stopRecognition();
    }
  };

  const stopRecognition = () => {
    ExpoSpeechRecognitionModule.stop();
    setRecognizing(false);

    if (silenceTimeout.current) clearTimeout(silenceTimeout.current);
  };

  useSpeechRecognitionEvent('start', () => setRecognizing(true));
  useSpeechRecognitionEvent('end', () => setRecognizing(false));
  useSpeechRecognitionEvent('error', () => {
    setError('Erreur de reconnaissance vocale.');
    stopRecognition();
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    setTranscript(text);
    finalTranscript.current = text;

    if (text.trim().length > 0) resetSilenceTimer();
  });

  return (
    <VoiceContext.Provider
      value={{
        recognizing,
        transcript,
        startRecognition,
        stopRecognition,
        submitting,
        latestTrip,
        error,
        cancelRequest,
      }}>
      {children}
    </VoiceContext.Provider>
  );
};
