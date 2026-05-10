import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';

export default function HelpScreen() {
  const router = useRouter();

  const faqItems = [
    { q: 'How do I apply for a job?', a: 'Browse jobs from the Home or Jobs tab, tap on a job card, and click "Apply Now" to submit your application.' },
    { q: 'How do I update my skills?', a: 'Go to Profile → Edit Profile to update your skills and other information.' },
    { q: 'Is the app free to use?', a: 'Yes! Work Bandhu is completely free for workers to find and apply for jobs.' },
    { q: 'How do I contact an employer?', a: 'Once your application is accepted, you will receive the employer\'s contact details in the Messages tab.' },
    { q: 'How do I change app language?', a: 'Go to Settings → App Language to change the language.' },
  ];

  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Contact options */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:+911234567890')}>
              <View style={[styles.contactIcon, { backgroundColor: '#4CAF5015' }]}>
                <Ionicons name="call" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.contactLabel}>Call Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:support@workbandhu.com')}>
              <View style={[styles.contactIcon, { backgroundColor: Colors.primary + '15' }]}>
                <Ionicons name="mail" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.contactLabel}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/911234567890')}>
              <View style={[styles.contactIcon, { backgroundColor: '#25D36615' }]}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </View>
              <Text style={styles.contactLabel}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.faqItem, index < faqItems.length - 1 && styles.faqBorder]}
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.q}</Text>
                  <Ionicons
                    name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.textMuted}
                  />
                </View>
                {expandedFaq === index && (
                  <Text style={styles.faqAnswer}>{item.a}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
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
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8,
  },
  contactRow: {
    flexDirection: 'row', gap: 12, marginBottom: 24,
  },
  contactCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 10, ...Shadows.small,
  },
  contactIcon: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  contactLabel: { fontSize: 13, fontWeight: '600', color: Colors.text },
  faqContainer: {
    backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', ...Shadows.small,
  },
  faqItem: { paddingHorizontal: 16, paddingVertical: 14 },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  faqHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1, marginRight: 8 },
  faqAnswer: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginTop: 8 },
});
