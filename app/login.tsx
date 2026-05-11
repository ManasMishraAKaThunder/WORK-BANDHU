import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImageBackground from '@/components/FastImageBackground';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import GradientButton from '@/components/GradientButton';
import * as Haptics from 'expo-haptics';
import { sendOTP } from '@/services/twilioOtpService';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { setPhoneNumber, setUserRole } = useApp();
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();
  const { t } = useTranslation();
  const userRole = role === 'manager' ? 'manager' : 'worker';

  const isValid = phone.length === 10;

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
      if (error) setError('');
    }
  };

  const handleContinue = async () => {
    if (!isValid) {
      setError('Please enter a valid 10-digit mobile number');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsSending(true);
    setError('');

    try {
      // Send OTP via Twilio Verify API
      const result = await sendOTP(phone);

      if (result.success) {
        await setPhoneNumber(phone);
        await setUserRole(userRole);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/otp?role=${userRole}`);
      } else {
        setError(result.message);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
          {/* Top image section — Indian women workers */}
          <View style={styles.topSection}>
            <FastImageBackground
              source={require('@/assets/images/login-workers.png')}
              style={styles.topImage}
            >
              {/* Logo overlay — top left */}
              <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.logoCard}>
                <View style={styles.logoOrangeBadge}>
                  <Text style={styles.logoWork}>work</Text>
                </View>
                <Text style={styles.logoBandhu}>bandhu</Text>
              </Animated.View>

              {/* Bottom fade to white */}
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.5)', Colors.white]}
                locations={[0.3, 0.7, 1]}
                style={styles.topFade}
              />
            </FastImageBackground>
          </View>

          {/* Form section */}
          <View style={styles.formSection}>
            <Animated.View entering={FadeInUp.delay(300).duration(500)}>
              <Text style={styles.title}>
                <Text style={styles.titleBlue}>{t('enterYour')} </Text>
                <Text style={styles.titleOrange}>{t('mobileNumber')}</Text>
              </Text>
              <Text style={styles.subtitle}>{t('otpSubtitle')}</Text>
            </Animated.View>

            {/* Phone input — large +91 with orange divider */}
            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.phoneRow}>
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.orangeDivider} />
              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder=""
                keyboardType="number-pad"
                maxLength={10}
                style={styles.phoneInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={Colors.accent}
              />
            </Animated.View>

            {/* Underline */}
            <View style={[styles.inputLine, isFocused && styles.inputLineFocused]} />

            {error ? (
              <Animated.Text entering={FadeIn} style={styles.errorText}>
                {error}
              </Animated.Text>
            ) : null}

            {/* Continue button */}
            <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.btnWrapper}>
              <GradientButton
                title={isSending ? 'Sending OTP...' : t('continue')}
                onPress={handleContinue}
                disabled={!isValid || isSending}
                variant={isValid && !isSending ? 'blue' : 'disabled'}
                loading={isSending}
                textStyle={{ color: Colors.white }}
              />
            </Animated.View>

            {/* Terms */}
            <Animated.View entering={FadeInDown.delay(900).duration(400)} style={styles.termsSection}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>{t('termsConditions')}</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>{t('privacyPolicy')}</Text>.
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Top image section ──
  topSection: {
    height: height * 0.42,
    overflow: 'hidden',
  },
  topImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  logoCard: {
    width: 76,
    height: 68,
    borderRadius: 12,
    backgroundColor: Colors.white,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
    marginTop: 16,
    marginLeft: 16,
  },
  logoOrangeBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 1,
    marginBottom: 1,
  },
  logoWork: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.white,
  },
  logoBandhu: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary,
  },
  topFade: {
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // ── Form section ──
  formSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    lineHeight: 38,
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
    marginBottom: 32,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 16,
  },
  orangeDivider: {
    width: 2,
    height: 36,
    backgroundColor: Colors.accent,
    marginRight: 16,
    borderRadius: 1,
  },
  phoneInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 2,
    paddingVertical: 4,
  },
  inputLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 8,
    marginBottom: 8,
  },
  inputLineFocused: {
    backgroundColor: Colors.primary,
    height: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 2,
  },
  btnWrapper: {
    marginTop: 28,
  },
  termsSection: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
