import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import FastImageBackground from '@/components/FastImageBackground';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/Colors';
import GradientButton from '@/components/GradientButton';

const { width, height } = Dimensions.get('window');

// Animated dot indicator
function DotIndicators({ active }: { active: number }) {
  return (
    <View style={styles.dotsRow}>
      {[0, 1, 2].map((i) => (
        <AnimatedDot key={i} isActive={i === active} />
      ))}
    </View>
  );
}

function AnimatedDot({ isActive }: { isActive: boolean }) {
  const dotWidth = useSharedValue(isActive ? 20 : 8);

  useEffect(() => {
    dotWidth.value = withTiming(isActive ? 20 : 8, { duration: 300 });
  }, [isActive]);

  const dotStyle = useAnimatedStyle(() => ({
    width: dotWidth.value,
    backgroundColor: isActive ? Colors.white : 'rgba(255,255,255,0.4)',
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

export default function LandingScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.mainArea}>
        {/* Full-screen background image of Indian woman using laptop */}
        <FastImageBackground
          source={require('@/assets/images/landing-bg.png')}
          style={styles.backgroundImage}
        >
          {/* Dark gradient overlay at bottom */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.4, 0.7, 1]}
            style={styles.overlay}
          >
            {/* Logo card — top left */}
            <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.logoCard}>
              <View style={styles.logoOrangeBadge}>
                <Text style={styles.logoWork}>work</Text>
              </View>
              <Text style={styles.logoBandhu}>bandhu</Text>
            </Animated.View>

            {/* Bottom content */}
            <View style={styles.bottomContent}>
              {/* Main text */}
              <Animated.Text entering={FadeInUp.delay(400).duration(600)} style={styles.mainTitle}>
                {t('workAndEarn')}
              </Animated.Text>
              <Animated.Text entering={FadeInUp.delay(600).duration(600)} style={styles.subtitle}>
                {t('upToSalary')}
              </Animated.Text>

              {/* Start Earning button */}
              <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.ctaWrapper}>
                <GradientButton
                  title={t('startEarning')}
                  onPress={() => router.push('/login?role=worker')}
                  variant="orange"
                  textStyle={{ color: Colors.white, fontSize: 17 }}
                />
              </Animated.View>

              {/* Dot indicators */}
              <Animated.View entering={FadeIn.delay(1000)}>
                <DotIndicators active={0} />
              </Animated.View>
            </View>
          </LinearGradient>
        </FastImageBackground>
      </View>

      {/* Manager card at bottom */}
      <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.managerSection}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push('/login?role=manager')}
          style={styles.managerCard}
        >
          <View style={styles.managerLeft}>
            <Text style={styles.managerLabel}>Manager?</Text>
            <Text style={styles.managerPostJob}>Post Job</Text>
            <Ionicons name="arrow-forward" size={20} color={Colors.primary} style={{ marginTop: 4 }} />
          </View>
          <View style={styles.managerImageWrapper}>
            <Image
              source={require('@/assets/images/manager-workers.png')}
              style={styles.managerImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              priority="high"
              transition={0}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  mainArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },

  // Logo
  logoCard: {
    width: 80,
    height: 72,
    borderRadius: 14,
    backgroundColor: Colors.white,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  logoOrangeBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 2,
  },
  logoWork: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  logoBandhu: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  // Bottom content
  bottomContent: {
    alignItems: 'flex-start',
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginBottom: 24,
  },
  ctaWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Manager card
  managerSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.lightGray,
  },
  managerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.primary + '25',
    ...Shadows.medium,
    height: 110,
  },
  managerLeft: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  managerLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  managerPostJob: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  managerImageWrapper: {
    width: 160,
    overflow: 'hidden',
  },
  managerImage: {
    width: '100%',
    height: '100%',
  },
});
