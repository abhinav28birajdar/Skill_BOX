/**
 * Payment Methods Page
 * Features: Manage payment methods, transaction history
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYMENT_METHODS = [
  { id: 1, type: 'card', brand: 'visa', last4: '4242', expiry: '12/25', isDefault: true },
  { id: 2, type: 'card', brand: 'mastercard', last4: '5555', expiry: '08/24', isDefault: false },
  { id: 3, type: 'paypal', email: 'user@example.com', isDefault: false },
];

const TRANSACTIONS = [
  { id: 1, course: 'React Native Masterclass', amount: 49.99, date: '2024-01-15', status: 'completed', invoice: '#INV-1234' },
  { id: 2, course: 'Advanced TypeScript', amount: 39.99, date: '2024-01-10', status: 'completed', invoice: '#INV-1233' },
  { id: 3, course: 'UI/UX Design Pro', amount: 59.99, date: '2024-01-05', status: 'completed', invoice: '#INV-1232' },
  { id: 4, course: 'Python for Data Science', amount: 44.99, date: '2023-12-28', status: 'refunded', invoice: '#INV-1231' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('methods');
  const [showAddCard, setShowAddCard] = useState(false);

  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return 'card';
      case 'mastercard': return 'card';
      case 'amex': return 'card';
      default: return 'card-outline';
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
        <Text style={styles.headerTitle}>Payment & Billing</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'methods' && styles.tabActive]}
          onPress={() => setActiveTab('methods')}
        >
          <Text style={[styles.tabText, activeTab === 'methods' && styles.tabTextActive]}>
            Payment Methods
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            Transaction History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'methods' ? (
          <>
            {/* Payment Methods */}
            <View style={styles.section}>
              {PAYMENT_METHODS.map((method, index) => (
                <Animated.View key={method.id} entering={FadeInDown.delay(index * 100)} style={styles.methodCard}>
                  {method.type === 'card' ? (
                    <>
                      <View style={styles.methodHeader}>
                        <View style={styles.methodIcon}>
                          <Ionicons name={getCardIcon(method.brand)} size={24} color="#6366F1" />
                        </View>
                        <View style={styles.methodInfo}>
                          <Text style={styles.methodTitle}>
                            {method.brand.toUpperCase()} •••• {method.last4}
                          </Text>
                          <Text style={styles.methodSubtitle}>Expires {method.expiry}</Text>
                        </View>
                        {method.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.methodActions}>
                        {!method.isDefault && (
                          <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Set as Default</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionTextDanger}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.methodHeader}>
                        <View style={styles.methodIcon}>
                          <Ionicons name="logo-paypal" size={24} color="#0070BA" />
                        </View>
                        <View style={styles.methodInfo}>
                          <Text style={styles.methodTitle}>PayPal</Text>
                          <Text style={styles.methodSubtitle}>{method.email}</Text>
                        </View>
                        {method.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.methodActions}>
                        {!method.isDefault && (
                          <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionText}>Set as Default</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.actionButton}>
                          <Text style={styles.actionTextDanger}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Animated.View>
              ))}
            </View>

            {/* Add Payment Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddCard(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#6366F1" />
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Transaction History */}
            <View style={styles.section}>
              {TRANSACTIONS.map((transaction, index) => (
                <Animated.View
                  key={transaction.id}
                  entering={FadeInDown.delay(index * 100)}
                  style={styles.transactionCard}
                >
                  <View style={styles.transactionHeader}>
                    <View style={styles.transactionIcon}>
                      <Ionicons
                        name={transaction.status === 'refunded' ? 'arrow-undo' : 'checkmark-circle'}
                        size={24}
                        color={transaction.status === 'refunded' ? '#EF4444' : '#10B981'}
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{transaction.course}</Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                    <View>
                      <Text style={styles.transactionAmount}>
                        {transaction.status === 'refunded' ? '-' : ''}${transaction.amount}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: transaction.status === 'refunded' ? '#FEE2E2' : '#D1FAE5' },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: transaction.status === 'refunded' ? '#EF4444' : '#10B981' },
                          ]}
                        >
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.transactionFooter}>
                    <Text style={styles.invoiceText}>{transaction.invoice}</Text>
                    <TouchableOpacity style={styles.downloadButton}>
                      <Ionicons name="download-outline" size={16} color="#6366F1" />
                      <Text style={styles.downloadText}>Download Invoice</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          </>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Card Modal */}
      <Modal visible={showAddCard} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowAddCard(false)}>
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" />
              <View style={styles.inputRow}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="MM/YY" />
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVV" keyboardType="numeric" />
              </View>
              <TextInput style={styles.input} placeholder="Cardholder Name" />
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveGradient}
              >
                <Text style={styles.saveText}>Add Card</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  tabs: { flexDirection: 'row', padding: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#fff' },
  tabActive: { backgroundColor: '#6366F1' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  content: { flex: 1 },
  section: { paddingHorizontal: 20, gap: 12 },
  methodCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  methodHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  methodIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  methodInfo: { flex: 1 },
  methodTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  methodSubtitle: { fontSize: 13, color: '#6B7280' },
  defaultBadge: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#D1FAE5', borderRadius: 12 },
  defaultText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  methodActions: { flexDirection: 'row', gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  actionButton: { flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8 },
  actionText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
  actionTextDanger: { fontSize: 13, fontWeight: '700', color: '#EF4444' },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 12, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 16, gap: 8 },
  addButtonText: { fontSize: 15, fontWeight: '700', color: '#6366F1' },
  transactionCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  transactionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  transactionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionInfo: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  transactionDate: { fontSize: 13, color: '#6B7280' },
  transactionAmount: { fontSize: 16, fontWeight: '800', color: '#1F2937', textAlign: 'right', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  transactionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  invoiceText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  downloadButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  downloadText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  modalBody: { gap: 12, marginBottom: 20 },
  input: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 15, color: '#1F2937' },
  inputRow: { flexDirection: 'row', gap: 12 },
  saveButton: { borderRadius: 12, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  bottomSpacing: { height: 40 },
});
