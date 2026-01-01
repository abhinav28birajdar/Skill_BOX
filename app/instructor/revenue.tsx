/**
 * Instructor Revenue Dashboard
 * Features: Earnings overview, charts, withdrawals
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PERIOD_TABS = ['Week', 'Month', 'Year', 'All Time'];

const EARNINGS_DATA = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 3200 },
  { month: 'Mar', amount: 2800 },
  { month: 'Apr', amount: 4500 },
  { month: 'May', amount: 5200 },
  { month: 'Jun', amount: 6800 },
];

const TRANSACTIONS = [
  { id: 1, type: 'sale', course: 'React Native Masterclass', student: 'Sarah Johnson', amount: 49.99, date: '2024-03-15', status: 'completed' },
  { id: 2, type: 'sale', course: 'Advanced TypeScript', student: 'Mike Chen', amount: 39.99, date: '2024-03-14', status: 'completed' },
  { id: 3, type: 'withdrawal', description: 'Bank Transfer', amount: -500.00, date: '2024-03-13', status: 'processing' },
  { id: 4, type: 'sale', course: 'React Native Masterclass', student: 'Emma Wilson', amount: 49.99, date: '2024-03-12', status: 'completed' },
  { id: 5, type: 'refund', course: 'Advanced TypeScript', student: 'David Brown', amount: -39.99, date: '2024-03-11', status: 'completed' },
];

export default function InstructorRevenueScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  const maxAmount = Math.max(...EARNINGS_DATA.map((d) => d.amount));
  const chartHeight = 200;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revenue Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.balanceCard}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.balanceGradient}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TouchableOpacity style={styles.eyeButton}>
                <Ionicons name="eye-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>$12,450.50</Text>
            <Text style={styles.balancePending}>$850.25 pending</Text>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
              <Ionicons name="arrow-forward" size={16} color="#10B981" />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="trending-up" size={24} color="#10B981" />
            </View>
            <Text style={styles.statValue}>$5,240</Text>
            <Text style={styles.statLabel}>This Month</Text>
            <View style={styles.statChange}>
              <Ionicons name="arrow-up" size={12} color="#10B981" />
              <Text style={styles.statChangeText}>+12.5%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(250)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="cart" size={24} color="#6366F1" />
            </View>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Sales</Text>
            <View style={styles.statChange}>
              <Ionicons name="arrow-up" size={12} color="#10B981" />
              <Text style={styles.statChangeText}>+8.3%</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="cash" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>$36.90</Text>
            <Text style={styles.statLabel}>Avg. Sale</Text>
            <View style={styles.statChange}>
              <Ionicons name="arrow-down" size={12} color="#EF4444" />
              <Text style={[styles.statChangeText, { color: '#EF4444' }]}>-2.1%</Text>
            </View>
          </Animated.View>
        </View>

        {/* Period Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PERIOD_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedPeriod === tab && styles.tabActive]}
                onPress={() => setSelectedPeriod(tab)}
              >
                <Text style={[styles.tabText, selectedPeriod === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Earnings Chart */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Earnings Overview</Text>
            <Text style={styles.chartAmount}>$25,940</Text>
          </View>
          <View style={styles.chart}>
            {EARNINGS_DATA.map((data, index) => {
              const barHeight = (data.amount / maxAmount) * chartHeight;
              return (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.chartBarContainer}>
                    <LinearGradient
                      colors={['#6366F1', '#8B5CF6']}
                      style={[styles.chartBarFill, { height: barHeight }]}
                    />
                  </View>
                  <Text style={styles.chartBarLabel}>{data.month}</Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((transaction, index) => (
            <Animated.View
              key={transaction.id}
              entering={FadeInDown.delay(400 + index * 100)}
              style={styles.transactionCard}
            >
              <View
                style={[
                  styles.transactionIcon,
                  {
                    backgroundColor:
                      transaction.type === 'sale'
                        ? '#D1FAE5'
                        : transaction.type === 'withdrawal'
                        ? '#DBEAFE'
                        : '#FEE2E2',
                  },
                ]}
              >
                <Ionicons
                  name={
                    transaction.type === 'sale'
                      ? 'arrow-down'
                      : transaction.type === 'withdrawal'
                      ? 'arrow-up'
                      : 'refresh'
                  }
                  size={20}
                  color={
                    transaction.type === 'sale'
                      ? '#10B981'
                      : transaction.type === 'withdrawal'
                      ? '#3B82F6'
                      : '#EF4444'
                  }
                />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>
                  {transaction.type === 'withdrawal'
                    ? transaction.description
                    : transaction.course}
                </Text>
                {transaction.student && (
                  <Text style={styles.transactionStudent}>{transaction.student}</Text>
                )}
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>

              <View style={styles.transactionAmount}>
                <Text
                  style={[
                    styles.transactionAmountText,
                    {
                      color:
                        transaction.amount > 0
                          ? '#10B981'
                          : transaction.type === 'withdrawal'
                          ? '#3B82F6'
                          : '#EF4444',
                    },
                  ]}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        transaction.status === 'completed' ? '#D1FAE5' : '#FEF3C7',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: transaction.status === 'completed' ? '#10B981' : '#F59E0B',
                      },
                    ]}
                  >
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
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
  balanceCard: { margin: 20, borderRadius: 24, overflow: 'hidden' },
  balanceGradient: { padding: 24 },
  balanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  balanceLabel: { fontSize: 15, fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)' },
  eyeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  balanceAmount: { fontSize: 40, fontWeight: '800', color: '#fff', marginBottom: 8 },
  balancePending: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 20 },
  withdrawButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 16 },
  withdrawButtonText: { fontSize: 15, fontWeight: '800', color: '#10B981' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  statIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginBottom: 8 },
  statChange: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statChangeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  tabsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tab: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 12, marginRight: 8 },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  chartCard: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  chartAmount: { fontSize: 20, fontWeight: '800', color: '#6366F1' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 220 },
  chartBar: { flex: 1, alignItems: 'center' },
  chartBarContainer: { flex: 1, width: '100%', justifyContent: 'flex-end', paddingHorizontal: 4 },
  chartBarFill: { width: '100%', borderRadius: 8 },
  chartBarLabel: { fontSize: 11, fontWeight: '700', color: '#6B7280', marginTop: 8 },
  transactionsSection: { paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  seeAllText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  transactionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12 },
  transactionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  transactionStudent: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  transactionDate: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  transactionAmount: { alignItems: 'flex-end' },
  transactionAmountText: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },
  bottomSpacing: { height: 20 },
});
