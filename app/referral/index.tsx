/**
 * Referral & Rewards Page
 * Features: Invite friends, track referrals, earn rewards
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const REFERRAL_CODE = 'SKILLBOX2024';
const REFERRAL_STATS = {
  totalReferrals: 12,
  successfulReferrals: 8,
  pendingReferrals: 4,
  totalEarnings: 240,
};

const REWARDS = [
  { id: 1, title: '$10 Course Credit', description: 'For each friend who signs up', icon: 'gift-outline', color: '#6366F1' },
  { id: 2, title: '$20 Bonus', description: 'When your friend enrolls in a course', icon: 'cash-outline', color: '#10B981' },
  { id: 3, title: 'Premium Month Free', description: 'Refer 5 friends successfully', icon: 'star-outline', color: '#F59E0B' },
];

const REFERRAL_HISTORY = [
  { id: 1, name: 'Sarah Chen', email: 's***@example.com', status: 'completed', date: '2024-01-15', reward: 30 },
  { id: 2, name: 'Marcus Johnson', email: 'm***@example.com', status: 'completed', date: '2024-01-10', reward: 30 },
  { id: 3, name: 'Emma Wilson', email: 'e***@example.com', status: 'pending', date: '2024-01-08', reward: 0 },
];

export default function ReferralScreen() {
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on SkillBox and get $10 off your first course! Use my referral code: ${REFERRAL_CODE}\n\nhttps://skillbox.app/invite/${REFERRAL_CODE}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Referral Card */}
        <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.referralCard}>
          <View style={styles.referralHeader}>
            <Ionicons name="gift" size={48} color="#fff" />
            <Text style={styles.referralTitle}>Invite Friends & Earn Rewards</Text>
            <Text style={styles.referralSubtitle}>
              Share your unique referral code and earn $30 for every friend who enrolls!
            </Text>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your Referral Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{REFERRAL_CODE}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <View style={styles.shareButtonContent}>
              <Ionicons name="share-social" size={20} color="#6366F1" />
              <Text style={styles.shareButtonText}>Share Invite Link</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <Text style={styles.statValue}>{REFERRAL_STATS.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referrals</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <Text style={styles.statValue}>{REFERRAL_STATS.successfulReferrals}</Text>
            <Text style={styles.statLabel}>Successful</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>${REFERRAL_STATS.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </Animated.View>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsList}>
            {REWARDS.map((reward, index) => (
              <Animated.View key={reward.id} entering={FadeInDown.delay(index * 100)} style={styles.rewardCard}>
                <View style={[styles.rewardIcon, { backgroundColor: `${reward.color}15` }]}>
                  <Ionicons name={reward.icon as any} size={28} color={reward.color} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <Text style={styles.rewardDescription}>{reward.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Referral History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Referral History</Text>
          <View style={styles.historyList}>
            {REFERRAL_HISTORY.map((referral, index) => (
              <Animated.View key={referral.id} entering={FadeInDown.delay(index * 100)} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyIcon}>
                    <Ionicons
                      name={referral.status === 'completed' ? 'checkmark-circle' : 'time-outline'}
                      size={24}
                      color={referral.status === 'completed' ? '#10B981' : '#F59E0B'}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyName}>{referral.name}</Text>
                    <Text style={styles.historyEmail}>{referral.email}</Text>
                  </View>
                  <View style={styles.historyRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: referral.status === 'completed' ? '#D1FAE5' : '#FEF3C7' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: referral.status === 'completed' ? '#10B981' : '#F59E0B' },
                        ]}
                      >
                        {referral.status}
                      </Text>
                    </View>
                    {referral.reward > 0 && <Text style={styles.historyReward}>+${referral.reward}</Text>}
                  </View>
                </View>
                <Text style={styles.historyDate}>{referral.date}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsCard}>
          <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
          <Text style={styles.termsText}>
            Referral rewards are credited within 7 days after your friend's successful enrollment. See full terms
            and conditions.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  referralCard: { margin: 20, padding: 24, borderRadius: 20 },
  referralHeader: { alignItems: 'center', marginBottom: 24 },
  referralTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginTop: 16, marginBottom: 8 },
  referralSubtitle: { fontSize: 14, color: '#E0E7FF', textAlign: 'center', lineHeight: 20 },
  codeContainer: { marginBottom: 16 },
  codeLabel: { fontSize: 13, fontWeight: '700', color: '#E0E7FF', marginBottom: 8, textAlign: 'center' },
  codeBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 20, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  codeText: { fontSize: 24, fontWeight: '800', color: '#6366F1', letterSpacing: 2 },
  copyButton: { padding: 8 },
  shareButton: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  shareButtonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  shareButtonText: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  stepsList: { gap: 12 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  rewardIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  rewardDescription: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  historyList: { gap: 12 },
  historyCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  historyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  historyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  historyInfo: { flex: 1 },
  historyName: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  historyEmail: { fontSize: 13, color: '#6B7280' },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  historyReward: { fontSize: 16, fontWeight: '800', color: '#10B981' },
  historyDate: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  termsCard: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 20, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, gap: 12 },
  termsText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },
  bottomSpacing: { height: 40 },
});
