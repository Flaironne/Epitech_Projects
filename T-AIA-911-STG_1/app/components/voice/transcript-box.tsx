import * as React from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { useVoice } from '@/hooks/use-voice';
import { Bot, Loader2, Sparkles, AlertCircle, X } from 'lucide-react-native';

export const TranscriptBox: React.FC = () => {
  const { transcript, submitting, recognizing, error, cancelRequest } = useVoice();
  const spinAnim = React.useRef(new Animated.Value(0)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const shakeAnim = React.useRef(new Animated.Value(0)).current;
  const [particles] = React.useState(() => 
    Array.from({ length: 6 }, () => ({
      anim: new Animated.Value(0),
      x: Math.random() * 60 - 30,
      y: Math.random() * 60 - 30,
    }))
  );
  const [showExtra, setShowExtra] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [error]);

  React.useEffect(() => {
    if (submitting) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();

      particles.forEach((particle, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.anim, {
              toValue: 1,
              duration: 2000 + i * 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.anim, {
              toValue: 0,
              duration: 2000 + i * 200,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      const timer = setTimeout(() => setShowExtra(true), 3000);
      return () => {
        clearTimeout(timer);
        spinAnim.setValue(0);
        glowAnim.setValue(0);
        particles.forEach(p => p.anim.setValue(0));
        setShowExtra(false);
      };
    } else {
      spinAnim.setValue(0);
      glowAnim.setValue(0);
      particles.forEach(p => p.anim.setValue(0));
      setShowExtra(false);
    }
  }, [submitting]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E6F4FB', '#0088CE'],
  });

  return (
    <Animated.View style={[styles.container, error && styles.containerError, { transform: [{ translateX: shakeAnim }] }]}>
      {submitting && (
        <View style={StyleSheet.absoluteFill}>
          {particles.map((particle, i) => {
            const translateY = particle.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, particle.y],
            });
            const translateX = particle.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, particle.x],
            });
            const opacity = particle.anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    transform: [{ translateX }, { translateY }],
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
      <Animated.View style={[
        styles.iconContainer,
        submitting && { backgroundColor: glowColor },
        error && styles.iconContainerError
      ]}>
        {error ? (
          <AlertCircle color="#fff" size={24} strokeWidth={2.5} />
        ) : submitting ? (
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Loader2 color="#fff" size={24} strokeWidth={2.5} />
          </Animated.View>
        ) : (
          <Bot color="#0088CE" size={24} strokeWidth={2} />
        )}
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={[
          styles.text,
          (transcript || submitting || error) && styles.textActive,
          error && styles.textError
        ]}>
          {error
            ? error
            : submitting 
            ? showExtra 
              ? 'Recherche du meilleur itinéraire...'
              : 'Analyse en cours...'
            : transcript 
            ? transcript 
            : 'Posez votre question pour trouver votre itinéraire...'}
        </Text>
        {submitting && showExtra && !error && (
          <View style={styles.extraInfo}>
            <Sparkles color="#0088CE" size={14} />
            <Text style={styles.extraText}>Optimisation en cours</Text>
          </View>
        )}
      </View>
      {submitting && (
        <Pressable onPress={cancelRequest} style={styles.cancelButton}>
          <X color="#FF6B6B" size={20} strokeWidth={2.5} />
        </Pressable>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    minHeight: 100,
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#0088CE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E6F4FB',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    overflow: 'hidden',
  },
  containerError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F4FB',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainerError: {
    backgroundColor: '#FF6B6B',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#7A7A7A',
    fontWeight: '400',
  },
  textActive: {
    color: '#2D1B3D',
    fontWeight: '500',
  },
  textError: {
    color: '#FF6B6B',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0088CE',
    left: 40,
    top: 40,
  },
  extraInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  extraText: {
    fontSize: 13,
    color: '#0088CE',
    fontWeight: '500',
  },
  cancelButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
});
