/**
 * Design Studio Screen
 * Features: Visual design tool for creating graphics
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOOLS = [
  { id: 1, name: 'Select', icon: 'hand-left', color: '#6366F1' },
  { id: 2, name: 'Rectangle', icon: 'square-outline', color: '#8B5CF6' },
  { id: 3, name: 'Circle', icon: 'ellipse-outline', color: '#EC4899' },
  { id: 4, name: 'Text', icon: 'text-outline', color: '#F59E0B' },
  { id: 5, name: 'Pen', icon: 'brush-outline', color: '#10B981' },
  { id: 6, name: 'Line', icon: 'remove-outline', color: '#EF4444' },
];

const COLORS = [
  '#1F2937', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#fff',
];

const LAYERS = [
  { id: 1, name: 'Background', type: 'rectangle', visible: true, locked: false },
  { id: 2, name: 'Header Text', type: 'text', visible: true, locked: false },
  { id: 3, name: 'Button', type: 'rectangle', visible: true, locked: false },
  { id: 4, name: 'Icon', type: 'shape', visible: true, locked: false },
];

export default function DesignStudioScreen() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#6366F1');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Design Studio</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.workspace}>
        {/* Tools Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Tools</Text>
          <View style={styles.toolsList}>
            {TOOLS.map((tool, index) => (
              <Animated.View key={tool.id} entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.toolButton,
                    selectedTool === tool.id && styles.toolButtonActive,
                  ]}
                  onPress={() => setSelectedTool(tool.id)}
                >
                  <Ionicons
                    name={tool.icon as any}
                    size={24}
                    color={selectedTool === tool.id ? '#fff' : '#6B7280'}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Color Palette */}
          <View style={styles.colorSection}>
            <Text style={styles.sidebarTitle}>Colors</Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color, index) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    color === '#fff' && styles.colorButtonWhite,
                    selectedColor === color && styles.colorButtonActive,
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Canvas Area */}
        <ScrollView style={styles.canvasArea} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.canvas}>
            <View style={styles.canvasGrid}>
              {/* Grid pattern */}
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={styles.gridRow}>
                  {Array.from({ length: 15 }).map((_, j) => (
                    <View key={j} style={styles.gridCell} />
                  ))}
                </View>
              ))}
            </View>

            {/* Sample Design Elements */}
            <View style={styles.designElements}>
              <View style={[styles.designRect, { backgroundColor: selectedColor }]} />
              <Text style={styles.designText}>Your Design Here</Text>
            </View>
          </Animated.View>

          {/* Properties Panel */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.propertiesPanel}>
            <Text style={styles.panelTitle}>Properties</Text>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Width</Text>
              <View style={styles.propertyInput}>
                <Text style={styles.propertyValue}>200px</Text>
              </View>
            </View>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Height</Text>
              <View style={styles.propertyInput}>
                <Text style={styles.propertyValue}>150px</Text>
              </View>
            </View>
            <View style={styles.propertyRow}>
              <Text style={styles.propertyLabel}>Opacity</Text>
              <View style={styles.propertyInput}>
                <Text style={styles.propertyValue}>100%</Text>
              </View>
            </View>
          </Animated.View>

          {/* Layers Panel */}
          <Animated.View entering={FadeInDown.delay(300)} style={styles.layersPanel}>
            <View style={styles.layersHeader}>
              <Text style={styles.panelTitle}>Layers</Text>
              <TouchableOpacity>
                <Ionicons name="add-circle-outline" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>
            <View style={styles.layersList}>
              {LAYERS.map((layer, index) => (
                <Animated.View
                  key={layer.id}
                  entering={FadeInDown.delay(350 + index * 50)}
                  style={styles.layerItem}
                >
                  <View style={styles.layerIcon}>
                    <Ionicons
                      name={
                        layer.type === 'text'
                          ? 'text-outline'
                          : layer.type === 'shape'
                          ? 'shapes-outline'
                          : 'square-outline'
                      }
                      size={16}
                      color="#6366F1"
                    />
                  </View>
                  <Text style={styles.layerName}>{layer.name}</Text>
                  <View style={styles.layerActions}>
                    <TouchableOpacity>
                      <Ionicons
                        name={layer.visible ? 'eye-outline' : 'eye-off-outline'}
                        size={18}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons
                        name={layer.locked ? 'lock-closed-outline' : 'lock-open-outline'}
                        size={18}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomAction}>
          <Ionicons name="refresh-outline" size={20} color="#6B7280" />
          <Text style={styles.bottomActionText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomAction}>
          <Ionicons name="images-outline" size={20} color="#6B7280" />
          <Text style={styles.bottomActionText}>Templates</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton}>
          <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.exportButtonGradient}>
            <Ionicons name="download" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>Export</Text>
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
  workspace: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 80, backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: '#E5E7EB', padding: 12 },
  sidebarTitle: { fontSize: 11, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12 },
  toolsList: { gap: 8, marginBottom: 24 },
  toolButton: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  toolButtonActive: { backgroundColor: '#6366F1' },
  colorSection: { marginTop: 'auto' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorButton: { width: 24, height: 24, borderRadius: 12 },
  colorButtonWhite: { borderWidth: 1, borderColor: '#E5E7EB' },
  colorButtonActive: { borderWidth: 3, borderColor: '#1F2937' },
  canvasArea: { flex: 1 },
  canvas: { margin: 20, height: 400, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  canvasGrid: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  gridRow: { flexDirection: 'row', flex: 1 },
  gridCell: { flex: 1, borderWidth: 0.5, borderColor: '#F3F4F6' },
  designElements: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -75 }, { translateY: -50 }], alignItems: 'center' },
  designRect: { width: 150, height: 100, borderRadius: 12, marginBottom: 16 },
  designText: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  propertiesPanel: { margin: 20, marginTop: 0, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  panelTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  propertyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  propertyLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  propertyInput: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F9FAFB', borderRadius: 8, minWidth: 80 },
  propertyValue: { fontSize: 14, fontWeight: '600', color: '#1F2937', textAlign: 'right' },
  layersPanel: { margin: 20, marginTop: 0, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  layersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  layersList: { gap: 12 },
  layerItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 12 },
  layerIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  layerName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1F2937' },
  layerActions: { flexDirection: 'row', gap: 12 },
  bottomSpacing: { height: 80 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', gap: 12 },
  bottomAction: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, backgroundColor: '#F3F4F6', borderRadius: 12 },
  bottomActionText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  exportButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  exportButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  exportButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
