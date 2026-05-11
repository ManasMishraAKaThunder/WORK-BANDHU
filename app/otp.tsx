import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import OTPInput from '@/components/OTPInput';
import GradientButton from '@/components/GradientButton';
import * as Haptics from 'expo-haptics';
import { verifyOTP, resendOTP } from '@/services/twilioOtpService';

const RESEND_COOLDOWN = 30;

export default function OTPScreen() {
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const { phoneNumber, setIsLoggedIn, setOnboardingComplete } = useApp();
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { t } = useTranslation();
  const isManager = role === 'manager';

  // Shake animation for error feedback
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const displayPhone = phoneNumber
    ? `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
    : '+91 XXXXXXXXXX';

  const handleOTPComplete = useCallback(async (code: string) => {
    setOtpCode(code);
    setIsVerifying(true);
    setError('');

    try {
      // Verify OTP via Twilio Verify API
      const result = await verifyOTP(phoneNumber, code);

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Small delay for success feel
        setTimeout(async () => {
          await setIsLoggedIn(true);
          setIsVerifying(false);
          if (isManager) {
            await setOnboardingComplete(true);
            router.replace('/(tabs)');
          } else {
            router.push('/skills');
          }
        }, 600);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError(result.message);
        setIsVerifying(false);
        triggerShake();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setIsVerifying(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerShake();
    }
  }, [phoneNumber, isManager]);

  const handleVerifyButton = () => {
    if (otpCode.length === 6) {
      handleOTPComplete(otpCode);
    } else {
      setError('Please enter the complete 6-digit OTP');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerShake();
    }
  };

  const handleResend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsResending(true);
    setError('');

    try {
      const result = await resendOTP(phoneNumber);
      if (result.success) {
        setTimer(RESEND_COOLDOWN);
        setCanResend(false);
        setOtpCode('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      {/* Separator line */}
      <View style={styles.headerLine} />

      {/* Chat bubble verification icon — blue/orange */}
      <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.iconContainer}>
        <View style={styles.chatBubbleIcon}>
          <View style={styles.chatBubbleDots}>
            <View style={[styles.chatDot, { backgroundColor: Colors.accent }]} />
            <View style={[styles.chatDot, { backgroundColor: Colors.accent }]} />
            <View style={[styles.chatDot, { backgroundColor: Colors.accent }]} />
          </View>
          {/* Bubble tail */}
          <View style={styles.chatTail} />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.titleSection}>
        <Text style={styles.title}>
          <Text style={styles.titleBlue}>Enter </Text>
          <Text style={styles.titleOrange}>verification code</Text>
        </Text>
        <Text style={styles.subtitle}>
          A 6-digit verification code has been sent{'\n'}on{' '}
          <Text style={styles.phoneText}>{displayPhone}</Text>
        </Text>
      </Animated.View>

      {/* OTP Input with shake animation */}
      <Animated.View entering={FadeInUp.delay(500).duration(500)} style={[styles.otpSection, shakeStyle]}>
        <OTPInput length={6} onComplete={handleOTPComplete} />
      </Animated.View>

      {/* Error message */}
      {error ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      ) : null}

      {/* Dashed separator line */}
      <View style={styles.dashedLine}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>

      {/* Timer with clock icon / Resend */}
      <Animated.View entering={FadeIn.delay(700)} style={styles.timerSection}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text style={[styles.resendText, isResending && styles.resendDisabled]}>
              {isResending ? 'Sending...' : t('resendOtp')}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={20} color={Colors.accent} />
            <Text style={styles.timerText}>
              {' '}0:{timer.toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Verify button */}
      <View style={styles.bottomSpacer} />
      <Animated.View entering={FadeInUp.delay(800).duration(500)} style={styles.btnWrapper}>
        <GradientButton
          title={t('verify')}
          onPress={handleVerifyButton}
          variant="blue"
          loading={isVerifying}
          textStyle={{ color: Colors.white }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  headerLine: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 20,
  },

  // ── Chat bubble icon ──
  iconContainer: {
    marginBottom: 20,
  },
  chatBubbleIcon: {
    width: 52,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  chatBubbleDots: {
    flexDirection: 'row',
    gap: 4,
  },
  chatDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chatTail: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
  },

  // ── Title ──
  titleSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  titleBlue: {
    color: Colors.primary,
  },
  titleOrange: {
    color: Colors.accent,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  phoneText: {
    fontWeight: '700',
    color: Colors.primary,
  },

  // ── OTP ──
  otpSection: {
    marginBottom: 12,
  },

  // ── Error ──
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Dashed line ──
  dashedLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  dash: {
    width: 6,
    height: 1.5,
    backgroundColor: '#C0C0C0',
    borderRadius: 1,
  },

  // ── Timer ──
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.accent,
  },
  resendText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: Colors.textMuted,
  },

  bottomSpacer: {
    flex: 1,
  },
  btnWrapper: {
    marginBottom: 32,
  },
});
