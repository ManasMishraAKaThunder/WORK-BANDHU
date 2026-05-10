import React, { useEffect } from 'react';
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
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { LANGUAGES } from '@/constants/Languages';
import { useApp } from '@/context/AppContext';
import LanguageCard from '@/components/LanguageCard';
import GradientButton from '@/components/GradientButton';
import * as Haptics from 'expo-haptics';

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

export default function WelcomeScreen() {
  const { selectedLanguage, setSelectedLanguage } = useApp();
  const router = useRouter();
  const { t } = useTranslation();

  // Waving hand animation
  const waveRotation = useSharedValue(0);
  useEffect(() => {
    waveRotation.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 300 }),
        withTiming(-15, { duration: 250 }),
        withTiming(15, { duration: 250 }),
        withTiming(-10, { duration: 250 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      false
    );
  }, []);

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveRotation.value}deg` }],
  }));

  const bgLangLabel = LANGUAGES.find(l => l.id === selectedLanguage)?.label?.toUpperCase() || 'ENGLISH';

  const handleLangSelect = async (langId: string) => {
    Haptics.selectionAsync();
    await setSelectedLanguage(langId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.darkBlue, Colors.darkBlueMid, '#061530']}
        style={styles.heroSection}
      >
        {/* Help button */}
        <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.helpButton}>
          <Text style={styles.helpIcon}>🎧</Text>
          <Text style={styles.helpText}>{t('help')}</Text>
        </Animated.View>

        {/* Background faded language text */}
        <Animated.Text
          entering={FadeIn.delay(200).duration(1000)}
          style={styles.bgLangText}
        >
          {bgLangLabel}
        </Animated.Text>

        {/* Phone mockup with welcome card */}
        <Animated.View entering={FadeInUp.delay(300).duration(700)} style={styles.phoneFrame}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneScreen}>
            <Text style={styles.phoneHello}>{t('hello')}</Text>
            <Text style={styles.phoneWelcome}>
              {t('welcomeTo')}{'\n'}{t('workBandhu')}
            </Text>
            <Animated.Text style={[styles.phoneWave, waveStyle]}>👋</Animated.Text>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Bottom white panel with language selector */}
      <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.bottomSheet}>
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
              isSelected={selectedLanguage === item.id}
              onPress={() => handleLangSelect(item.id)}
            />
          )}
        />

        <View style={styles.confirmWrapper}>
          <GradientButton
            title={t('confirm')}
            onPress={() => router.push('/landing')}
            variant="orange"
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
  bgLangText: {
    position: 'absolute',
    fontSize: 52,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.05)',
    letterSpacing: 8,
    top: height * 0.06,
  },

  // Phone mockup
  phoneFrame: {
    width: 200,
    height: 220,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.75)',
    backgroundColor: '#F5F0E8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 14,
  },
  phoneNotch: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginTop: 12,
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 28,
  },
  phoneWave: {
    fontSize: 36,
    marginTop: 12,
  },

  // Bottom sheet
  bottomSheet: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 14,
  },
  row: {
    gap: 10,
    marginBottom: 10,
  },
  confirmWrapper: {
    marginTop: 6,
  },
});
