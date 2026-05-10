import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function MyApplicationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Applications</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <Ionicons name="document-text-outline" size={56} color="#4CAF50" style={{ opacity: 0.4 }} />
        </View>
        <Text style={styles.emptyTitle}>No Applications Yet</Text>
        <Text style={styles.emptySubtitle}>
          When you apply for jobs, your applications will be tracked here with their status.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/jobs')}
          style={styles.browseBtn}
        >
          <Ionicons name="briefcase" size={18} color={Colors.white} />
          <Text style={styles.browseBtnText}>Find Jobs</Text>
        </TouchableOpacity>
      </Animated.View>
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#4CAF5015',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  browseBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#4CAF50',
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
  },
  browseBtnText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
