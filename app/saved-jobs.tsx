import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import JobCard from '@/components/JobCard';

export default function SavedJobsScreen() {
  const { savedJobs, toggleSavedJob, isJobSaved, addRecentlyViewedJob } = useApp();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{savedJobs.length}</Text>
        </View>
      </Animated.View>

      {savedJobs.length > 0 ? (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
              <JobCard
                title={item.title}
                company={item.company}
                salary={item.salary}
                location={item.location}
                distance={item.distance}
                type={item.type}
                urgent={item.urgent}
                posted={item.posted}
                category={item.category}
                jobId={item.id}
                isSaved={isJobSaved(item.id)}
                onToggleSave={() => toggleSavedJob({
                  id: item.id,
                  title: item.title,
                  company: item.company,
                  salary: item.salary,
                  location: item.location,
                  distance: item.distance,
                  type: item.type,
                  urgent: item.urgent,
                  posted: item.posted,
                  category: item.category,
                })}
                onPress={() => addRecentlyViewedJob({
                  id: item.id,
                  title: item.title,
                  company: item.company,
                  salary: item.salary,
                  location: item.location,
                  type: item.type,
                })}
              />
            </Animated.View>
          )}
        />
      ) : (
        <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bookmark-outline" size={56} color={Colors.accent + '40'} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Jobs</Text>
          <Text style={styles.emptySubtitle}>
            Jobs you save will appear here. Tap the bookmark icon on any job to save it.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.browseBtn}
          >
            <Ionicons name="search" size={18} color={Colors.white} />
            <Text style={styles.browseBtnText}>Browse Jobs</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accent + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    ...Shadows.small,
  },
  browseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
