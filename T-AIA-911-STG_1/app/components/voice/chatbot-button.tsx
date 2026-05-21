import * as React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useVoice } from '@/hooks/use-voice';
import { Bot, Sparkles } from 'lucide-react-native';

export const ChatbotButton: React.FC = () => {
  const { recognizing, startRecognition, stopRecognition, submitting } = useVoice();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const [waves] = React.useState(() => 
    Array.from({ length: 3 }, () => new Animated.Value(0))
  );

  React.useEffect(() => {
    if (recognizing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      waves.forEach((wave, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 400),
            Animated.timing(wave, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(wave, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      pulseAnim.setValue(1);
      waves.forEach(w => w.setValue(0));
    }
  }, [recognizing]);

  const handlePress = () => {
    if (submitting) return;
    
    if (recognizing) {
      stopRecognition();
    } else {
      startRecognition();
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  return (
    <Pressable onPress={handlePress} disabled={submitting}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
        {recognizing && waves.map((wave, i) => {
          const scale = wave.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          });
          const opacity = wave.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 0.3, 0],
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.wave,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
        <View style={styles.content}>
          <Animated.View style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] },
            recognizing && styles.iconContainerActive
          ]}>
            {recognizing ? (
              <Sparkles color="#fff" size={28} strokeWidth={2.5} />
            ) : (
              <Bot color="#0088CE" size={28} strokeWidth={2} />
            )}
          </Animated.View>
          <Text style={styles.text}>
            {recognizing ? 'Écoute en cours...' : 'Posez-moi une question'}
          </Text>
        </View>
        {recognizing && (
          <View style={styles.indicator}>
            <View style={styles.dot} />
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#0088CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#E6F4FB',
    position: 'relative',
    overflow: 'visible',
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0088CE',
    top: 0,
    left: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: '#0088CE',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D1B3D',
  },
  indicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E6F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0088CE',
  },
});
