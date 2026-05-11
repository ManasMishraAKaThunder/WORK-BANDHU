import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { MOCK_JOBS, JOB_CATEGORY_META, JOB_IMAGES } from '@/constants/Languages';

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ jobId: string }>();
  const { toggleSavedJob, isJobSaved, postedJobs, startConversation, userName } = useApp();
  const [imgError, setImgError] = useState(false);

  // Find job from MOCK_JOBS or postedJobs
  const job = MOCK_JOBS.find(j => j.id === params.jobId)
    || postedJobs.find(j => j.id === params.jobId);

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Job Not Found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const catMeta = job.category ? JOB_CATEGORY_META[job.category] : null;
  const imageUrl = (job.id && JOB_IMAGES[job.id]) || catMeta?.image || null;
  const saved = isJobSaved(job.id);

  const handleMessageManager = () => {
    // Create or find existing conversation for this job
    const managerName = job.company + ' Manager';
    const conversation = startConversation(job.id, job.title, job.company, managerName);
    
    // Navigate to chat screen
    router.push({
      pathname: '/chat',
      params: { conversationId: conversation.id },
    });
  };

  const handleToggleSave = () => {
    toggleSavedJob({
      id: job.id,
      title: job.title,
      company: job.company,
      salary: job.salary,
      location: job.location,
      distance: (job as any).distance || '',
      type: job.type,
      urgent: job.urgent,
      posted: (job as any).posted || 'Recently',
      category: job.category,
    });
  };

  const handleApply = () => {
    Alert.alert(
      '✅ Application Sent!',
      `Your application for "${job.title}" at ${job.company} has been submitted successfully.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Job Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleToggleSave} style={styles.headerBtn}>
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={saved ? Colors.accent : Colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="share-outline" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.heroContainer}>
          {imageUrl && !imgError ? (
            <Image
              source={{ uri: imageUrl.replace('w=200&h=200', 'w=800&h=400') }}
              style={styles.heroImage}
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={[styles.heroFallback, { backgroundColor: catMeta?.bg || '#EEF3FF' }]}>
              <Ionicons name={(catMeta?.icon || 'briefcase') as any} size={60} color={catMeta?.color || Colors.primary} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          {job.urgent && (
            <View style={styles.urgentTag}>
              <Ionicons name="flash" size={14} color="#fff" />
              <Text style={styles.urgentTagText}>Urgent Hiring</Text>
            </View>
          )}
        </Animated.View>

        {/* Job Info Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.infoCard}>
          <View style={styles.titleSection}>
            <View style={styles.companyRow}>
              <View style={[styles.companyIcon, { backgroundColor: catMeta?.bg || '#EEF3FF' }]}>
                <Ionicons name={(catMeta?.icon || 'business') as any} size={20} color={catMeta?.color || Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.companyName}>{job.company}</Text>
              </View>
            </View>
          </View>

          {/* Key Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cash" size={18} color="#FF8A00" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Salary</Text>
                <Text style={styles.detailValue}>{job.salary}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="location" size={18} color="#1565C0" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{job.location}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={[styles.detailIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="time" size={18} color="#2E7D32" />
              </View>
              <View>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{job.type}</Text>
              </View>
            </View>
            {'distance' in job && (job as any).distance && (
              <View style={styles.detailItem}>
                <View style={[styles.detailIcon, { backgroundColor: '#FCE4EC' }]}>
                  <Ionicons name="navigate" size={18} color="#AD1457" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Distance</Text>
                  <Text style={styles.detailValue}>{(job as any).distance}</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>

        {/* About the Job */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this Job</Text>
          <Text style={styles.sectionText}>
            {(job as any).description || `We are looking for a skilled ${job.title} to join ${job.company}. This is a ${job.type.toLowerCase()} position located at ${job.location}. The ideal candidate should have relevant experience and be ready to start immediately.`}
          </Text>
        </Animated.View>

        {/* Requirements */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementRow}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={14} color="#2E7D32" />
            </View>
            <Text style={styles.requirementText}>Relevant experience in {job.category || 'the field'}</Text>
          </View>
          <View style={styles.requirementRow}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={14} color="#2E7D32" />
            </View>
            <Text style={styles.requirementText}>Valid ID proof and documents</Text>
          </View>
          <View style={styles.requirementRow}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={14} color="#2E7D32" />
            </View>
            <Text style={styles.requirementText}>Ability to work {job.type.toLowerCase()} hours</Text>
          </View>
          <View style={styles.requirementRow}>
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={14} color="#2E7D32" />
            </View>
            <Text style={styles.requirementText}>Good communication skills</Text>
          </View>
        </Animated.View>

        {/* Manager / Contact */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.managerCard}>
          <View style={styles.managerHeader}>
            <View style={styles.managerAvatar}>
              <Ionicons name="person" size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.managerName}>{job.company} Manager</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Usually responds within 1 hour</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.messageBtn} onPress={handleMessageManager} activeOpacity={0.8}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
            <Text style={styles.messageBtnText}>Message Manager</Text>
          </TouchableOpacity>
          <Text style={styles.messageHint}>
            💬 Express your interest and ask questions about this job
          </Text>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.bottomCTA}>
        <TouchableOpacity style={styles.messageSmallBtn} onPress={handleMessageManager} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.8}>
          <Ionicons name="paper-plane" size={18} color="#fff" />
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Hero
  heroContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  urgentTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  urgentTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  // Info Card
  infoCard: {
    marginHorizontal: 16,
    marginTop: -30,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    ...Shadows.large,
  },
  titleSection: {
    marginBottom: 16,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  // Sections
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    ...Shadows.small,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  // Manager Card
  managerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary + '15',
    ...Shadows.small,
  },
  managerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  managerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  managerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500',
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.medium,
  },
  messageBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  messageHint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 10,
  },
  // Bottom CTA
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 28,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Shadows.large,
  },
  messageSmallBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    ...Shadows.medium,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  // Error state
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
