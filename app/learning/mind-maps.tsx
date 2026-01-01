/**
 * Mind Maps Screen
 * Features: Visual concept mapping, node connections
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIND_MAPS = [
  { id: 1, title: 'React Native Architecture', nodes: 12, connections: 18, color: '#6366F1', icon: 'git-network', updatedAt: '2024-03-15' },
  { id: 2, title: 'TypeScript Fundamentals', nodes: 8, connections: 14, color: '#3B82F6', icon: 'code-slash', updatedAt: '2024-03-14' },
  { id: 3, title: 'State Management', nodes: 10, connections: 16, color: '#8B5CF6', icon: 'cube', updatedAt: '2024-03-13' },
  { id: 4, title: 'API Integration', nodes: 6, connections: 9, color: '#10B981', icon: 'cloud', updatedAt: '2024-03-12' },
];

const CONCEPT_NODES = [
  { id: 1, title: 'React Native', color: '#6366F1', x: 50, y: 40, level: 0 },
  { id: 2, title: 'Components', color: '#3B82F6', x: 20, y: 100, level: 1, parentId: 1 },
  { id: 3, title: 'Navigation', color: '#8B5CF6', x: 50, y: 100, level: 1, parentId: 1 },
  { id: 4, title: 'State', color: '#10B981', x: 80, y: 100, level: 1, parentId: 1 },
  { id: 5, title: 'Functional', color: '#06B6D4', x: 10, y: 160, level: 2, parentId: 2 },
  { id: 6, title: 'Class', color: '#F59E0B', x: 30, y: 160, level: 2, parentId: 2 },
  { id: 7, title: 'Stack', color: '#EF4444', x: 40, y: 160, level: 2, parentId: 3 },
  { id: 8, title: 'Tab', color: '#EC4899', x: 60, y: 160, level: 2, parentId: 3 },
  { id: 9, title: 'Local', color: '#14B8A6', x: 70, y: 160, level: 2, parentId: 4 },
  { id: 10, title: 'Global', color: '#F97316', x: 90, y: 160, level: 2, parentId: 4 },
];

export default function MindMapsScreen() {
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mind Maps</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Visual Learning</Text>
            <Text style={styles.infoText}>
              Create mind maps to visualize concepts and their relationships
            </Text>
          </View>
        </Animated.View>

        {/* Mind Maps List */}
        <View style={styles.mapsList}>
          {MIND_MAPS.map((map, index) => (
            <Animated.View
              key={map.id}
              entering={FadeInDown.delay(200 + index * 100)}
            >
              <TouchableOpacity
                style={styles.mapCard}
                onPress={() => setSelectedMap(map.id)}
              >
                <View
                  style={[
                    styles.mapIcon,
                    { backgroundColor: `${map.color}20` },
                  ]}
                >
                  <Ionicons name={map.icon as any} size={32} color={map.color} />
                </View>

                <View style={styles.mapContent}>
                  <Text style={styles.mapTitle}>{map.title}</Text>
                  <View style={styles.mapStats}>
                    <View style={styles.mapStat}>
                      <Ionicons name="ellipse" size={10} color="#6B7280" />
                      <Text style={styles.mapStatText}>{map.nodes} nodes</Text>
                    </View>
                    <View style={styles.mapStatDot} />
                    <View style={styles.mapStat}>
                      <Ionicons name="git-network-outline" size={12} color="#6B7280" />
                      <Text style={styles.mapStatText}>{map.connections} links</Text>
                    </View>
                  </View>
                  <Text style={styles.mapUpdated}>Updated {map.updatedAt}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Visualization Section */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.visualizationSection}>
          <Text style={styles.sectionTitle}>Example Mind Map</Text>
          <View style={styles.mindMapCanvas}>
            {/* Connection Lines */}
            {CONCEPT_NODES.filter((n) => n.parentId).map((node) => {
              const parent = CONCEPT_NODES.find((n) => n.id === node.parentId);
              if (!parent) return null;

              return (
                <View
                  key={`line-${node.id}`}
                  style={[
                    styles.connectionLine,
                    {
                      position: 'absolute',
                      left: `${parent.x}%`,
                      top: `${parent.y}%`,
                      width: Math.sqrt(
                        Math.pow((node.x - parent.x) * 3, 2) +
                        Math.pow((node.y - parent.y) * 2, 2)
                      ),
                      transform: [
                        {
                          rotate: `${Math.atan2(
                            (node.y - parent.y) * 2,
                            (node.x - parent.x) * 3
                          ) * (180 / Math.PI)}deg`,
                        },
                      ],
                    },
                  ]}
                />
              );
            })}

            {/* Nodes */}
            {CONCEPT_NODES.map((node, index) => (
              <Animated.View
                key={node.id}
                entering={FadeInDown.delay(700 + index * 50)}
                style={[
                  styles.conceptNode,
                  {
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.nodeCircle,
                    {
                      backgroundColor: node.color,
                      width: node.level === 0 ? 80 : node.level === 1 ? 64 : 48,
                      height: node.level === 0 ? 80 : node.level === 1 ? 64 : 48,
                      borderRadius: node.level === 0 ? 40 : node.level === 1 ? 32 : 24,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.nodeText,
                      {
                        fontSize: node.level === 0 ? 13 : node.level === 1 ? 11 : 9,
                      },
                    ]}
                  >
                    {node.title}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#6366F1' }]} />
              <Text style={styles.legendText}>Core Concept</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
              <Text style={styles.legendText}>Sub-topic</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Detail</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Animated.View entering={FadeInDown.delay(1200)}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.actionButtonGradient}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Create New Map</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1250)}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="share-social-outline" size={20} color="#6366F1" />
              <Text style={styles.secondaryButtonText}>Share Map</Text>
            </TouchableOpacity>
          </Animated.View>
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
  infoCard: { flexDirection: 'row', margin: 20, padding: 16, backgroundColor: '#FEF3C7', borderRadius: 16, gap: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#92400E', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#78350F', lineHeight: 18 },
  mapsList: { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  mapCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  mapIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  mapContent: { flex: 1 },
  mapTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  mapStats: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  mapStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  mapStatText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  mapStatDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  mapUpdated: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  visualizationSection: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 20 },
  mindMapCanvas: { width: '100%', height: 400, backgroundColor: '#F9FAFB', borderRadius: 12, position: 'relative', marginBottom: 20 },
  connectionLine: { height: 2, backgroundColor: '#E5E7EB' },
  conceptNode: { position: 'absolute' },
  nodeCircle: { justifyContent: 'center', alignItems: 'center', transform: [{ translateX: -32 }, { translateY: -32 }] },
  nodeText: { fontWeight: '800', color: '#fff', textAlign: 'center' },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  actionsSection: { paddingHorizontal: 20, gap: 12 },
  actionButton: { borderRadius: 16, overflow: 'hidden' },
  actionButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  actionButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#6366F1' },
  secondaryButtonText: { fontSize: 15, fontWeight: '800', color: '#6366F1' },
  bottomSpacing: { height: 20 },
});
