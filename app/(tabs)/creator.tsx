import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext.enhanced';
import { supabase } from '@/lib/supabase';
import { LearningContent } from '@/types/database';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CreatorStats {
  totalContent: number;
  totalViews: number;
  pendingContent: number;
  approvedContent: number;
}

export default function CreatorScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState<LearningContent[]>([]);
  const [stats, setStats] = useState<CreatorStats>({
    totalContent: 0,
    totalViews: 0,
    pendingContent: 0,
    approvedContent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'creator') {
      loadCreatorData();
    }
  }, [user]);

  const loadCreatorData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load creator's content
      const { data: contentData } = await supabase
        .from('learning_content')
        .select(`
          *,
          skills(name)
        `)
        .eq('creator_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (contentData) {
        setContent(contentData);
        
        // Calculate stats
        const totalViews = contentData.reduce((sum, item) => sum + item.views_count, 0);
        const pendingContent = contentData.filter(item => item.status === 'pending_review').length;
        const approvedContent = contentData.filter(item => item.status === 'approved').length;
        
        setStats({
          totalContent: contentData.length,
          totalViews,
          pendingContent,
          approvedContent,
        });
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = (contentId: string) => {
    Alert.alert(
      'Delete Content',
      'Are you sure you want to delete this content? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('learning_content')
                .delete()
                .eq('id', contentId);

              if (error) {
                Alert.alert('Error', 'Failed to delete content');
              } else {
                setContent(content.filter(item => item.id !== contentId));
                Alert.alert('Success', 'Content deleted successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete content');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending_review':
        return '#FF9800';
      case 'rejected':
        return '#F44336';
      case 'draft':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅ Live';
      case 'pending_review':
        return '⏳ Pending';
      case 'rejected':
        return '❌ Rejected';
      case 'draft':
        return '📝 Draft';
      default:
        return status;
    }
  };

  const renderContentItem = ({ item }: { item: LearningContent }) => (
    <View style={styles.contentItem}>
      <View style={styles.contentHeader}>
        {item.thumbnail_url ? (
          <Image source={{ uri: item.thumbnail_url }} style={styles.contentThumbnail} />
        ) : (
          <View style={[styles.contentThumbnail, styles.placeholderThumbnail]}>
            <Text style={styles.placeholderText}>
              {item.type === 'video' ? '📹' : item.type === 'documentation' ? '📄' : '📦'}
            </Text>
          </View>
        )}
        
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.contentMeta}>
            {item.views_count} views • {item.type}
          </Text>
          {item.skills && (
            <Text style={styles.skillTag}>{item.skills.name}</Text>
          )}
        </View>

        <View style={styles.contentActions}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push(`/creator/edit-content/${item.id}`)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteContent(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {item.rejection_reason && item.status === 'rejected' && (
        <View style={styles.rejectionReason}>
          <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
          <Text style={styles.rejectionText}>{item.rejection_reason}</Text>
        </View>
      )}
    </View>
  );

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.authPrompt}>
          <ThemedText style={styles.authText}>Please sign in to access the creator dashboard</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (user.role !== 'creator') {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.authPrompt}>
          <ThemedText style={styles.authText}>
            {user.creator_status === 'pending_review' 
              ? 'Your creator application is under review' 
              : 'Apply to become a creator from your profile to access this dashboard'}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Creator Dashboard
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Welcome back, {user.full_name || user.username}!
          </ThemedText>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalContent}</Text>
              <Text style={styles.statLabel}>Total Content</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalViews}</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.approvedContent}</Text>
              <Text style={styles.statLabel}>Live Content</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.pendingContent}</Text>
              <Text style={styles.statLabel}>Pending Review</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/creator/upload-video')}
          >
            <Text style={styles.actionButtonText}>📹 Upload Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/creator/upload-documentation')}
          >
            <Text style={styles.actionButtonText}>📄 Upload Documentation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/creator/upload-project')}
          >
            <Text style={styles.actionButtonText}>📦 Upload Project Resource</Text>
          </TouchableOpacity>
        </View>

        {/* My Content */}
        <View style={styles.contentSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            My Content ({content.length})
          </ThemedText>
          
          {content.length > 0 ? (
            <FlatList
              data={content}
              renderItem={renderContentItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                🎬 No content uploaded yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Start creating and sharing your knowledge with learners!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  actionsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contentSection: {
    marginHorizontal: 20,
  },
  contentItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  contentThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderThumbnail: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  contentInfo: {
    flex: 1,
    marginRight: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  skillTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  contentActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rejectionReason: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ffcdd2',
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 12,
    color: '#d32f2f',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
