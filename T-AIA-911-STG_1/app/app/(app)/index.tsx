import { View, Image } from 'react-native';
import { VoiceProvider } from '@/contexts/voice-context';
import { VoiceButton } from '@/components/voice/voice-button';
import { TranscriptBox } from '@/components/voice/transcript-box';
import { Text } from '@/components/ui/text';
import { TripMap } from '@/components/trip/trip-map';
import { useVoice } from '@/hooks/use-voice';

function IndexContent() {
  const { latestTrip } = useVoice();

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 24, paddingTop: 100 }}>
      <TranscriptBox />

      {latestTrip && <TripMap tripRequest={latestTrip} />}

      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
        <VoiceButton />
      </View>
    </View>
  );
}

export default function Index() {
  return (
    <VoiceProvider>
      <IndexContent />
    </VoiceProvider>
  );
}
