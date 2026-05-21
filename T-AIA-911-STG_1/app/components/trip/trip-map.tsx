import React from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable } from 'react-native';
import { MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import type { TripRequest } from '@/types/trip';

type Props = {
  tripRequest: TripRequest;
};

export const TripMap: React.FC<Props> = ({ tripRequest }) => {
  const { departure, destination, options } = tripRequest.pathfinder;
  const router = useRouter();

  if (!departure || !destination || options.length === 0) {
    return null;
  }

  const handlePress = (option: any) => {
    router.push({
      pathname: '/(app)/trip-details',
      params: {
        option: JSON.stringify(option),
        departure: JSON.stringify(departure),
        destination: JSON.stringify(destination),
      },
    });
  };

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{options.length} itinéraire{options.length > 1 ? 's' : ''} disponible{options.length > 1 ? 's' : ''}</Text>
      {options.map((option, idx) => (
        <Pressable key={idx} onPress={() => handlePress(option)}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.duration}>{option.duration.human}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{option.counts.transfers} corresp.</Text>
                </View>
                <ChevronRight size={20} color="#0088CE" />
              </View>
            </View>
            
            <View style={styles.route}>
              <View style={styles.routeLine}>
                <View style={styles.dotStart} />
                <View style={styles.line} />
                <View style={styles.dotEnd} />
              </View>
              
              <View style={styles.locations}>
                <View style={styles.location}>
                  <Text style={styles.locationName}>{departure.name}</Text>
                </View>
                
                <View style={styles.location}>
                  <Text style={styles.locationName}>{destination.name}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.stopsContainer}>
              <Text style={styles.stopsLabel}>Arrêts principaux</Text>
              <View style={styles.stops}>
                {option.stops.slice(0, 3).map((stop: any, i: number) => (
                  <View key={i} style={styles.stop}>
                    <MapPin size={12} color="#0088CE" />
                    <Text style={styles.stopName}>{stop.name}</Text>
                  </View>
                ))}
                {option.stops.length > 3 && (
                  <Text style={styles.moreStops}>+{option.stops.length - 3} arrêts</Text>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B3D',
    marginBottom: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#0088CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  duration: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0088CE',
  },
  badge: {
    backgroundColor: '#E6F4FB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0088CE',
  },
  route: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  routeLine: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  dotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0088CE',
  },
  line: {
    width: 3,
    flex: 1,
    backgroundColor: '#B3DDF2',
    marginVertical: 4,
  },
  dotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0088CE',
  },
  locations: {
    flex: 1,
    justifyContent: 'space-between',
  },
  location: {
    paddingVertical: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B3D',
  },
  stopsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0EBF4',
    paddingTop: 16,
  },
  stopsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0088CE',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stops: {
    gap: 8,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopName: {
    fontSize: 14,
    color: '#004C97',
  },
  moreStops: {
    fontSize: 12,
    color: '#5AADDB',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
