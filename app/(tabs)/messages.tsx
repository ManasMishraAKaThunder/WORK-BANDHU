import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Shadows } from '@/constants/Colors';
import SwipeNavigator from '@/components/SwipeNavigator';

export default function MessagesScreen() {
  const { t } = useTranslation();

  return (
    <SwipeNavigator>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('messages')}</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      <View style={styles.emptyState}>
        {/* Illustration */}
        <Animated.View entering={FadeIn.delay(200).duration(600)} style={styles.illustrationContainer}>
          {/* Chat bubbles illustration */}
          <View style={styles.bubbleGroup}>
            <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.bubbleBig}>
              <View style={styles.bubbleLine} />
              <View style={[styles.bubbleLine, { width: '70%' }]} />
              <View style={styles.bubbleTail} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.bubbleSmall}>
              <View style={[styles.bubbleLineLight, { width: '80%' }]} />
              <View style={[styles.bubbleLineLight, { width: '50%' }]} />
              <View style={styles.bubbleTailRight} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.bubbleMedium}>
              <View style={styles.bubbleLine} />
              <View style={[styles.bubbleLine, { width: '60%' }]} />
              <View style={styles.bubbleTail} />
            </Animated.View>
          </View>

          {/* Decorative elements */}
          <View style={[styles.floatingDot, { top: 20, left: 30 }]} />
          <View style={[styles.floatingDot, { top: 60, right: 40, width: 8, height: 8 }]} />
          <View style={[styles.floatingDot, { bottom: 30, left: 50, width: 6, height: 6, backgroundColor: Colors.accent + '30' }]} />
        </Animated.View>

        {/* Text */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.emptyTextContainer}>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>
            When you apply to jobs, your conversations{'\n'}with recruiters will appear here
          </Text>
        </Animated.View>

        {/* CTA */}
        <Animated.View entering={FadeInUp.delay(800).duration(500)}>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Ionicons name="briefcase-outline" size={18} color={Colors.primary} />
            <Text style={styles.ctaText}>Browse Jobs</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    width: 220,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  bubbleGroup: {
    width: '100%',
    alignItems: 'flex-start',
    gap: 12,
  },

  // Chat bubbles
  bubbleBig: {
    width: 160,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + '12',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    gap: 6,
    position: 'relative',
  },
  bubbleSmall: {
    width: 130,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.accent + '15',
    borderRadius: 18,
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
    gap: 6,
    position: 'relative',
  },
  bubbleMedium: {
    width: 140,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.primary + '12',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    gap: 6,
    position: 'relative',
  },
  bubbleLine: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary + '20',
    width: '90%',
  },
  bubbleLineLight: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent + '25',
  },
  bubbleTail: {
    position: 'absolute',
    top: 0,
    left: -4,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderTopColor: Colors.primary + '12',
    borderRightColor: 'transparent',
  },
  bubbleTailRight: {
    position: 'absolute',
    top: 0,
    right: -4,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: Colors.accent + '15',
    borderLeftColor: 'transparent',
  },

  // Floating dots
  floatingDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary + '20',
  },

  // Text
  emptyTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },

  // CTA button
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary + '30',
    ...Shadows.small,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
});
