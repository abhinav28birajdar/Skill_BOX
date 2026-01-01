/**
 * Course Enrollment Confirmation Page
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EnrollmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [couponCode, setCouponCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const coursePrice = 89.99;
  const discount = couponCode ? 10 : 0;
  const total = coursePrice - discount;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enrollment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Course Summary */}
        <View style={styles.card}>
          <Image source={{ uri: 'https://via.placeholder.com/120x68/667eea/ffffff?text=Course' }} style={styles.courseImage} />
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle} numberOfLines={2}>Complete React Native Development</Text>
            <Text style={styles.instructor}>by Sarah Wilson</Text>
            <View style={styles.courseStats}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.statText}>4.9 (12.5k)</Text>
              <Text style={styles.statDivider}>•</Text>
              <Text style={styles.statText}>32 hours</Text>
            </View>
          </View>
        </View>

        {/* Coupon Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.couponContainer}>
            <TextInput
              style={styles.couponInput}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[styles.paymentOption, selectedPayment === 'card' && styles.paymentOptionActive]}
            onPress={() => setSelectedPayment('card')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.radio, selectedPayment === 'card' && styles.radioActive]}>
                {selectedPayment === 'card' && <View style={styles.radioDot} />}
              </View>
              <Ionicons name="card-outline" size={24} color="#6366F1" />
              <Text style={styles.paymentText}>Credit / Debit Card</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, selectedPayment === 'paypal' && styles.paymentOptionActive]}
            onPress={() => setSelectedPayment('paypal')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.radio, selectedPayment === 'paypal' && styles.radioActive]}>
                {selectedPayment === 'paypal' && <View style={styles.radioDot} />}
              </View>
              <Ionicons name="logo-paypal" size={24} color="#003087" />
              <Text style={styles.paymentText}>PayPal</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, selectedPayment === 'google' && styles.paymentOptionActive]}
            onPress={() => setSelectedPayment('google')}
          >
            <View style={styles.paymentLeft}>
              <View style={[styles.radio, selectedPayment === 'google' && styles.radioActive]}>
                {selectedPayment === 'google' && <View style={styles.radioDot} />}
              </View>
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text style={styles.paymentText}>Google Pay</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Course Price</Text>
              <Text style={styles.summaryValue}>${coursePrice.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.termsText}>
            By enrolling, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.enrollButton} onPress={() => router.push('/courses/payment')}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.enrollGradient}>
            <Text style={styles.enrollText}>Complete Enrollment</Text>
            <Text style={styles.enrollSubtext}>${total.toFixed(2)}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1 },
  card: { flexDirection: 'row', margin: 20, padding: 16, backgroundColor: '#fff', borderRadius: 12, gap: 12 },
  courseImage: { width: 120, height: 68, borderRadius: 8 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  instructor: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  courseStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, color: '#6B7280' },
  statDivider: { color: '#D1D5DB', marginHorizontal: 4 },
  section: { marginBottom: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  couponContainer: { flexDirection: 'row', gap: 8 },
  couponInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', fontSize: 14 },
  applyButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#6366F1', borderRadius: 12, justifyContent: 'center' },
  applyText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  paymentOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  paymentOptionActive: { borderColor: '#6366F1' },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: '#6366F1' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366F1' },
  paymentText: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  summaryCard: { padding: 16, backgroundColor: '#fff', borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  discountText: { color: '#10B981' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
  termsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, alignItems: 'flex-start' },
  termsText: { flex: 1, fontSize: 12, color: '#6B7280', lineHeight: 18 },
  link: { color: '#6366F1', fontWeight: '600' },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  enrollButton: { borderRadius: 12, overflow: 'hidden' },
  enrollGradient: { paddingVertical: 16, alignItems: 'center' },
  enrollText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  enrollSubtext: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 },
});
