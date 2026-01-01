/**
 * Creator Marketplace
 * Features: Templates, assets, resources for course creators
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MARKETPLACE_CATEGORIES = [
  { id: 'templates', label: 'Templates', icon: 'document-text' },
  { id: 'graphics', label: 'Graphics', icon: 'images' },
  { id: 'videos', label: 'Video Assets', icon: 'videocam' },
  { id: 'audio', label: 'Audio', icon: 'musical-notes' },
];

const MARKETPLACE_ITEMS = [
  {
    id: 1,
    title: 'Modern Course Template',
    category: 'templates',
    price: 29.99,
    thumbnail: 'https://picsum.photos/300/200?random=20',
    downloads: 1234,
    rating: 4.8,
    author: 'Design Studio',
  },
  {
    id: 2,
    title: 'Animated Intro Pack',
    category: 'videos',
    price: 19.99,
    thumbnail: 'https://picsum.photos/300/200?random=21',
    downloads: 856,
    rating: 4.9,
    author: 'Motion Pro',
  },
  {
    id: 3,
    title: 'Icon Set Bundle',
    category: 'graphics',
    price: 14.99,
    thumbnail: 'https://picsum.photos/300/200?random=22',
    downloads: 2341,
    rating: 4.7,
    author: 'Icon Masters',
  },
  {
    id: 4,
    title: 'Background Music Pack',
    category: 'audio',
    price: 24.99,
    thumbnail: 'https://picsum.photos/300/200?random=23',
    downloads: 567,
    rating: 4.6,
    author: 'Audio Zen',
  },
];

export default function CreatorMarketplaceScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MARKETPLACE_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creator Marketplace</Text>
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search templates, assets..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {MARKETPLACE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={18}
                color={selectedCategory === category.id ? '#fff' : '#6366F1'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items Grid */}
        <View style={styles.itemsGrid}>
          {filteredItems.map((item, index) => (
            <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)} style={styles.itemCard}>
              <TouchableOpacity>
                <Image source={{ uri: item.thumbnail }} style={styles.itemThumbnail} />
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.itemAuthor}>by {item.author}</Text>
                  <View style={styles.itemMeta}>
                    <View style={styles.itemRating}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.itemRatingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.itemDownloads}>
                      <Ionicons name="download-outline" size={14} color="#6B7280" />
                      <Text style={styles.itemDownloadsText}>{item.downloads}</Text>
                    </View>
                  </View>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>${item.price}</Text>
                    <TouchableOpacity style={styles.addToCartButton}>
                      <Ionicons name="cart" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
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
  searchContainer: { padding: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  categoriesScroll: { paddingHorizontal: 20, marginBottom: 20 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', gap: 6 },
  categoryChipActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  categoryText: { fontSize: 14, fontWeight: '700', color: '#6366F1' },
  categoryTextActive: { color: '#fff' },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 12 },
  itemCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  itemThumbnail: { width: '100%', height: 120 },
  itemContent: { padding: 12 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  itemAuthor: { fontSize: 12, color: '#6B7280', marginBottom: 8 },
  itemMeta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  itemRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemRatingText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
  itemDownloads: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  itemDownloadsText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontSize: 18, fontWeight: '800', color: '#6366F1' },
  addToCartButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  bottomSpacing: { height: 40 },
});
