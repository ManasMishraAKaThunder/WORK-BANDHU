import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  withSpring,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { LANGUAGES } from '@/constants/Languages';
import { useApp } from '@/context/AppContext';
import LanguageCard from '@/components/LanguageCard';
import GradientButton from '@/components/GradientButton';

const { width, height } = Dimensions.get('window');

// Re-order languages to match reference: मराठी, English, हिन्दी, മലയാളം, ಕನ್ನಡ, తెలుగు
const ORDERED_LANGUAGES = [
  LANGUAGES.find(l => l.id === 'marathi')!,
  LANGUAGES.find(l => l.id === 'english')!,
  LANGUAGES.find(l => l.id === 'hindi')!,
  LANGUAGES.find(l => l.id === 'malayalam')!,
  LANGUAGES.find(l => l.id === 'kannada')!,
  LANGUAGES.find(l => l.id === 'telugu')!,
];

// Floating particle component
function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  const translateY = useSharedValue(height * 0.45);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(height * 0.05, { duration: 4000 + Math.random() * 2000 }),
          withTiming(height * 0.45, { duration: 0 })
        ),
        -1
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1500 }),
          withTiming(0, { duration: 2500 })
        ),
        -1
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255,255,255,0.15)',
        },
        style,
      ]}
    />
  );
}

// Translation icon bubbles — "A" and "आ" speech bubbles (shown when no language selected)
function TranslationBubbles() {
  const scaleA = useSharedValue(0.85);
  const scaleHi = useSharedValue(0.85);
  const opacityA = useSharedValue(0);
  const opacityHi = useSharedValue(0);

  useEffect(() => {
    opacityA.value = withDelay(200, withTiming(1, { duration: 600 }));
    opacityHi.value = withDelay(400, withTiming(1, { duration: 600 }));
    scaleA.value = withDelay(200, withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2500 }),
        withTiming(0.9, { duration: 2500 })
      ), -1, true
    ));
    scaleHi.value = withDelay(500, withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2800 }),
        withTiming(0.9, { duration: 2800 })
      ), -1, true
    ));
  }, []);

  const styleA = useAnimatedStyle(() => ({
    transform: [{ scale: scaleA.value }],
    opacity: opacityA.value,
  }));
  const styleHi = useAnimatedStyle(() => ({
    transform: [{ scale: scaleHi.value }],
    opacity: opacityHi.value,
  }));

  return (
    <View style={styles.bubblesContainer}>
      {/* Hindi "आ" bubble — left, behind */}
      <Animated.View style={[styles.bubbleCard, styles.bubbleHindi, styleHi]}>
        <Text style={styles.bubbleHindiText}>आ</Text>
      </Animated.View>
      {/* English "A" bubble — right, front */}
      <Animated.View style={[styles.bubbleCard, styles.bubbleEnglish, styleA]}>
        <Text style={styles.bubbleEnglishText}>A</Text>
      </Animated.View>
      {/* Sparkles */}
      <Text style={[styles.sparkle, { top: 20, left: 40 }]}>✦</Text>
      <Text style={[styles.sparkle, { bottom: 30, right: 50 }]}>✦</Text>
    </View>
  );
}

// Phone mockup — shown when a language is selected (image 2 reference)
function PhoneMockup({ language }: { language: string }) {
  const translateY = useSharedValue(60);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.88);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 90 });
    opacity.value = withTiming(1, { duration: 400 });
    scale.value = withSpring(1, { damping: 14, stiffness: 90 });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgLangLabel = LANGUAGES.find(l => l.id === language)?.label?.toUpperCase() || 'ENGLISH';

  return (
    <Animated.View style={[styles.mockupWrapper, animStyle]}>
      {/* Background faded language text */}
      <Text style={styles.bgLangText}>{bgLangLabel}</Text>

      {/* Phone frame */}
      <View style={styles.phoneFrame}>
        <View style={styles.phoneNotch} />
        <View style={styles.phoneScreen}>
          <Text style={styles.phoneHello}>Hello</Text>
          <Text style={styles.phoneWelcome}>Welcome to{'\n'}Work Bandhu</Text>
          <Text style={styles.phoneWave}>👋</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function LanguageSelectScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const { setSelectedLanguage, onboardingComplete, isLoading } = useApp();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Only redirect if state has finished loading from storage
    // AND onboarding is actually complete
    if (!isLoading && onboardingComplete) {
      router.replace('/(tabs)');
    }
  }, [onboardingComplete, isLoading]);

  const handleSelect = async (langId: string) => {
    Haptics.selectionAsync();
    setSelected(langId);
    await setSelectedLanguage(langId);
  };

  const handleConfirm = () => {
    if (selected) {
      router.push('/welcome');
    }
  };

  const particles = Array.from({ length: 10 }).map((_, i) => ({
    key: i,
    delay: i * 600,
    x: Math.random() * width,
    size: 3 + Math.random() * 5,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkBlue} />
      <LinearGradient
        colors={[Colors.darkBlue, Colors.darkBlueMid, '#061530']}
        style={styles.heroSection}
      >
        {/* Floating particles */}
        {particles.map((p) => (
          <FloatingParticle key={p.key} delay={p.delay} x={p.x} size={p.size} />
        ))}

        {/* Help button */}
        <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.helpButton}>
          <Text style={styles.helpIcon}>🎧</Text>
          <Text style={styles.helpText}>{t('help')}</Text>
        </Animated.View>

        {/* Show translation bubbles OR phone mockup */}
        {!selected ? (
          <TranslationBubbles />
        ) : (
          <PhoneMockup language={selected} />
        )}
      </LinearGradient>

      {/* Bottom white panel */}
      <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.bottomSheet}>
        <Text style={styles.title}>{t('selectAppLanguage')}</Text>

        <FlatList
          data={ORDERED_LANGUAGES}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <LanguageCard
              label={item.label}
              isSelected={selected === item.id}
              onPress={() => handleSelect(item.id)}
            />
          )}
        />

        <View style={styles.confirmWrapper}>
          <GradientButton
            title={t('confirm')}
            onPress={handleConfirm}
            disabled={!selected}
            variant={selected ? 'orange' : 'disabled'}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkBlue,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  helpButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 10,
  },
  helpIcon: { fontSize: 16 },
  helpText: { color: Colors.white, fontSize: 14, fontWeight: '600' },

  // ── Translation bubbles (initial) ──
  bubblesContainer: {
    width: 240,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bubbleCard: {
    position: 'absolute',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bubbleHindi: {
    left: 10,
    top: 55,
    width: 110,
    height: 105,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 1,
  },
  bubbleEnglish: {
    right: 10,
    top: 15,
    width: 100,
    height: 95,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 2,
  },
  bubbleHindiText: {
    fontSize: 54,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
  },
  bubbleEnglishText: {
    fontSize: 48,
    color: Colors.white,
    fontWeight: '700',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 15,
    color: 'rgba(255,255,255,0.45)',
    zIndex: 3,
  },

  // ── Phone mockup (selected) ──
  mockupWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bgLangText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.06)',
    letterSpacing: 6,
    top: -20,
  },
  phoneFrame: {
    width: 190,
    height: 200,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.7)',
    backgroundColor: '#EEF3FA',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  phoneNotch: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
    marginTop: 10,
  },
  phoneScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  phoneHello: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '400',
  },
  phoneWelcome: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 26,
  },
  phoneWave: {
    fontSize: 30,
    marginTop: 10,
  },

  // ── Bottom sheet ──
  bottomSheet: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    gap: 10,
    marginBottom: 10,
  },
  confirmWrapper: {
    marginTop: 6,
  },
});
