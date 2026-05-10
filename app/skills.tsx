import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/Colors';
import { SKILLS, SKILL_IMAGES } from '@/constants/Languages';
import { useApp } from '@/context/AppContext';
import SkillCard from '@/components/SkillCard';
import GradientButton from '@/components/GradientButton';
import * as Haptics from 'expo-haptics';

const MAX_SKILLS = 3;
const { width } = Dimensions.get('window');

export default function SkillsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setSelectedSkills } = useApp();
  const router = useRouter();
  const { t } = useTranslation();

  const handleSelect = (skillId: string) => {
    Haptics.selectionAsync();
    setSelected((prev) => {
      if (prev.includes(skillId)) {
        // Deselect
        return prev.filter((id) => id !== skillId);
      }
      if (prev.length >= MAX_SKILLS) {
        // Already at max — give error haptic, don't add
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return prev;
      }
      // Add new skill
      return [...prev, skillId];
    });
  };

  const handleContinue = async () => {
    if (selected.length > 0) {
      await setSelectedSkills(selected);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/skill-quiz');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeInUp.delay(200).duration(500)} style={styles.header}>
        <Text style={styles.title}>{t('selectMainSkill')}</Text>
        <Text style={styles.subtitle}>{t('skillSubtitle')}</Text>

        {/* Selection counter pill */}
        <View style={styles.counterRow}>
          <View style={[
            styles.counterPill,
            selected.length >= MAX_SKILLS && styles.counterPillFull,
          ]}>
            <Text style={[
              styles.counterText,
              selected.length >= MAX_SKILLS && styles.counterTextFull,
            ]}>
              {selected.length}/{MAX_SKILLS} selected
            </Text>
          </View>
          {selected.length >= MAX_SKILLS && (
            <Text style={styles.maxText}>Maximum reached</Text>
          )}
        </View>
      </Animated.View>

      {/* Skills grid */}
      <FlatList
        data={SKILLS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const selIdx = selected.indexOf(item.id);
          return (
            <Animated.View
              entering={FadeIn.delay(300 + index * 60).duration(350)}
              style={{ flex: 1 }}
            >
              <SkillCard
                label={item.label}
                hindiLabel={item.hindiLabel}
                image={SKILL_IMAGES[item.id]}
                isSelected={selIdx !== -1}
                selectionIndex={selIdx !== -1 ? selIdx + 1 : undefined}
                onPress={() => handleSelect(item.id)}
              />
            </Animated.View>
          );
        }}
      />

      {/* Sticky continue button */}
      <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.bottomBar}>
        <GradientButton
          title={`${t('continue')}${selected.length > 0 ? ` (${selected.length})` : ''}`}
          onPress={handleContinue}
          disabled={selected.length === 0}
          variant={selected.length > 0 ? 'orange' : 'disabled'}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  counterPill: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  counterPillFull: {
    backgroundColor: Colors.accent + '20',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  counterTextFull: {
    color: Colors.accent,
  },
  maxText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: 10,
    paddingTop: 12,
    paddingBottom: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
});
