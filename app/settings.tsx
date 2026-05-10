import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { selectedLanguage } = useApp();

  const settingsGroups = [
    {
      title: 'General',
      items: [
        { icon: 'language-outline' as const, label: 'App Language', value: selectedLanguage || 'English', color: Colors.primary },
        { icon: 'notifications-outline' as const, label: 'Notifications', value: 'On', color: '#FF9800' },
        { icon: 'moon-outline' as const, label: 'Dark Mode', value: 'Off', color: '#607D8B' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { icon: 'eye-off-outline' as const, label: 'Profile Visibility', value: 'Public', color: '#9C27B0' },
        { icon: 'lock-closed-outline' as const, label: 'Data & Privacy', value: '', color: '#F44336' },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: 'download-outline' as const, label: 'Clear Cache', value: '', color: '#00BCD4' },
        { icon: 'star-outline' as const, label: 'Rate App', value: '', color: '#FFC107' },
        { icon: 'share-social-outline' as const, label: 'Share App', value: '', color: '#4CAF50' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {settingsGroups.map((group, gi) => (
          <Animated.View key={group.title} entering={FadeInDown.delay(100 + gi * 80).duration(400)}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingItem,
                    ii < group.items.length - 1 && styles.settingItemBorder,
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIcon, { backgroundColor: item.color + '15' }]}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.value ? (
                      <Text style={styles.settingValue}>{item.value}</Text>
                    ) : null}
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.versionInfo}>
          <Text style={styles.versionText}>Work Bandhu v1.0.0</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.lightGray },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.lightGray,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  content: { padding: 16, paddingBottom: 40 },
  groupTitle: {
    fontSize: 13, fontWeight: '700', color: Colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginLeft: 4, marginTop: 8,
  },
  groupCard: {
    backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden',
    marginBottom: 12, ...Shadows.small,
  },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  settingItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { fontSize: 15, fontWeight: '500', color: Colors.text },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontSize: 13, color: Colors.textMuted },
  versionInfo: { alignItems: 'center', marginTop: 24 },
  versionText: { fontSize: 13, color: Colors.textMuted },
});
