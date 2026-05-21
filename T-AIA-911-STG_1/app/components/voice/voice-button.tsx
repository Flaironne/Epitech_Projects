import * as React from 'react';
import { View, Animated, StyleSheet, Pressable } from 'react-native';
import { useVoice } from '@/hooks/use-voice';
import { Bot, Sparkles, Loader2 } from 'lucide-react-native';

export const VoiceButton: React.FC = () => {
  const { recognizing, startRecognition, stopRecognition, submitting } = useVoice();

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const spinAnim = React.useRef(new Animated.Value(0)).current;
  const [waves] = React.useState(() => 
    Array.from({ length: 3 }, () => new Animated.Value(0))
  );

  React.useEffect(() => {
    if (recognizing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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

  React.useEffect(() => {
    if (submitting) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.setValue(0);
    }
  }, [submitting]);

  const handlePressIn = () => {
    if (submitting) return;
    startRecognition();
    Animated.spring(scaleAnim, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    stopRecognition();
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrapper}>
      {recognizing && waves.map((wave, i) => {
        const scale = wave.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2.5],
        });
        const opacity = wave.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.4, 0.2, 0],
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
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={submitting}
          style={[styles.button, (recognizing || submitting) && styles.buttonActive]}>
          <Animated.View style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            {submitting ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Loader2 color="#fff" size={36} strokeWidth={2.5} />
              </Animated.View>
            ) : recognizing ? (
              <Sparkles color="#fff" size={36} strokeWidth={2.5} />
            ) : (
              <Bot color="#fff" size={36} strokeWidth={2} />
            )}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#0088CE',
  },
  buttonContainer: {
    shadowColor: '#0088CE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0088CE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E6F4FB',
  },
  buttonActive: {
    backgroundColor: '#005A9C',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
