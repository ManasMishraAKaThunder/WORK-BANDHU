import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn, useAnimatedStyle, useSharedValue, withSpring, withTiming, withSequence } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { getQuizQuestions, QuizQuestion } from '@/constants/QuizQuestions';
import { SKILLS } from '@/constants/Languages';

const { width } = Dimensions.get('window');

interface FlatQuestion {
  skill: string;
  skillLabel: string;
  question: QuizQuestion;
  skillIndex: number;
  qIndex: number;
}

export default function SkillQuizScreen() {
  const { selectedSkills, setVerifiedSkills, setOnboardingComplete } = useApp();
  const router = useRouter();

  // Generate quiz questions
  const quizData = useMemo(() => getQuizQuestions(selectedSkills, 3), [selectedSkills]);

  // Flatten into single array
  const allQuestions = useMemo((): FlatQuestion[] => {
    const flat: FlatQuestion[] = [];
    quizData.forEach((group, si) => {
      const skillInfo = SKILLS.find(s => s.id === group.skill);
      group.questions.forEach((q, qi) => {
        flat.push({ skill: group.skill, skillLabel: skillInfo?.label || group.skill, question: q, skillIndex: si, qIndex: qi });
      });
    });
    return flat;
  }, [quizData]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Record<string, { correct: number; total: number }>>({});
  const [showResult, setShowResult] = useState(false);
  const progressAnim = useSharedValue(0);
  const shakeAnim = useSharedValue(0);

  const totalQ = allQuestions.length;
  const current = allQuestions[currentIndex];

  const handleSelect = (optIndex: number) => {
    if (answered) return;
    Haptics.selectionAsync();
    setSelectedOption(optIndex);
    setAnswered(true);

    const isCorrect = optIndex === current.question.correct;
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeAnim.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 50 }), withTiming(-4, { duration: 50 }), withTiming(0, { duration: 50 }));
    }

    setAnswers(prev => {
      const skill = current.skill;
      const existing = prev[skill] || { correct: 0, total: 0 };
      return { ...prev, [skill]: { correct: existing.correct + (isCorrect ? 1 : 0), total: existing.total + 1 } };
    });

    // Auto advance after delay
    setTimeout(() => {
      if (currentIndex < totalQ - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        progressAnim.value = withSpring((currentIndex + 1) / totalQ);
      } else {
        progressAnim.value = withSpring(1);
        setShowResult(true);
      }
    }, 1200);
  };

  const progressStyle = useAnimatedStyle(() => ({ width: `${progressAnim.value * 100}%` }));
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeAnim.value }] }));

  const handleFinish = async () => {
    const verified: string[] = [];
    Object.entries(answers).forEach(([skill, data]) => {
      if (data.total > 0 && data.correct / data.total >= 0.5) {
        verified.push(skill);
      }
    });
    await setVerifiedSkills(verified);
    await setOnboardingComplete(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)');
  };

  if (showResult) {
    const verified: string[] = [];
    const failed: string[] = [];
    Object.entries(answers).forEach(([skill, data]) => {
      const label = SKILLS.find(s => s.id === skill)?.label || skill;
      if (data.total > 0 && data.correct / data.total >= 0.5) verified.push(label);
      else failed.push(label);
    });

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.resultIcon}>
            <Ionicons name={verified.length > 0 ? 'shield-checkmark' : 'alert-circle'} size={64} color={verified.length > 0 ? '#4CAF50' : '#F44336'} />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(200).duration(400)} style={styles.resultTitle}>
            {verified.length === Object.keys(answers).length ? 'All Skills Verified! 🎉' : verified.length > 0 ? 'Partially Verified' : 'Verification Failed'}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(300).duration(400)} style={styles.resultSubtitle}>
            {verified.length > 0 ? 'You can apply to jobs for verified skills' : 'You need >50% correct answers per skill'}
          </Animated.Text>

          {/* Skill results */}
          {Object.entries(answers).map(([skill, data], i) => {
            const label = SKILLS.find(s => s.id === skill)?.label || skill;
            const passed = data.total > 0 && data.correct / data.total >= 0.5;
            const pct = Math.round((data.correct / data.total) * 100);
            return (
              <Animated.View key={skill} entering={FadeInDown.delay(400 + i * 100).duration(400)} style={[styles.resultSkill, { borderColor: passed ? '#4CAF50' : '#F44336' }]}>
                <View style={styles.resultSkillLeft}>
                  <Ionicons name={passed ? 'checkmark-circle' : 'close-circle'} size={24} color={passed ? '#4CAF50' : '#F44336'} />
                  <View>
                    <Text style={styles.resultSkillName}>{label}</Text>
                    <Text style={styles.resultSkillScore}>{data.correct}/{data.total} correct ({pct}%)</Text>
                  </View>
                </View>
                <View style={[styles.resultBadge, { backgroundColor: passed ? '#E8F5E9' : '#FFEBEE' }]}>
                  <Text style={[styles.resultBadgeText, { color: passed ? '#2E7D32' : '#C62828' }]}>{passed ? 'VERIFIED' : 'FAILED'}</Text>
                </View>
              </Animated.View>
            );
          })}

          {failed.length > 0 && (
            <Animated.Text entering={FadeInDown.delay(700).duration(400)} style={styles.failedNote}>
              ⚠️ You won't be able to apply to {failed.join(', ')} jobs. You can retake the quiz from Settings.
            </Animated.Text>
          )}

          <Animated.View entering={FadeInUp.delay(800).duration(400)} style={{ width: '100%' }}>
            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish} activeOpacity={0.8}>
              <Text style={styles.finishBtnText}>Continue to App</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!current) return null;

  const getOptionStyle = (idx: number) => {
    if (!answered) return selectedOption === idx ? styles.optionSelected : styles.option;
    if (idx === current.question.correct) return styles.optionCorrect;
    if (idx === selectedOption && idx !== current.question.correct) return styles.optionWrong;
    return styles.option;
  };

  const getOptionIcon = (idx: number): string | null => {
    if (!answered) return null;
    if (idx === current.question.correct) return 'checkmark-circle';
    if (idx === selectedOption && idx !== current.question.correct) return 'close-circle';
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.skillChip, { backgroundColor: '#7C3AED15' }]}>
            <Ionicons name="sparkles" size={14} color="#7C3AED" />
            <Text style={styles.skillChipText}>{current.skillLabel}</Text>
          </View>
          <Text style={styles.qCounter}>{currentIndex + 1} / {totalQ}</Text>
        </View>
        <View style={styles.aiTag}>
          <Ionicons name="hardware-chip-outline" size={14} color="#fff" />
          <Text style={styles.aiTagText}>AI Quiz</Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      {/* Question */}
      <Animated.View key={currentIndex} entering={FadeIn.duration(300)} style={styles.questionArea}>
        <Animated.View style={shakeStyle}>
          <View style={styles.qNumberBadge}>
            <Text style={styles.qNumberText}>Q{currentIndex + 1}</Text>
          </View>
          <Text style={styles.questionText}>{current.question.question}</Text>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {current.question.options.map((opt, idx) => (
            <Animated.View key={idx} entering={FadeInDown.delay(100 + idx * 80).duration(300)}>
              <TouchableOpacity style={getOptionStyle(idx)} onPress={() => handleSelect(idx)} activeOpacity={0.7} disabled={answered}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionLetter, answered && idx === current.question.correct && styles.optionLetterCorrect, answered && idx === selectedOption && idx !== current.question.correct && styles.optionLetterWrong]}>
                    <Text style={[styles.optionLetterText, answered && (idx === current.question.correct || idx === selectedOption) && { color: '#fff' }]}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, answered && idx === current.question.correct && { color: '#2E7D32', fontWeight: '700' }, answered && idx === selectedOption && idx !== current.question.correct && { color: '#C62828' }]}>{opt}</Text>
                </View>
                {getOptionIcon(idx) && (
                  <Ionicons name={getOptionIcon(idx) as any} size={22} color={idx === current.question.correct ? '#4CAF50' : '#F44336'} />
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.bottomInfoText}>Answer correctly to verify your {current.skillLabel} skills</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  skillChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillChipText: { fontSize: 13, fontWeight: '700', color: '#7C3AED' },
  qCounter: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  aiTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#7C3AED', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  aiTagText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  progressBg: { height: 4, backgroundColor: '#E8EAF6', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#7C3AED', borderRadius: 2 },
  questionArea: { flex: 1, paddingHorizontal: 20, paddingTop: 28 },
  qNumberBadge: { alignSelf: 'flex-start', backgroundColor: '#7C3AED15', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginBottom: 16 },
  qNumberText: { fontSize: 13, fontWeight: '800', color: '#7C3AED' },
  questionText: { fontSize: 20, fontWeight: '800', color: Colors.text, lineHeight: 28, marginBottom: 28 },
  optionsContainer: { gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E8EAF6' },
  optionSelected: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#F3E8FF', borderWidth: 1.5, borderColor: '#7C3AED' },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#E8F5E9', borderWidth: 1.5, borderColor: '#4CAF50' },
  optionWrong: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 14, backgroundColor: '#FFEBEE', borderWidth: 1.5, borderColor: '#F44336' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  optionLetter: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F0F0F5', alignItems: 'center', justifyContent: 'center' },
  optionLetterCorrect: { backgroundColor: '#4CAF50' },
  optionLetterWrong: { backgroundColor: '#F44336' },
  optionLetterText: { fontSize: 14, fontWeight: '800', color: Colors.text },
  optionText: { fontSize: 15, fontWeight: '500', color: Colors.text, flex: 1 },
  bottomInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 12 },
  bottomInfoText: { fontSize: 12, color: Colors.textMuted },
  // Results
  resultContainer: { alignItems: 'center', padding: 24, paddingTop: 40 },
  resultIcon: { marginBottom: 20 },
  resultTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: 8 },
  resultSubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 28 },
  resultSkill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 16, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1.5, marginBottom: 12 },
  resultSkillLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resultSkillName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  resultSkillScore: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  resultBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  resultBadgeText: { fontSize: 11, fontWeight: '800' },
  failedNote: { fontSize: 13, color: '#E65100', textAlign: 'center', marginTop: 8, marginBottom: 20, lineHeight: 20, paddingHorizontal: 12 },
  finishBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#7C3AED', padding: 16, borderRadius: 14, marginTop: 16 },
  finishBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
