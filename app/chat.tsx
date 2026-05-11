import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useApp, Message } from '@/context/AppContext';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ conversationId: string }>();
  const { conversations, sendMessage, userName } = useApp();
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const conversation = conversations.find(c => c.id === params.conversationId);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (conversation && conversation.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation?.messages.length]);

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Conversation Not Found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    sendMessage(conversation.id, text, 'user');
    setInputText('');

    // Simulate manager reply after a short delay
    setTimeout(() => {
      const replies = getManagerReply(text, conversation.jobTitle);
      sendMessage(conversation.id, replies, 'manager');
    }, 1000 + Math.random() * 2000);
  };

  const getManagerReply = (userMsg: string, jobTitle: string): string => {
    const lowerMsg = userMsg.toLowerCase();
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg.includes('namaste')) {
      return `Hello! Thanks for reaching out about the ${jobTitle} position. How can I help you? 😊`;
    }
    if (lowerMsg.includes('salary') || lowerMsg.includes('pay') || lowerMsg.includes('money') || lowerMsg.includes('compensation')) {
      return `The salary for ${jobTitle} is competitive and based on experience. We can discuss the specifics during the interview. Would you like to schedule one?`;
    }
    if (lowerMsg.includes('time') || lowerMsg.includes('shift') || lowerMsg.includes('hour') || lowerMsg.includes('schedule')) {
      return `Working hours are flexible. We typically have morning (8AM-4PM) and evening (2PM-10PM) shifts. Which would suit you better?`;
    }
    if (lowerMsg.includes('experience') || lowerMsg.includes('qualification') || lowerMsg.includes('skill')) {
      return `We're looking for candidates with relevant experience, but we also welcome freshers who are eager to learn. What's your background?`;
    }
    if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where')) {
      return `Our work site is easily accessible by public transport. I can share the exact location once we schedule an interview. Shall we proceed?`;
    }
    if (lowerMsg.includes('start') || lowerMsg.includes('join') || lowerMsg.includes('when')) {
      return `We're looking for someone to start as soon as possible. If you're selected, you could begin within a week. Are you available?`;
    }
    if (lowerMsg.includes('interested') || lowerMsg.includes('apply') || lowerMsg.includes('want')) {
      return `Great to hear you're interested in the ${jobTitle} role! 🎉 Can you share your experience details? We'd love to schedule an interview with you.`;
    }
    if (lowerMsg.includes('interview') || lowerMsg.includes('meeting') || lowerMsg.includes('visit')) {
      return `We can schedule an interview at your convenience. Would tomorrow or the day after work for you? We're available between 10AM-5PM.`;
    }
    if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
      return `You're welcome! Feel free to ask if you have any more questions. We look forward to meeting you! 🙏`;
    }
    
    // Default responses
    const defaults = [
      `Thanks for your interest in the ${jobTitle} position! Would you like to know more about the role or schedule an interview?`,
      `That's a great question! Let me get back to you with more details. In the meantime, feel free to ask anything else about the ${jobTitle} role.`,
      `I appreciate your message! We're actively hiring for ${jobTitle}. Would you like to discuss the role further or schedule a visit?`,
      `Thank you for reaching out! The ${jobTitle} position is still open. What specific information would help you make a decision?`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.sender === 'user';
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <Animated.View
        entering={isUser ? SlideInRight.delay(50).duration(300) : SlideInLeft.delay(50).duration(300)}
        style={[
          styles.messageBubbleContainer,
          isUser ? styles.userBubbleContainer : styles.managerBubbleContainer,
        ]}
      >
        {!isUser && (
          <View style={styles.managerAvatarSmall}>
            <Ionicons name="person" size={14} color={Colors.primary} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.managerBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.managerMessageText,
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            isUser ? styles.userMessageTime : styles.managerMessageTime,
          ]}>
            {time}
            {isUser && (
              <Text> {item.read ? '✓✓' : '✓'}</Text>
            )}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.chatHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerProfile} activeOpacity={0.7}>
          <View style={styles.headerAvatar}>
            <Ionicons name="person" size={20} color={Colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{conversation.managerName}</Text>
            <View style={styles.headerSubRow}>
              <View style={styles.activeDot} />
              <Text style={styles.headerJobTitle} numberOfLines={1}>
                Re: {conversation.jobTitle}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Job Context Banner */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.jobBanner}>
        <Ionicons name="briefcase" size={16} color={Colors.primary} />
        <Text style={styles.jobBannerText} numberOfLines={1}>
          {conversation.jobTitle} at {conversation.companyName}
        </Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/job-detail', params: { jobId: conversation.jobId } })}
        >
          <Text style={styles.viewJobText}>View</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Messages List */}
      <KeyboardAvoidingView
        style={styles.chatBody}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {conversation.messages.length === 0 ? (
          <View style={styles.emptyChat}>
            <View style={styles.emptyChatIcon}>
              <Ionicons name="chatbubbles-outline" size={48} color={Colors.primary + '40'} />
            </View>
            <Text style={styles.emptyChatTitle}>Start the conversation!</Text>
            <Text style={styles.emptyChatSubtitle}>
              Say hi to the hiring manager and express your interest in this role
            </Text>
            {/* Quick message suggestions */}
            <View style={styles.quickMessages}>
              {[
                `Hi! I'm interested in the ${conversation.jobTitle} position.`,
                'What are the working hours?',
                'Can you tell me more about the salary?',
                'I have experience in this field.',
              ].map((msg, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickMsgBtn}
                  onPress={() => {
                    sendMessage(conversation.id, msg, 'user');
                    setTimeout(() => {
                      const reply = getManagerReply(msg, conversation.jobTitle);
                      sendMessage(conversation.id, reply, 'manager');
                    }, 1000 + Math.random() * 2000);
                  }}
                >
                  <Text style={styles.quickMsgText}>{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={conversation.messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.textMuted} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textMuted}
              style={styles.textInput}
              multiline
              maxLength={500}
              selectionColor={Colors.primary}
            />
            <TouchableOpacity style={styles.emojiBtn}>
              <Ionicons name="happy-outline" size={22} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.sendBtn,
              inputText.trim().length > 0 && styles.sendBtnActive,
            ]}
            onPress={handleSend}
            disabled={inputText.trim().length === 0}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim().length > 0 ? '#fff' : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  // Chat Header
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '20',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.success,
  },
  headerJobTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Job Banner
  jobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EEF3FF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '15',
  },
  jobBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  viewJobText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  // Chat Body
  chatBody: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  userBubbleContainer: {
    justifyContent: 'flex-end',
  },
  managerBubbleContainer: {
    justifyContent: 'flex-start',
  },
  managerAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  managerBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    ...Shadows.small,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#fff',
  },
  managerMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.6)',
  },
  managerMessageTime: {
    color: Colors.textMuted,
  },
  // Empty chat
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  emptyChatIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyChatTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyChatSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  quickMessages: {
    width: '100%',
    gap: 8,
  },
  quickMsgBtn: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    ...Shadows.small,
  },
  quickMsgText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    lineHeight: 18,
  },
  // Input Bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  attachBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F0F2F5',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 42,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 6,
    lineHeight: 20,
  },
  emojiBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
    ...Shadows.medium,
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
