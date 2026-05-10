import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Colors, Shadows } from '@/constants/Colors';
import { SKILLS, MOCK_JOBS } from '@/constants/Languages';
import { useApp } from '@/context/AppContext';
import JobCard from '@/components/JobCard';
import SwipeNavigator from '@/components/SwipeNavigator';
import { useJobRecommendations, ScoredJob } from '@/hooks/useJobRecommendations';

const CATEGORY_ICON_MAP: Record<string, string> = {
  labour: 'people-outline',
  mason: 'construct-outline',
  technician: 'hardware-chip-outline',
  carpenter: 'hammer-outline',
  electrician: 'flash-outline',
  painter: 'color-palette-outline',
  plumber: 'water-outline',
  welder: 'flame-outline',
  foreman: 'megaphone-outline',
  supervisor: 'clipboard-outline',
  engineer: 'cog-outline',
};

// Map skill IDs to category IDs
const SKILL_TO_CATEGORY: Record<string, string> = {
  labour: 'labour', mason: 'mason', it_technician: 'technician',
  carpenter: 'carpenter', electrician: 'electrician', painter: 'painter',
  plumber: 'plumber', welder: 'welder', foreman: 'foreman',
  supervisor: 'supervisor', engineer: 'engineer',
};

function getMatchColor(score: number): string {
  if (score >= 70) return '#2E7D32';
  if (score >= 50) return '#F57F17';
  if (score >= 30) return '#E65100';
  return '#9E9E9E';
}

function getMatchBg(score: number): string {
  if (score >= 70) return '#E8F5E9';
  if (score >= 50) return '#FFFDE7';
  if (score >= 30) return '#FFF3E0';
  return '#F5F5F5';
}

function getMatchLabel(score: number): string {
  if (score >= 80) return 'Top Match';
  if (score >= 60) return 'Great Match';
  if (score >= 40) return 'Good Match';
  return 'Match';
}

export default function JobsScreen() {
  const { t } = useTranslation();
  const { selectedSkills, experience, addRecentlyViewedJob, toggleSavedJob, isJobSaved, userRole, postedJobs } = useApp();
  const { scoredJobs } = useJobRecommendations();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isManager = userRole === 'manager';

  // Convert skill IDs to categories
  const userCategories = useMemo(() => {
    return selectedSkills.map(s => SKILL_TO_CATEGORY[s] || s);
  }, [selectedSkills]);

  const skillLabels = useMemo(() => {
    return selectedSkills.map(s => {
      const skill = SKILLS.find(sk => sk.id === s);
      return skill?.label || s;
    });
  }, [selectedSkills]);

  // Build dynamic filter chips
  const filterChips = useMemo(() => {
    if (isManager) {
      const chips: { id: string; label: string; icon: string }[] = [
        { id: 'all', label: 'All Jobs', icon: 'grid-outline' },
        { id: 'myPosted', label: 'My Posted', icon: 'create-outline' },
        { id: 'fullTime', label: 'Full Time', icon: 'time-outline' },
        { id: 'partTime', label: 'Part Time', icon: 'hourglass-outline' },
        { id: 'urgent', label: 'Urgent', icon: 'flash-outline' },
      ];
      return chips;
    }
    const chips: { id: string; label: string; icon: string }[] = [
      { id: 'all', label: 'AI Recommended', icon: 'sparkles-outline' },
      { id: 'fullTime', label: 'Full Time', icon: 'time-outline' },
      { id: 'partTime', label: 'Part Time', icon: 'hourglass-outline' },
      { id: 'dailyWage', label: 'Daily Wage', icon: 'cash-outline' },
      { id: 'urgent', label: 'Urgent', icon: 'flash-outline' },
    ];
    userCategories.forEach((cat, i) => {
      chips.push({
        id: cat,
        label: skillLabels[i] || cat,
        icon: CATEGORY_ICON_MAP[cat] || 'briefcase-outline',
      });
    });
    return chips;
  }, [userCategories, skillLabels, isManager]);

  // Filter jobs by category + search
  const filteredJobs = useMemo((): ScoredJob[] => {
    if (isManager) {
      // Manager sees all jobs + their posted jobs converted to ScoredJob format
      const postedAsScoredJobs: ScoredJob[] = postedJobs.map(pj => ({
        ...pj,
        distance: '',
        posted: 'Just posted',
        matchScore: 100,
        matchReasons: ['Your posted job'],
      }));
      let allJobs: ScoredJob[] = activeCategory === 'myPosted'
        ? postedAsScoredJobs
        : [...postedAsScoredJobs, ...scoredJobs];

      if (activeCategory === 'urgent') allJobs = allJobs.filter(j => j.urgent);
      else if (activeCategory === 'fullTime') allJobs = allJobs.filter(j => j.type === 'Full Time');
      else if (activeCategory === 'partTime') allJobs = allJobs.filter(j => j.type === 'Part Time');

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        allJobs = allJobs.filter(j =>
          j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)
        );
      }
      return allJobs;
    }

    // Worker flow: AI-scored jobs matching user skills
    let jobs = scoredJobs.filter(job => userCategories.includes(job.category));

    if (activeCategory !== 'all') {
      if (activeCategory === 'urgent') jobs = jobs.filter(j => j.urgent);
      else if (activeCategory === 'fullTime') jobs = jobs.filter(j => j.type === 'Full Time');
      else if (activeCategory === 'partTime') jobs = jobs.filter(j => j.type === 'Part Time');
      else if (activeCategory === 'dailyWage') jobs = jobs.filter(j => j.type === 'Daily Wage');
      else jobs = jobs.filter(j => j.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) || j.category.toLowerCase().includes(q)
      );
    }

    return jobs;
  }, [scoredJobs, activeCategory, searchQuery, userCategories, isManager, postedJobs]);

  const topMatchCount = filteredJobs.filter(j => j.matchScore >= 60).length;

  return (
    <SwipeNavigator>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{isManager ? 'All Jobs' : 'Smart Jobs'}</Text>
              <View style={[styles.aiBadge, isManager && { backgroundColor: '#7C3AED' }]}>
                <Ionicons name={isManager ? 'briefcase' : 'sparkles'} size={12} color="#fff" />
                <Text style={styles.aiBadgeText}>{isManager ? 'Manager' : 'AI'}</Text>
              </View>
            </View>
            <Text style={styles.count}>
              {isManager ? `${postedJobs.length} posted • ${filteredJobs.length} total jobs` : `${topMatchCount} top matches from ${filteredJobs.length} jobs`}
            </Text>
          </View>
          <TouchableOpacity style={styles.sortBtn}>
            <Ionicons name="filter-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* AI insight pill */}
        {experience && experience.length > 0 && (
          <Animated.View entering={FadeInDown.delay(50).duration(300)} style={styles.insightPill}>
            <Ionicons name="bulb-outline" size={14} color="#F57F17" />
            <Text style={styles.insightText} numberOfLines={1}>
              Ranked by your experience: "{experience.substring(0, 40)}{experience.length > 40 ? '...' : ''}"
            </Text>
          </Animated.View>
        )}

        {/* Search bar */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your skill jobs..."
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
            selectionColor={Colors.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      {/* Category chips */}
      <Animated.View entering={FadeInRight.delay(200).duration(400)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {filterChips.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isActive ? Colors.white : Colors.textSecondary}
                />
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isManager
            ? activeCategory === 'myPosted'
              ? '📋 Your Posted Jobs'
              : activeCategory === 'all'
              ? '📋 All Available Jobs'
              : activeCategory === 'urgent'
              ? '🔥 Urgent Openings'
              : activeCategory === 'fullTime'
              ? '⏰ Full Time Jobs'
              : '⏳ Part Time Jobs'
            : activeCategory === 'all'
            ? '🤖 AI Recommended for You'
            : activeCategory === 'urgent'
            ? '🔥 Urgent Openings'
            : activeCategory === 'fullTime'
            ? '⏰ Full Time Jobs'
            : activeCategory === 'partTime'
            ? '⏳ Part Time Jobs'
            : activeCategory === 'dailyWage'
            ? '💰 Daily Wage Jobs'
            : `🎯 ${filterChips.find(c => c.id === activeCategory)?.label || ''} Jobs`}
        </Text>
      </View>

      {/* Job cards with match score */}
      {filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
              {/* AI Match Badge */}
              {item.matchScore >= 30 && (
                <View style={styles.matchBadgeRow}>
                  <View style={[styles.matchBadge, { backgroundColor: getMatchBg(item.matchScore) }]}>
                    <Ionicons
                      name={item.matchScore >= 70 ? 'sparkles' : item.matchScore >= 50 ? 'star' : 'star-half'}
                      size={12}
                      color={getMatchColor(item.matchScore)}
                    />
                    <Text style={[styles.matchScoreText, { color: getMatchColor(item.matchScore) }]}>
                      {item.matchScore}% {getMatchLabel(item.matchScore)}
                    </Text>
                    {item.matchReasons.length > 0 && (
                      <Text style={[styles.matchReason, { color: getMatchColor(item.matchScore) + 'CC' }]}>
                        • {item.matchReasons[0]}
                      </Text>
                    )}
                  </View>
                </View>
              )}
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
            <Ionicons name="search-outline" size={48} color={Colors.primary + '40'} />
          </View>
          <Text style={styles.emptyTitle}>No jobs found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search{'\n'}or filter criteria
          </Text>
        </Animated.View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: Colors.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  count: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  sortBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  insightText: {
    fontSize: 12,
    color: '#5D4037',
    flex: 1,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  categoriesRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  matchBadgeRow: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchScoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  matchReason: {
    fontSize: 11,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
