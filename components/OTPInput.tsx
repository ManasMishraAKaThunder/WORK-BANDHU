import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

export default function OTPInput({ length = 6, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleChange = useCallback((text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(d => d !== '')) {
      Keyboard.dismiss();
      onComplete(newOtp.join(''));
    }
  }, [otp, length, onComplete]);

  const handleKeyPress = useCallback((e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <OTPBox
          key={index}
          value={otp[index]}
          isFocused={false}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          inputRef={(ref) => { inputRefs.current[index] = ref; }}
        />
      ))}
    </View>
  );
}

interface OTPBoxProps {
  value: string;
  isFocused: boolean;
  onChangeText: (text: string) => void;
  onKeyPress: (e: any) => void;
  inputRef: (ref: TextInput | null) => void;
}

function OTPBox({ value, onChangeText, onKeyPress, inputRef }: OTPBoxProps) {
  const scale = useSharedValue(1);
  const borderColor = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: borderColor.value === 1 ? Colors.accent : Colors.border,
  }));

  const handleFocus = () => {
    scale.value = withSpring(1.08, { damping: 12 });
    borderColor.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    scale.value = withSpring(1, { damping: 12 });
    borderColor.value = withTiming(0, { duration: 200 });
  };

  return (
    <Animated.View style={[styles.box, animatedStyle, value ? styles.boxFilled : null]}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        keyboardType="number-pad"
        maxLength={1}
        style={styles.input}
        selectionColor={Colors.primary}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F5FF',
  },
  input: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
});
