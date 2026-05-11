import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_JOBS } from '@/constants/Languages';
import { useApp } from '@/context/AppContext';
import JobCard from '@/components/JobCard';
import SwipeNavigator from '@/components/SwipeNavigator';

const FILTERS = [
  { id: 'nearby', label: 'Nearby', icon: 'location-outline' },
  { id: 'fullTime', label: 'Full Time', icon: 'time-outline' },
  { id: 'partTime', label: 'Part Time', icon: 'hourglass-outline' },
  { id: 'dailyWage', label: 'Daily Wage', icon: 'cash-outline' },
  { id: 'urgent', label: 'Urgent', icon: 'flash-outline' },
  { id: 'teacher', label: 'Teacher', icon: 'school-outline' },
  { id: 'electrician', label: 'Electrician', icon: 'flash-outline' },
  { id: 'carpenter', label: 'Carpenter', icon: 'hammer-outline' },
  { id: 'plumber', label: 'Plumber', icon: 'water-outline' },
  { id: 'mason', label: 'Mason', icon: 'construct-outline' },
  { id: 'welder', label: 'Welder', icon: 'flame-outline' },
  { id: 'engineer', label: 'Engineer', icon: 'cog-outline' },
] as const;

const CATEGORY_IDS = ['teacher', 'electrician', 'carpenter', 'plumber', 'mason', 'welder', 'engineer', 'labour', 'painter', 'technician', 'foreman', 'supervisor', 'driver', 'security', 'helper'];

export default function DashboardScreen() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { userName, profilePhoto, addRecentlyViewedJob, toggleSavedJob, isJobSaved } = useApp();
  const { t } = useTranslation();
  const router = useRouter();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Filter and sort jobs
  const filteredJobs = React.useMemo(() => {
    let jobs = [...MOCK_JOBS];

    // Apply type/category filter
    if (activeFilter) {
      if (activeFilter === 'nearby') {
        // Sort by distance (ascending)
        jobs = jobs.sort((a, b) => {
          const distA = parseFloat(a.distance.replace(' km', ''));
          const distB = parseFloat(b.distance.replace(' km', ''));
          return distA - distB;
        });
      } else if (activeFilter === 'fullTime') {
        jobs = jobs.filter(j => j.type === 'Full Time');
      } else if (activeFilter === 'partTime') {
        jobs = jobs.filter(j => j.type === 'Part Time');
      } else if (activeFilter === 'dailyWage') {
        jobs = jobs.filter(j => j.type === 'Daily Wage');
      } else if (activeFilter === 'urgent') {
        jobs = jobs.filter(j => j.urgent);
      } else if (CATEGORY_IDS.includes(activeFilter)) {
        jobs = jobs.filter(j => j.category === activeFilter);
      }
    }

    // Apply search — match against title, company, location, category, and type
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const queryWords = q.split(/\s+/);
      jobs = jobs.filter(j => {
        const searchableText = [
          j.title, j.company, j.location, j.category, j.type,
        ].join(' ').toLowerCase();
        // All query words must match somewhere in the searchable text
        return queryWords.every(word => searchableText.includes(word));
      });
      // Sort by relevance: exact title match first, then category match, then the rest
      jobs.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 0 : 1;
        const bTitle = b.title.toLowerCase().includes(q) ? 0 : 1;
        if (aTitle !== bTitle) return aTitle - bTitle;
        const aCat = a.category.toLowerCase().includes(q) ? 0 : 1;
        const bCat = b.category.toLowerCase().includes(q) ? 0 : 1;
        return aCat - bCat;
      });
    }

    return jobs;
  }, [activeFilter, searchQuery]);

  return (
    <SwipeNavigator>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>{t('hello')} 👋</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.7}
            style={styles.avatarTouchable}
          >
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                style={styles.avatarImage}
                contentFit="cover"
                cachePolicy="memory-disk"
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Search bar */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textMuted} />
          <TextInput
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            selectionColor={Colors.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Filter chips */}
      <Animated.View entering={FadeInRight.delay(300).duration(400)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
            >
              <Ionicons
                name={filter.icon as any}
                size={14}
                color={activeFilter === filter.id ? Colors.white : Colors.textSecondary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Results count */}
      {(activeFilter || searchQuery) && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </Text>
          {(activeFilter || searchQuery) && (
            <TouchableOpacity onPress={() => { setActiveFilter(null); setSearchQuery(''); }}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Job Cards */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(100 + index * 40).duration(300)}>
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
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color={Colors.primary + '40'} />
          <Text style={styles.emptyTitle}>No Jobs Found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your filters or search terms
          </Text>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => { setActiveFilter(null); setSearchQuery(''); }}
          >
            <Text style={styles.clearBtnText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.white,
  },
  headerLeft: {},
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  avatarTouchable: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  filterIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.lightGray,
  },
  resultsText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  jobsList: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  clearBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});
