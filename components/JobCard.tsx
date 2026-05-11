import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Shadows } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { JOB_CATEGORY_META, JOB_IMAGES } from '@/constants/Languages';
import { useRouter } from 'expo-router';

interface JobCardProps {
  title: string;
  company: string;
  salary: string;
  location: string;
  distance: string;
  type: string;
  urgent: boolean;
  posted: string;
  category?: string;
  jobId?: string;
  onPress?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export default function JobCard({
  title,
  company,
  salary,
  location,
  distance,
  type,
  urgent,
  posted,
  category,
  jobId,
  onPress,
  isSaved = false,
  onToggleSave,
}: JobCardProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const bookmarkScale = useSharedValue(1);
  const [imgError, setImgError] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bookmarkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bookmarkScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handleBookmark = () => {
    bookmarkScale.value = withSequence(
      withSpring(1.3, { damping: 8 }),
      withSpring(1, { damping: 6 })
    );
    onToggleSave?.();
  };

  const handleCardPress = () => {
    // Call original onPress for tracking (recently viewed, etc.)
    onPress?.();
    // Navigate to job detail
    if (jobId) {
      router.push({ pathname: '/job-detail', params: { jobId } });
    }
  };

  // Get category-specific visual
  const catMeta = category ? JOB_CATEGORY_META[category] : null;
  const iconName = catMeta?.icon || 'business';
  const iconColor = catMeta?.color || Colors.primary;
  const iconBg = catMeta?.bg || '#EEF3FF';
  // Per-job image first, then category fallback
  const imageUrl = (jobId && JOB_IMAGES[jobId]) || catMeta?.image || null;

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Job image or fallback icon */}
            <View style={[styles.imageContainer, { borderColor: iconColor + '30' }]}>  
              {imageUrl && !imgError ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.jobImage}
                  onError={() => setImgError(true)}
                />
              ) : (
                <View style={[styles.iconFallback, { backgroundColor: iconBg }]}>
                  <Ionicons name={iconName as any} size={22} color={iconColor} />
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title} numberOfLines={1}>{title}</Text>
              <Text style={styles.company}>{company}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {urgent && (
              <View style={styles.urgentBadge}>
                <Ionicons name="flash" size={12} color={Colors.white} />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleBookmark}
              style={styles.bookmarkBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Animated.View style={bookmarkAnimStyle}>
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isSaved ? Colors.accent : Colors.textMuted}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={Colors.accent} />
            <Text style={styles.salary}>{salary}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.distance}>• {distance}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
            {category && catMeta && (
              <View style={[styles.categoryBadge, { backgroundColor: catMeta.bg }]}>
                <Ionicons name={catMeta.icon as any} size={11} color={catMeta.color} />
                <Text style={[styles.categoryText, { color: catMeta.color }]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.posted}>{posted}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1.5,
  },
  jobImage: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
  },
  iconFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  bookmarkBtn: {
    padding: 4,
  },
  details: {
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  salary: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  distance: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  posted: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
