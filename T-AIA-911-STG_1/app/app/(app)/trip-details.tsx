import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MapPin, Navigation } from 'lucide-react-native';
import Svg, { Line, Circle } from 'react-native-svg';

export default function TripDetails() {
  const params = useLocalSearchParams();
  const option = JSON.parse(params.option as string);
  const departure = JSON.parse(params.departure as string);
  const destination = JSON.parse(params.destination as string);

  return (
    <>
      <Stack.Screen options={{ title: 'Détails de l\'itinéraire', headerBackTitle: 'Retour' }} />
      <ScrollView style={styles.container}>
        <View style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <Navigation size={20} color="#0088CE" />
            <Text style={styles.mapTitle}>Itinéraire</Text>
          </View>
          <Svg height="180" width="100%" style={styles.svg}>
            {option.stops.map((stop: any, i: number) => {
              const total = option.stops.length - 1;
              const x = (i / total) * 280 + 40;
              const y = 90 + Math.sin((i / total) * Math.PI) * 40;
              
              if (i < total) {
                const nextX = ((i + 1) / total) * 280 + 40;
                const nextY = 90 + Math.sin(((i + 1) / total) * Math.PI) * 40;
                return (
                  <Line
                    key={`line-${i}`}
                    x1={x}
                    y1={y}
                    x2={nextX}
                    y2={nextY}
                    stroke="#0088CE"
                    strokeWidth="4"
                  />
                );
              }
              return null;
            })}
            {option.stops.map((stop: any, i: number) => {
              const total = option.stops.length - 1;
              const x = (i / total) * 280 + 40;
              const y = 90 + Math.sin((i / total) * Math.PI) * 40;
              const isEndpoint = i === 0 || i === total;
              
              return (
                <Circle
                  key={`circle-${i}`}
                  cx={x}
                  cy={y}
                  r={isEndpoint ? 8 : 6}
                  fill={isEndpoint ? '#0088CE' : '#5AADDB'}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
            })}
          </Svg>
        </View>

        <View style={styles.header}>
          <Text style={styles.duration}>{option.duration.human}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{option.counts.transfers} corresp.</Text>
          </View>
        </View>

        <View style={styles.route}>
          <View style={styles.routeLine}>
            <View style={styles.dotStart} />
            <View style={styles.line} />
            <View style={styles.dotEnd} />
          </View>
          
          <View style={styles.locations}>
            <Text style={styles.locationName}>{departure.name}</Text>
            <Text style={styles.locationName}>{destination.name}</Text>
          </View>
        </View>

        <View style={styles.stopsContainer}>
          <Text style={styles.stopsLabel}>Tous les arrêts ({option.stops.length})</Text>
          {option.stops.map((stop: any, i: number) => (
            <View key={i} style={styles.stop}>
              <MapPin size={14} color="#0088CE" />
              <Text style={styles.stopName}>{stop.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 24,
    paddingTop: 8,
  },
  mapContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0088CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0088CE',
  },
  svg: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  duration: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0088CE',
  },
  badge: {
    backgroundColor: '#E6F4FB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0088CE',
  },
  route: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  routeLine: {
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  dotStart: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0088CE',
  },
  line: {
    width: 3,
    flex: 1,
    backgroundColor: '#B3DDF2',
    marginVertical: 8,
  },
  dotEnd: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0088CE',
  },
  locations: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D1B3D',
  },
  stopsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
  },
  stopsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0088CE',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBF4',
  },
  stopName: {
    fontSize: 15,
    color: '#2D1B3D',
  },
});
