// ===================================================================
// COMMUNITY SCREEN - ENHANCED VERSION
// ===================================================================

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import {
    CommunityGroup,
    CommunityPost,
    LearningContent,
    StudyGroup,
    User
} from '../../types/models';

const { width: screenWidth } = Dimensions.get('window');

// ===================================================================
// TYPES
// ===================================================================

interface CommunitySection {
  title: string;
  data: any[];
  type: 'posts' | 'groups' | 'study_groups' | 'trending';
}

interface NewPostData {
  content: string;
  type: 'text' | 'question' | 'resource';
  tags: string[];
  course_id?: string;
}

// ===================================================================
// COMMUNITY SCREEN COMPONENT
// ===================================================================

export default function CommunityScreenEnhanced() {
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'study' | 'trending'>('feed');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  // Data states
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [trendingContent, setTrendingContent] = useState<LearningContent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // New post state
  const [newPost, setNewPost] = useState<NewPostData>({
    content: '',
    type: 'text',
    tags: [],
    course_id: undefined,
  });
  const [postTags, setPostTags] = useState('');

  // ===================================================================
  // DATA LOADING
  // ===================================================================

  const loadCommunityData = useCallback(async () => {
    try {
      setLoading(true);

      // Get current user
      const userResult = await AuthService.getCurrentUser();
      if (userResult.success && userResult.data) {
        setCurrentUser(userResult.data);
      }

      // Load community data in parallel
      const [
        postsResult,
        groupsResult,
        studyGroupsResult,
        trendingResult,
      ] = await Promise.all([
        ContentService.getCommunityPosts(),
        ContentService.getCommunityGroups(),
        ContentService.getStudyGroups(),
        ContentService.getTrendingContent(),
      ]);

      if (postsResult.success && postsResult.data) {
        setCommunityPosts(postsResult.data);
      }

      if (groupsResult.success && groupsResult.data) {
        setCommunityGroups(groupsResult.data);
      }

      if (studyGroupsResult.success && studyGroupsResult.data) {
        setStudyGroups(studyGroupsResult.data);
      }

      if (trendingResult.success && trendingResult.data) {
        setTrendingContent(trendingResult.data);
      }

    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCommunityData();
  }, [loadCommunityData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCommunityData();
    setRefreshing(false);
  };

  // ===================================================================
  // POST HANDLERS
  // ===================================================================

  const handleCreatePost = async () => {
    if (!newPost.content.trim()) return;

    try {
      const tags = postTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        ...newPost,
        tags,
      };

      const result = await ContentService.createCommunityPost(postData);
      
      if (result.success) {
        setShowNewPostModal(false);
        setNewPost({
          content: '',
          type: 'text',
          tags: [],
          course_id: undefined,
        });
        setPostTags('');
        // Reload posts
        loadCommunityData();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await ContentService.likeCommunityPost(postId);
      // Update local state
      setCommunityPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                likes_count: post.is_liked_by_user
                  ? post.likes_count - 1
                  : post.likes_count + 1,
                is_liked_by_user: !post.is_liked_by_user,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      await ContentService.joinCommunityGroup(groupId);
      // Update local state
      setCommunityGroups(prev =>
        prev.map(group =>
          group.id === groupId
            ? {
                ...group,
                members_count: group.is_member ? group.members_count - 1 : group.members_count + 1,
                is_member: !group.is_member,
              }
            : group
        )
      );
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  // ===================================================================
  // RENDER FUNCTIONS
  // ===================================================================

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Community
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Connect, learn, and grow together
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.createPostButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowNewPostModal(true)}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabsContainer, { backgroundColor: theme.colors.surface }]}>
      {[
        { key: 'feed', label: 'Feed', icon: 'home' },
        { key: 'groups', label: 'Groups', icon: 'people' },
        { key: 'study', label: 'Study', icon: 'library' },
        { key: 'trending', label: 'Trending', icon: 'trending-up' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === tab.key
                ? theme.colors.primary
                : 'transparent',
            }
          ]}
          onPress={() => setActiveTab(tab.key as any)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? 'white' : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === tab.key ? 'white' : theme.colors.textSecondary,
              }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPostItem = ({ item }: { item: CommunityPost }) => (
    <View style={[styles.postItem, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.postHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
            {item.author?.display_name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.postAuthorInfo}>
          <Text style={[styles.authorName, { color: theme.colors.text }]}>
            {item.author?.display_name || 'Anonymous'}
          </Text>
          <Text style={[styles.postDate, { color: theme.colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
        <View style={[
          styles.postTypeBadge,
          {
            backgroundColor: item.type === 'question'
              ? theme.colors.warning + '20'
              : item.type === 'resource'
              ? theme.colors.success + '20'
              : theme.colors.primary + '20',
          }
        ]}>
          <Text
            style={[
              styles.postTypeText,
              {
                color: item.type === 'question'
                  ? theme.colors.warning
                  : item.type === 'resource'
                  ? theme.colors.success
                  : theme.colors.primary,
              }
            ]}
          >
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.postContent, { color: theme.colors.text }]}>
        {item.content}
      </Text>

      {item.tags && item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: theme.colors.background }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(item.id)}
        >
          <Ionicons
            name={item.is_liked_by_user ? "heart" : "heart-outline"}
            size={20}
            color={item.is_liked_by_user ? theme.colors.error : theme.colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {item.likes_count}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/community/post/${item.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            {item.comments_count}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGroupItem = ({ item }: { item: CommunityGroup }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/community/group/${item.id}`)}
    >
      <View style={[styles.groupIcon, { backgroundColor: theme.colors.primary + '20' }]}>
        <Ionicons name="people" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.groupDetails}>
        <Text style={[styles.groupName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.groupDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.groupMeta}>
          <Text style={[styles.groupMembers, { color: theme.colors.textSecondary }]}>
            {item.members_count} members
          </Text>
          <Text style={[styles.groupPosts, { color: theme.colors.textSecondary }]}>
            • {item.posts_count} posts
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.joinButton,
          {
            backgroundColor: item.is_member
              ? theme.colors.background
              : theme.colors.primary,
            borderColor: theme.colors.primary,
            borderWidth: item.is_member ? 1 : 0,
          }
        ]}
        onPress={() => handleJoinGroup(item.id)}
      >
        <Text
          style={[
            styles.joinButtonText,
            {
              color: item.is_member ? theme.colors.primary : 'white',
            }
          ]}
        >
          {item.is_member ? 'Joined' : 'Join'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderStudyGroupItem = ({ item }: { item: StudyGroup }) => (
    <TouchableOpacity
      style={[styles.studyGroupItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/community/study/${item.id}`)}
    >
      <View style={styles.studyGroupHeader}>
        <Text style={[styles.studyGroupName, { color: theme.colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={[
          styles.studyGroupStatus,
          {
            backgroundColor: item.is_active
              ? theme.colors.success + '20'
              : theme.colors.textTertiary + '20',
          }
        ]}>
          <Text
            style={[
              styles.studyGroupStatusText,
              {
                color: item.is_active ? theme.colors.success : theme.colors.textTertiary,
              }
            ]}
          >
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.studyGroupDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      
      {item.course && (
        <Text style={[styles.studyGroupCourse, { color: theme.colors.primary }]} numberOfLines={1}>
          Course: {item.course.title}
        </Text>
      )}
      
      <View style={styles.studyGroupMeta}>
        <View style={styles.studyGroupMembers}>
          <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.studyGroupMembersText, { color: theme.colors.textSecondary }]}>
            {item.members_count}/{item.max_members} members
          </Text>
        </View>
        
        {item.next_session_at && (
          <View style={styles.studyGroupSession}>
            <Ionicons name="time" size={16} color={theme.colors.warning} />
            <Text style={[styles.studyGroupSessionText, { color: theme.colors.warning }]}>
              Next: {new Date(item.next_session_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }: { item: LearningContent }) => (
    <TouchableOpacity
      style={[styles.trendingItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => router.push(`/content/${item.id}`)}
    >
      <View style={[styles.trendingThumbnail, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.trendingDetails}>
        <Text style={[styles.trendingTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.trendingCreator, { color: theme.colors.textSecondary }]}>
          {item.creator?.display_name || 'SkillBox'}
        </Text>
        <View style={styles.trendingMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={theme.colors.warning} />
            <Text style={[styles.rating, { color: theme.colors.textSecondary }]}>
              {item.average_rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.views, { color: theme.colors.textSecondary }]}>
            • {item.views_count} views
          </Text>
          <Text style={[styles.trendingGrowth, { color: theme.colors.success }]}>
            • +25% this week
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNewPostModal = () => (
    <Modal
      visible={showNewPostModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowNewPostModal(false)}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
            <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            New Post
          </Text>
          <TouchableOpacity
            onPress={handleCreatePost}
            style={[
              styles.modalPostButton,
              {
                backgroundColor: newPost.content.trim()
                  ? theme.colors.primary
                  : theme.colors.textTertiary,
              }
            ]}
          >
            <Text style={styles.modalPostButtonText}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.postTypeSelector}>
            {[
              { key: 'text', label: 'Text', icon: 'document-text' },
              { key: 'question', label: 'Question', icon: 'help-circle' },
              { key: 'resource', label: 'Resource', icon: 'link' },
            ].map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.postTypeOption,
                  {
                    backgroundColor: newPost.type === type.key
                      ? theme.colors.primary
                      : theme.colors.surface,
                  }
                ]}
                onPress={() => setNewPost(prev => ({ ...prev, type: type.key as any }))}
              >
                <Ionicons
                  name={type.icon as any}
                  size={18}
                  color={newPost.type === type.key ? 'white' : theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.postTypeOptionText,
                    {
                      color: newPost.type === type.key ? 'white' : theme.colors.textSecondary,
                    }
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[
              styles.postContentInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }
            ]}
            placeholder={`What's on your mind?`}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={8}
            value={newPost.content}
            onChangeText={(text) => setNewPost(prev => ({ ...prev, content: text }))}
            textAlignVertical="top"
          />

          <TextInput
            style={[
              styles.postTagsInput,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              }
            ]}
            placeholder="Tags (comma separated)"
            placeholderTextColor={theme.colors.textSecondary}
            value={postTags}
            onChangeText={setPostTags}
          />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <FlatList
            data={communityPosts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.feedList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            }
          />
        );
      case 'groups':
        return (
          <FlatList
            data={communityGroups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.groupsList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'study':
        return (
          <FlatList
            data={studyGroups}
            renderItem={renderStudyGroupItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.studyGroupsList}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'trending':
        return (
          <FlatList
            data={trendingContent}
            renderItem={renderTrendingItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.trendingList}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  // ===================================================================
  // MAIN RENDER
  // ===================================================================

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      {renderTabs()}
      {renderContent()}
      {renderNewPostModal()}
    </SafeAreaView>
  );
}

// ===================================================================
// STYLES
// ===================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 2,
  },
  createPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  feedList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  postItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postAuthorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postDate: {
    fontSize: 12,
    marginTop: 2,
  },
  postTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  groupsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  groupIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupMembers: {
    fontSize: 12,
  },
  groupPosts: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  studyGroupsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  studyGroupItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  studyGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studyGroupName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  studyGroupStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studyGroupStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  studyGroupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  studyGroupCourse: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  studyGroupMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studyGroupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyGroupMembersText: {
    fontSize: 12,
    marginLeft: 4,
  },
  studyGroupSession: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studyGroupSessionText: {
    fontSize: 12,
    marginLeft: 4,
  },
  trendingList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  trendingItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingThumbnail: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingDetails: {
    flex: 1,
    padding: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  trendingCreator: {
    fontSize: 14,
    marginBottom: 6,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 2,
  },
  views: {
    fontSize: 12,
    marginLeft: 4,
  },
  trendingGrowth: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancelText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalPostButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalPostButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  postTypeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  postTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
  },
  postTypeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  postContentInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  postTagsInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
