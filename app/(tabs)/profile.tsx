import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp, RecentJob } from '@/context/AppContext';
import { SKILLS } from '@/constants/Languages';
import SwipeNavigator from '@/components/SwipeNavigator';

export default function ProfileScreen() {
  const {
    userName, phoneNumber, selectedSkills, selectedLanguage,
    resetState, recentlyViewedJobs, savedJobs,
    profilePhoto, address, experience, userRole, postedJobs,
  } = useApp();
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [showRecentJobs, setShowRecentJobs] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? All your saved data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await resetState();
            // Reset entire navigation stack to root index (language selection)
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'index' }],
              })
            );
          },
        },
      ]
    );
  };

  // Navigate to sub-pages
  const navigateTo = (route: string) => {
    router.push(route as any);
  };

  // Get skill display info for all selected skills
  const skillDisplayList = selectedSkills.map((skillId) => {
    const info = SKILLS.find((s) => s.id === skillId);
    return info
      ? `${info.label} (${info.hindiLabel})`
      : skillId.replace('_', ' ');
  });

  // Profile completion calculation
  const completionItems = [
    { label: 'Phone Number', done: !!phoneNumber },
    { label: 'Skills', done: selectedSkills.length > 0 },
    { label: 'Profile Photo', done: !!profilePhoto },
    { label: 'Experience', done: !!experience },
    { label: 'Location', done: !!address },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  // Time ago helper
  const timeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const menuItems = [
    { icon: 'person-outline' as const, label: 'Edit Profile', color: Colors.primary, route: '/edit-profile' },
    { icon: 'document-text-outline' as const, label: 'My Applications', color: '#4CAF50', route: '/my-applications' },
    { icon: 'bookmark-outline' as const, label: 'Saved Jobs', color: Colors.accent, route: '/saved-jobs', badge: savedJobs.length },
    { icon: 'settings-outline' as const, label: 'Settings', color: '#607D8B', route: '/settings' },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', color: '#9C27B0', route: '/help' },
    { icon: 'information-circle-outline' as const, label: 'About', color: '#00BCD4', route: '/about' },
  ];

  return (
    <SwipeNavigator>
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.profileHeader}>
          <TouchableOpacity onPress={() => navigateTo('/edit-profile')} style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.avatarImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.avatarLarge}>
                <Ionicons name="person" size={40} color={Colors.primary} />
              </View>
            )}
            <View style={styles.cameraBtn}>
              <Ionicons name="camera" size={12} color={Colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{userName}</Text>
          {userRole === 'manager' && (
            <View style={styles.managerTag}>
              <Ionicons name="briefcase" size={12} color="#fff" />
              <Text style={styles.managerTagText}>Manager</Text>
            </View>
          )}
          <Text style={styles.phone}>+91 {phoneNumber || 'XXXXXXXXXX'}</Text>
          {selectedSkills.length > 0 && (
            <View style={styles.skillBadgesRow}>
              {skillDisplayList.map((label, idx) => (
                <View key={idx} style={styles.skillBadge}>
                  <Ionicons name="construct-outline" size={12} color={Colors.accent} />
                  <Text style={styles.skillText}>{label}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Profile completion card */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.completionCard}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <Text style={[styles.completionPercent, completionPercent === 100 && { color: '#4CAF50' }]}>
              {completionPercent}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionPercent}%` }]} />
          </View>
          <View style={styles.completionItems}>
            {completionItems.map((item, i) => (
              <View key={i} style={styles.completionItem}>
                <Ionicons
                  name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={item.done ? '#4CAF50' : Colors.textMuted}
                />
                <Text style={[styles.completionItemText, item.done && styles.completionItemDone]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem} onPress={() => navigateTo('/my-applications')}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} onPress={() => navigateTo('/saved-jobs')}>
            <Text style={styles.statNumber}>{savedJobs.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{userRole === 'manager' ? postedJobs.length : 0}</Text>
            <Text style={styles.statLabel}>{userRole === 'manager' ? 'Posted' : 'Interviews'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Recently Viewed Jobs */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.recentSection}>
          <TouchableOpacity
            style={styles.recentHeader}
            onPress={() => setShowRecentJobs(!showRecentJobs)}
            activeOpacity={0.7}
          >
            <View style={styles.recentHeaderLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FF6B0015' }]}>
                <Ionicons name="time-outline" size={20} color="#FF6B00" />
              </View>
              <View>
                <Text style={styles.recentTitle}>Recently Viewed</Text>
                <Text style={styles.recentCount}>
                  {recentlyViewedJobs.length} {recentlyViewedJobs.length === 1 ? 'job' : 'jobs'}
                </Text>
              </View>
            </View>
            <Ionicons
              name={showRecentJobs ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.textMuted}
            />
          </TouchableOpacity>

          {/* Expandable job list */}
          {showRecentJobs && (
            <View style={styles.recentJobsList}>
              {recentlyViewedJobs.length === 0 ? (
                <View style={styles.recentEmpty}>
                  <Ionicons name="eye-off-outline" size={28} color={Colors.textMuted} />
                  <Text style={styles.recentEmptyText}>No jobs viewed yet</Text>
                  <Text style={styles.recentEmptySubtext}>
                    Tap on any job card to see it here
                  </Text>
                </View>
              ) : (
                recentlyViewedJobs.map((job, index) => (
                  <View
                    key={job.id + '-' + index}
                    style={[
                      styles.recentJobItem,
                      index < recentlyViewedJobs.length - 1 && styles.recentJobBorder,
                    ]}
                  >
                    <View style={styles.recentJobIcon}>
                      <Ionicons name="briefcase" size={16} color={Colors.primary} />
                    </View>
                    <View style={styles.recentJobInfo}>
                      <Text style={styles.recentJobTitle} numberOfLines={1}>{job.title}</Text>
                      <Text style={styles.recentJobCompany} numberOfLines={1}>{job.company}</Text>
                      <View style={styles.recentJobMeta}>
                        <Text style={styles.recentJobSalary}>{job.salary}</Text>
                        <Text style={styles.recentJobDot}>•</Text>
                        <Text style={styles.recentJobLocation} numberOfLines={1}>{job.location}</Text>
                      </View>
                    </View>
                    <View style={styles.recentJobRight}>
                      <View style={styles.recentTypeBadge}>
                        <Text style={styles.recentTypeText}>{job.type}</Text>
                      </View>
                      <Text style={styles.recentJobTime}>{timeAgo(job.viewedAt)}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </Animated.View>

        {/* Manager: Post Job Button */}
        {userRole === 'manager' && (
          <Animated.View entering={FadeInDown.delay(350).duration(400)} style={{ marginHorizontal: 16, marginTop: 16 }}>
            <TouchableOpacity style={styles.postJobBtn} onPress={() => navigateTo('/post-job')} activeOpacity={0.8}>
              <View style={styles.postJobLeft}>
                <View style={styles.postJobIcon}>
                  <Ionicons name="add-circle" size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.postJobTitle}>Post a New Job</Text>
                  <Text style={styles.postJobSub}>{postedJobs.length} jobs posted so far</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#7C3AED" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Menu */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigateTo(item.route)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.badge != null && item.badge > 0 && (
                <View style={styles.menuBadge}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.logoutSection}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* App version */}
        <Text style={styles.versionText}>Work Bandhu v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
    </SwipeNavigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Shadows.small,
  },
  avatarContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary + '20',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  skillBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    paddingHorizontal: 12,
  },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.accent + '15',
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },

  // Profile completion
  completionCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...Shadows.small,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  completionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  completionPercent: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.accent,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0F0F0',
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  completionItems: {
    gap: 8,
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionItemText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  completionItemDone: {
    color: Colors.text,
    textDecorationLine: 'line-through',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    ...Shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },

  // Recently Viewed
  recentSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    ...Shadows.small,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  recentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  recentCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  recentJobsList: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  recentEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  recentEmptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  recentEmptySubtext: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  recentJobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  recentJobBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  recentJobIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentJobInfo: {
    flex: 1,
    gap: 2,
  },
  recentJobTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  recentJobCompany: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recentJobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  recentJobSalary: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.accent,
  },
  recentJobDot: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  recentJobLocation: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  recentJobRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  recentTypeBadge: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recentTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  recentJobTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  // Menu
  menuSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 8,
    ...Shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  menuBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },

  // Logout
  logoutSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },

  // Version
  versionText: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
  },

  // Manager
  managerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  managerTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  postJobBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7C3AED30',
    ...Shadows.small,
  },
  postJobLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  postJobIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postJobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  postJobSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
