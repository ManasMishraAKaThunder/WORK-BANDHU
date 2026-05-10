import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* App info card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.appCard}>
          <View style={styles.appIcon}>
            <Ionicons name="construct" size={36} color={Colors.white} />
          </View>
          <Text style={styles.appName}>Work Bandhu</Text>
          <Text style={styles.appTagline}>Your trusted job partner</Text>
          <View style={styles.versionPill}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </Animated.View>

        {/* About text */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Work Bandhu</Text>
          <Text style={styles.aboutText}>
            Work Bandhu is a job platform designed specifically for blue-collar workers
            in India. We connect skilled workers with employers looking for reliable talent
            in construction, manufacturing, electrical, plumbing, and many more trades.
          </Text>
          <Text style={styles.aboutText}>
            Our mission is to empower every worker with easy access to job opportunities,
            fair wages, and a better livelihood.
          </Text>
        </Animated.View>

        {/* Info items */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.infoCard}>
          {[
            { icon: 'globe-outline' as const, label: 'Website', value: 'www.workbandhu.com', color: Colors.primary },
            { icon: 'shield-checkmark-outline' as const, label: 'Privacy Policy', value: '', color: '#4CAF50' },
            { icon: 'document-text-outline' as const, label: 'Terms of Service', value: '', color: Colors.accent },
            { icon: 'code-slash-outline' as const, label: 'Open Source Licenses', value: '', color: '#9C27B0' },
          ].map((item, index, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.infoItem, index < arr.length - 1 && styles.infoBorder]}
            >
              <View style={styles.infoLeft}>
                <View style={[styles.infoIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.infoLabel}>{item.label}</Text>
              </View>
              <View style={styles.infoRight}>
                {item.value ? <Text style={styles.infoValue}>{item.value}</Text> : null}
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in India</Text>
          <Text style={styles.copyrightText}>© 2026 Work Bandhu. All rights reserved.</Text>
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
  appCard: {
    backgroundColor: Colors.white, borderRadius: 20, padding: 28,
    alignItems: 'center', marginBottom: 16, ...Shadows.small,
  },
  appIcon: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: Colors.accent,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  appName: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  appTagline: { fontSize: 14, color: Colors.textSecondary, marginBottom: 14 },
  versionPill: {
    backgroundColor: Colors.primary + '10', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12,
  },
  versionText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  aboutCard: {
    backgroundColor: Colors.white, borderRadius: 16, padding: 20,
    marginBottom: 16, ...Shadows.small,
  },
  aboutTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  aboutText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 10 },
  infoCard: {
    backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden',
    marginBottom: 16, ...Shadows.small,
  },
  infoItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 15, fontWeight: '500', color: Colors.text },
  infoRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoValue: { fontSize: 13, color: Colors.textMuted },
  footer: { alignItems: 'center', marginTop: 16, gap: 4 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  copyrightText: { fontSize: 12, color: Colors.textMuted },
});
