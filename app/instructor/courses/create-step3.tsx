/**
 * Course Creation Wizard - Step 3: Pricing & Settings
 * Features: Set price, discounts, enrollment options
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateCourseStep3Screen() {
  const router = useRouter();
  const [price, setPrice] = useState('49.99');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowRefunds, setAllowRefunds] = useState(true);
  const [selectedPricing, setSelectedPricing] = useState<'free' | 'paid' | 'subscription'>('paid');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Course</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepCompleted]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <View style={styles.progressLine} />
          <View style={[styles.step, styles.stepActive]}>
            <Text style={styles.stepNumber}>3</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
          </View>
          <View style={[styles.progressLine, styles.progressLineInactive]} />
          <View style={styles.step}>
            <Text style={styles.stepNumber}>5</Text>
          </View>
        </View>
        <Text style={styles.progressTitle}>Step 3 of 5: Pricing & Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pricing Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Model</Text>
          <View style={styles.pricingOptions}>
            <TouchableOpacity
              style={[styles.pricingCard, selectedPricing === 'free' && styles.pricingCardActive]}
              onPress={() => setSelectedPricing('free')}
            >
              <Ionicons
                name={selectedPricing === 'free' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedPricing === 'free' ? '#6366F1' : '#9CA3AF'}
              />
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>Free</Text>
                <Text style={styles.pricingSubtitle}>Accessible to everyone</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pricingCard, selectedPricing === 'paid' && styles.pricingCardActive]}
              onPress={() => setSelectedPricing('paid')}
            >
              <Ionicons
                name={selectedPricing === 'paid' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedPricing === 'paid' ? '#6366F1' : '#9CA3AF'}
              />
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>One-Time Payment</Text>
                <Text style={styles.pricingSubtitle}>Students pay once to access</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.pricingCard, selectedPricing === 'subscription' && styles.pricingCardActive]}
              onPress={() => setSelectedPricing('subscription')}
            >
              <Ionicons
                name={selectedPricing === 'subscription' ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedPricing === 'subscription' ? '#6366F1' : '#9CA3AF'}
              />
              <View style={styles.pricingInfo}>
                <Text style={styles.pricingTitle}>Subscription</Text>
                <Text style={styles.pricingSubtitle}>Monthly recurring payment</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Input */}
        {selectedPricing !== 'free' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
            <Text style={styles.hint}>Platform fee: 20% • You earn: ${(parseFloat(price) * 0.8).toFixed(2)}</Text>
          </View>
        )}

        {/* Discount */}
        {selectedPricing === 'paid' && (
          <View style={styles.section}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Promotional Discount</Text>
                <Text style={styles.settingSubtitle}>Offer a limited-time discount</Text>
              </View>
              <Switch value={hasDiscount} onValueChange={setHasDiscount} />
            </View>

            {hasDiscount && (
              <View style={styles.discountContainer}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.currencySymbol}>$</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={discountPrice}
                    onChangeText={setDiscountPrice}
                    keyboardType="decimal-pad"
                    placeholder="29.99"
                  />
                </View>
                <Text style={styles.hint}>
                  Save {((1 - parseFloat(discountPrice) / parseFloat(price)) * 100).toFixed(0)}%
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Private Course</Text>
                <Text style={styles.settingSubtitle}>Only accessible via direct link</Text>
              </View>
              <Switch value={isPrivate} onValueChange={setIsPrivate} />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Allow Refunds</Text>
                <Text style={styles.settingSubtitle}>30-day money-back guarantee</Text>
              </View>
              <Switch value={allowRefunds} onValueChange={setAllowRefunds} />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveDraftButton}>
          <Text style={styles.saveDraftText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/instructor/courses/create-step4')}
        >
          <LinearGradient
            colors={['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  progressContainer: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  progressSteps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  step: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepCompleted: { backgroundColor: '#10B981' },
  stepActive: { backgroundColor: '#6366F1' },
  stepNumber: { fontSize: 14, fontWeight: '800', color: '#6B7280' },
  progressLine: { width: 32, height: 2, backgroundColor: '#10B981' },
  progressLineInactive: { backgroundColor: '#E5E7EB' },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  content: { flex: 1 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  pricingOptions: { gap: 12 },
  pricingCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', gap: 12 },
  pricingCardActive: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  pricingInfo: { flex: 1 },
  pricingTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  pricingSubtitle: { fontSize: 13, color: '#6B7280' },
  priceInputContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  currencySymbol: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginRight: 8 },
  priceInput: { flex: 1, fontSize: 24, fontWeight: '800', color: '#1F2937' },
  hint: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingInfo: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  settingSubtitle: { fontSize: 13, color: '#6B7280' },
  settingCard: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 },
  discountContainer: { marginTop: 16 },
  bottomSpacing: { height: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  saveDraftButton: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12 },
  saveDraftText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  continueButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  continueGradient: { flexDirection: 'row', paddingVertical: 14, justifyContent: 'center', alignItems: 'center', gap: 8 },
  continueText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
