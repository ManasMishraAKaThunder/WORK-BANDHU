import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'orange' | 'blue' | 'disabled';
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GradientButton({
  title,
  onPress,
  disabled = false,
  variant = 'orange',
  style,
  textStyle,
  loading = false,
}: GradientButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const gradientColors = disabled
    ? ['#D0D0D0', '#C0C0C0'] as const
    : variant === 'orange'
    ? ['#FF8A00', '#FF6B00'] as const
    : ['#0B4DA2', '#083A7A'] as const;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={gradientColors as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <Text
            style={[
              styles.text,
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  text: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  textDisabled: {
    color: '#888888',
  },
});
