import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import type { VoiceNavigationResponse } from '@/types/voice';
import { VoiceAnalysisItem } from './voice-analysis-item';

type Props = {
  analyses: VoiceNavigationResponse[];
};

export function VoiceAnalysisList({ analyses }: Props) {
  const router = useRouter();

  if (analyses.length === 0) return null;

  return (
    <View className="mt-6 gap-3">
      {analyses.map((item) => (
        <VoiceAnalysisItem
          key={item.requestId}
          analysis={item}
          onPress={() =>
            // router.push({
            //   pathname: '/analysis/[id]',
            //   params: { id: item.requestId },
            // })
            {}
          }
        />
      ))}
    </View>
  );
}
