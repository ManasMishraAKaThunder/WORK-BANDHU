import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp, Conversation } from '@/context/AppContext';
import SwipeNavigator from '@/components/SwipeNavigator';

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function MessagesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { conversations } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter(conv => {
      // Search by manager name
      if (conv.managerName.toLowerCase().includes(q)) return true;
      // Search by job title
      if (conv.jobTitle.toLowerCase().includes(q)) return true;
      // Search by company name
      if (conv.companyName.toLowerCase().includes(q)) return true;
      // Search within message content
      if (conv.messages.some(m => m.text.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [conversations, searchQuery]);

  const hasConversations = conversations.length > 0;

  const renderConversationItem = ({ item, index }: { item: Conversation; index: number }) => {
    const lastMessage = item.messages.length > 0
      ? item.messages[item.messages.length - 1]
      : null;
    const unreadCount = item.messages.filter(m => m.sender === 'manager' && !m.read).length;
    const timeAgo = lastMessage ? getTimeAgo(lastMessage.timestamp) : getTimeAgo(item.createdAt);

    return (
      <Animated.View entering={FadeInDown.delay(index * 60).duration(300)}>
        <TouchableOpacity
          style={[styles.conversationCard, unreadCount > 0 && styles.unreadCard]}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/chat', params: { conversationId: item.id } })}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={Colors.primary} />
            </View>
            <View style={styles.onlineDot} />
          </View>

          {/* Content */}
          <View style={styles.conversationContent}>
            <View style={styles.topRow}>
              <Text style={[styles.managerName, unreadCount > 0 && styles.unreadName]} numberOfLines={1}>
                {item.managerName}
              </Text>
              <Text style={[styles.timeText, unreadCount > 0 && styles.unreadTime]}>
                {timeAgo}
              </Text>
            </View>
            <View style={styles.jobRow}>
              <Ionicons name="briefcase" size={12} color={Colors.primary} />
              <Text style={styles.jobLabel} numberOfLines={1}>{item.jobTitle}</Text>
            </View>
            <View style={styles.messageRow}>
              {lastMessage ? (
                <Text
                  style={[styles.lastMessage, unreadCount > 0 && styles.unreadMessage]}
                  numberOfLines={1}
                >
                  {lastMessage.sender === 'user' ? 'You: ' : ''}
                  {lastMessage.text}
                </Text>
              ) : (
                <Text style={styles.lastMessage}>Tap to start chatting...</Text>
              )}
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SwipeNavigator>
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('messages')}</Text>
        <View style={styles.headerActions}>
          {hasConversations && (
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery('');
              }}
            >
              <Ionicons name={showSearch ? 'close' : 'search-outline'} size={22} color={Colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && hasConversations && (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textMuted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, job, or message..."
              placeholderTextColor={Colors.textMuted}
              style={styles.searchInput}
              autoFocus
              selectionColor={Colors.primary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}

      {hasConversations ? (
        <>
          {/* Active Conversations Count */}
          <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.countBar}>
            <View style={styles.countPill}>
              <Ionicons name="chatbubbles" size={14} color={Colors.primary} />
              <Text style={styles.countText}>
                {searchQuery.trim()
                  ? `${filteredConversations.length} of ${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
                  : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
                }
              </Text>
            </View>
          </Animated.View>

          {/* Conversation List */}
          {filteredConversations.length > 0 ? (
            <FlatList
              data={filteredConversations}
              keyExtractor={(item) => item.id}
              renderItem={renderConversationItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={40} color={Colors.textMuted + '60'} />
              <Text style={styles.noResultsTitle}>No matches found</Text>
              <Text style={styles.noResultsSubtitle}>Try a different search term</Text>
            </View>
          )}
        </>
      ) : (
        /* Empty state */
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
              When you message a job manager, your{'\n'}conversations will appear here
            </Text>
          </Animated.View>

          {/* CTA */}
          <Animated.View entering={FadeInUp.delay(800).duration(500)}>
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/jobs')}
            >
              <Ionicons name="briefcase-outline" size={18} color={Colors.primary} />
              <Text style={styles.ctaText}>Browse Jobs</Text>
            </TouchableOpacity>
          </Animated.View>
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
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Count bar
  countBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  // Conversation list
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  unreadCard: {
    backgroundColor: '#F8FAFF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '15',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  conversationContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  managerName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  unreadName: {
    fontWeight: '800',
  },
  timeText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  unreadTime: {
    color: Colors.primary,
    fontWeight: '600',
  },
  jobRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  jobLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    flex: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
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
