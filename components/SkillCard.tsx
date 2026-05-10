import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import FastImageBackground from '@/components/FastImageBackground';
import { ImageSource } from 'expo-image';

interface SkillCardProps {
  label: string;
  hindiLabel: string;
  image: ImageSource;
  isSelected: boolean;
  selectionIndex?: number; // 1-based index for multi-select badge
  onPress: () => void;
}

export default function SkillCard({ label, hindiLabel, image, isSelected, selectionIndex, onPress }: SkillCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.93, { damping: 12 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.card,
          isSelected && styles.cardSelected,
        ]}
      >
        <FastImageBackground
          source={image}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          {/* Gradient overlay for text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.55)']}
            style={styles.gradientOverlay}
          />

          {/* Text content at bottom-left */}
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.hindiLabel}>({hindiLabel})</Text>
          </View>

          {/* Selection badge — numbered for multi-select */}
          {isSelected && (
            <View style={styles.checkBadge}>
              {selectionIndex != null ? (
                <Text style={styles.badgeNumber}>{selectionIndex}</Text>
              ) : (
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              )}
            </View>
          )}
        </FastImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    height: 150,
    borderWidth: 3,
    borderColor: 'transparent',
    ...Shadows.medium,
  },
  cardSelected: {
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  imageStyle: {
    borderRadius: 11,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 11,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  hindiLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  badgeNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
});
