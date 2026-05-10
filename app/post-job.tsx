import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp, PostedJob } from '@/context/AppContext';

const JOB_CATEGORIES = [
  { id: 'labour', label: 'Labour', icon: 'people-outline' },
  { id: 'mason', label: 'Mason', icon: 'construct-outline' },
  { id: 'electrician', label: 'Electrician', icon: 'flash-outline' },
  { id: 'carpenter', label: 'Carpenter', icon: 'hammer-outline' },
  { id: 'painter', label: 'Painter', icon: 'color-palette-outline' },
  { id: 'plumber', label: 'Plumber', icon: 'water-outline' },
  { id: 'welder', label: 'Welder', icon: 'flame-outline' },
  { id: 'technician', label: 'Technician', icon: 'hardware-chip-outline' },
  { id: 'foreman', label: 'Foreman', icon: 'megaphone-outline' },
  { id: 'supervisor', label: 'Supervisor', icon: 'clipboard-outline' },
  { id: 'engineer', label: 'Engineer', icon: 'cog-outline' },
  { id: 'helper', label: 'Helper', icon: 'hand-left-outline' },
  { id: 'driver', label: 'Driver', icon: 'car-outline' },
  { id: 'security', label: 'Security', icon: 'shield-outline' },
];

const JOB_TYPES = ['Full Time', 'Part Time', 'Daily Wage', 'Contract'];

export default function PostJobScreen() {
  const { addPostedJob, userName } = useApp();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [urgent, setUrgent] = useState(false);

  const isValid = title.trim() && company.trim() && salary.trim() && location.trim() && category;

  const handlePost = async () => {
    if (!isValid) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    const job: PostedJob = {
      id: `posted_${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      salary: `₹${salary.trim()}`,
      location: location.trim(),
      type: jobType,
      category,
      urgent,
      description: description.trim(),
      postedAt: Date.now(),
    };
    await addPostedJob(job);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Job Posted! ✅', 'Your job listing is now live.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={styles.managerBadge}>
            <Ionicons name="briefcase" size={12} color="#fff" />
            <Text style={styles.managerBadgeText}>Manager</Text>
          </View>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          {/* Job Title */}
          <Animated.View entering={FadeInDown.delay(50).duration(300)}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Electrician needed for wiring" placeholderTextColor={Colors.textMuted} />
          </Animated.View>

          {/* Company */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <Text style={styles.label}>Company / Site Name *</Text>
            <TextInput style={styles.input} value={company} onChangeText={setCompany} placeholder="e.g. ABC Construction" placeholderTextColor={Colors.textMuted} />
          </Animated.View>

          {/* Salary */}
          <Animated.View entering={FadeInDown.delay(150).duration(300)}>
            <Text style={styles.label}>Salary (₹) *</Text>
            <TextInput style={styles.input} value={salary} onChangeText={setSalary} placeholder="e.g. 18,000/month or 600/day" placeholderTextColor={Colors.textMuted} keyboardType="default" />
          </Animated.View>

          {/* Location */}
          <Animated.View entering={FadeInDown.delay(200).duration(300)}>
            <Text style={styles.label}>Job Location *</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Andheri West, Mumbai" placeholderTextColor={Colors.textMuted} />
          </Animated.View>

          {/* Category */}
          <Animated.View entering={FadeInDown.delay(250).duration(300)}>
            <Text style={styles.label}>Job Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {JOB_CATEGORIES.map(cat => (
                <TouchableOpacity key={cat.id} style={[styles.chip, category === cat.id && styles.chipActive]} onPress={() => { setCategory(cat.id); Haptics.selectionAsync(); }}>
                  <Ionicons name={cat.icon as any} size={14} color={category === cat.id ? '#fff' : Colors.textSecondary} />
                  <Text style={[styles.chipText, category === cat.id && styles.chipTextActive]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Job Type */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)}>
            <Text style={styles.label}>Job Type</Text>
            <View style={styles.typeRow}>
              {JOB_TYPES.map(t => (
                <TouchableOpacity key={t} style={[styles.typeBtn, jobType === t && styles.typeBtnActive]} onPress={() => { setJobType(t); Haptics.selectionAsync(); }}>
                  <Text style={[styles.typeBtnText, jobType === t && styles.typeBtnTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Urgent */}
          <Animated.View entering={FadeInDown.delay(350).duration(300)}>
            <TouchableOpacity style={styles.urgentRow} onPress={() => { setUrgent(!urgent); Haptics.selectionAsync(); }}>
              <View style={[styles.checkbox, urgent && styles.checkboxActive]}>
                {urgent && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.urgentLabel}>⚡ Urgently Hiring</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(400).duration(300)}>
            <Text style={styles.label}>Job Description (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Describe the job requirements, timing, etc." placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} textAlignVertical="top" />
          </Animated.View>

          {/* Post Button */}
          <Animated.View entering={FadeInDown.delay(450).duration(300)}>
            <TouchableOpacity style={[styles.postBtn, !isValid && styles.postBtnDisabled]} onPress={handlePost} disabled={!isValid} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.postBtnText}>Post Job</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFBFF' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F5' },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0F0F5', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: Colors.text, marginLeft: 12 },
  managerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#7C3AED', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  managerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  form: { padding: 20, gap: 18, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: Colors.text, borderWidth: 1.5, borderColor: '#E8EAF6' },
  textArea: { minHeight: 100 },
  chipRow: { gap: 8, paddingBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E8EAF6' },
  chipActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E8EAF6' },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  typeBtnTextActive: { color: '#fff' },
  urgentRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#F44336', borderColor: '#F44336' },
  urgentLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  postBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#7C3AED', padding: 16, borderRadius: 14, marginTop: 8 },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
