/**
 * About SkillBox Page
 * Features: App information, version, team
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const FEATURES = [
  { id: 1, icon: 'book-outline', title: 'Expert-Led Courses', description: '1000+ courses taught by industry experts' },
  { id: 2, icon: 'people-outline', title: 'Community', description: 'Join 100K+ active learners worldwide' },
  { id: 3, icon: 'trophy-outline', title: 'Certifications', description: 'Earn recognized certificates' },
  { id: 4, icon: 'sparkles-outline', title: 'AI-Powered', description: 'Personalized learning with AI tutors' },
];

const TEAM_LINKS = [
  { id: 1, icon: 'globe-outline', label: 'Website', value: 'skillbox.app' },
  { id: 2, icon: 'mail-outline', label: 'Email', value: 'hello@skillbox.app' },
  { id: 3, icon: 'logo-twitter', label: 'Twitter', value: '@skillboxapp' },
  { id: 4, icon: 'logo-linkedin', label: 'LinkedIn', value: 'SkillBox' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About SkillBox</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.logoCard}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.logoGradient}>
            <Ionicons name="school" size={64} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>SkillBox</Text>
          <Text style={styles.tagline}>Learn Anything, Anywhere, Anytime</Text>
          <Text style={styles.version}>Version 2.0.1 (Build 45)</Text>
        </Animated.View>

        {/* Mission */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            SkillBox is dedicated to making quality education accessible to everyone. We believe in the
            power of learning to transform lives and create opportunities. Our platform connects learners
            with world-class instructors and cutting-edge content to help you achieve your goals.
          </Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose SkillBox</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <Animated.View
                key={feature.id}
                entering={FadeInDown.delay(300 + index * 100)}
                style={styles.featureCard}
              >
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={28} color="#6366F1" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Connect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.linksCard}>
            {TEAM_LINKS.map((link) => (
              <TouchableOpacity key={link.id} style={styles.linkRow}>
                <View style={styles.linkIcon}>
                  <Ionicons name={link.icon as any} size={20} color="#6366F1" />
                </View>
                <View style={styles.linkInfo}>
                  <Text style={styles.linkLabel}>{link.label}</Text>
                  <Text style={styles.linkValue}>{link.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.linksCard}>
            <TouchableOpacity style={styles.linkRow}>
              <Text style={styles.legalLink}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkRow, styles.linkRowBorder]}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.linkRow, styles.linkRowBorder]}>
              <Text style={styles.legalLink}>Licenses</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Made with ❤️ by the SkillBox Team</Text>
        <Text style={styles.copyright}>© 2024 SkillBox. All rights reserved.</Text>

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
  logoCard: { alignItems: 'center', padding: 40, backgroundColor: '#fff', marginBottom: 2 },
  logoGradient: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  appName: { fontSize: 32, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  tagline: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  version: { fontSize: 13, fontWeight: '600', color: '#9CA3AF' },
  section: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  missionText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '48%', padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12 },
  featureIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  featureTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  featureDescription: { fontSize: 13, color: '#6B7280', lineHeight: 18 },
  linksCard: { backgroundColor: '#F9FAFB', borderRadius: 16, overflow: 'hidden' },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  linkRowBorder: { borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  linkIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  linkInfo: { flex: 1 },
  linkLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 2 },
  linkValue: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  legalLink: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1F2937' },
  footer: { fontSize: 14, fontWeight: '600', color: '#6B7280', textAlign: 'center', marginTop: 20 },
  copyright: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 8 },
  bottomSpacing: { height: 40 },
});
