import { useContext } from 'react';
import { VoiceContext, type VoiceContextType } from '@/contexts/voice-context';

export const useVoice = (): VoiceContextType => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
