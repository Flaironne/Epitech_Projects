import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { ArrowRight, Clock, MapPin } from 'lucide-react-native';
import type { VoiceNavigationResponse } from '@/types/voice';

type Props = {
  analysis: VoiceNavigationResponse;
  onPress: () => void;
};

export function VoiceAnalysisItem({ analysis, onPress }: Props) {
  const { analysis: routeAnalysis, route } = analysis;

  if (!route || !routeAnalysis) {
    return null;
  }

  return (
    <Pressable onPress={onPress}>
      <View className="rounded-2xl bg-white p-5" style={{
        shadowColor: '#0088CE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <MapPin size={16} color="#0088CE" />
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#2D1B3D', marginLeft: 8, flex: 1 }}>
            {routeAnalysis.departure.label}
          </Text>
          <ArrowRight size={16} color="#5AADDB" />
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#2D1B3D', marginLeft: 8, flex: 1 }}>
            {routeAnalysis.destination.label}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={14} color="#0088CE" />
            <Text style={{ fontSize: 13, color: '#004C97', marginLeft: 6 }}>
              {route.totalDuration.formatted}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#5AADDB' }}>
            {route.distance.value} km
          </Text>
          <Text style={{ fontSize: 12, color: '#5AADDB' }}>
            Arrivée {route.estimatedArrivalTime.formatted}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
