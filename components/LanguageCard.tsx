import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface LanguageCardProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function LanguageCard({ label, isSelected, onPress }: LanguageCardProps) {
  const scale = useSharedValue(1);
  const borderOpacity = useSharedValue(0);
  const radioScale = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(0.95, { damping: 12 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      borderOpacity.value = withTiming(1, { duration: 300 });
      radioScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    } else {
      borderOpacity.value = withTiming(0, { duration: 200 });
      radioScale.value = withTiming(0, { duration: 200 });
    }
  }, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isSelected ? Colors.primaryLight : 'transparent',
  }));

  const radioInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: radioScale.value }],
  }));

  return (
    <Animated.View style={[styles.card, cardStyle, isSelected && styles.cardSelected]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <View style={styles.content}>
          <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
          {isSelected && <SoundWave />}
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && (
              <Animated.View style={[styles.radioInner, radioInnerStyle]} />
            )}
          </View>
        </View>
        {/* Decorative dotted line */}
        <View style={styles.dottedLine}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={[styles.dot, isSelected && styles.dotActive]} />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function SoundWave() {
  const barHeights = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.4];

  return (
    <View style={styles.soundWave}>
      {barHeights.map((h, i) => (
        <SoundBar key={i} targetHeight={h} delay={i * 80} />
      ))}
    </View>
  );
}

function SoundBar({ targetHeight, delay }: { targetHeight: number; delay: number }) {
  const barScale = useSharedValue(0.3);

  useEffect(() => {
    barScale.value = withRepeat(
      withSequence(
        withTiming(targetHeight, { duration: 400 + Math.random() * 200 }),
        withTiming(0.3, { duration: 400 + Math.random() * 200 })
      ),
      -1,
      true
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: barScale.value }],
  }));

  return <Animated.View style={[styles.soundBar, barStyle]} />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  touchable: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  labelSelected: {
    color: Colors.primaryLight,
    fontWeight: '700',
  },
  soundWave: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 2,
    marginRight: 8,
  },
  soundBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: Colors.primaryLight,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#AAAAAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primaryLight,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  dottedLine: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.4,
  },
});
