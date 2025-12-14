import { useTheme } from '@/context/EnhancedThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { id: '1', icon: 'person-outline', title: 'Edit Profile', route: '/profile/edit' },
    { id: '2', icon: 'bookmark-outline', title: 'My Courses', count: 12 },
    { id: '3', icon: 'download-outline', title: 'Downloads', count: 8 },
    { id: '4', icon: 'heart-outline', title: 'Wishlist', count: 24 },
    { id: '5', icon: 'trophy-outline', title: 'Achievements', count: 15 },
    { id: '6', icon: 'card-outline', title: 'Payment Methods' },
    { id: '7', icon: 'settings-outline', title: 'Settings', route: '/settings' },
    { id: '8', icon: 'help-circle-outline', title: 'Help & Support', route: '/support' },
  ];

  const stats = [
    { label: 'Courses', value: '12' },
    { label: 'Hours', value: '145' },
    { label: 'Certificates', value: '8' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: theme.colors.card }]}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/200?img=68' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.name, { color: theme.colors.text }]}>John Doe</Text>
          <Text style={[styles.email, { color: theme.colors.textSecondary }]}>john.doe@example.com</Text>
          
          <TouchableOpacity
            style={[styles.premiumBadge, { backgroundColor: theme.colors.primary + '20' }]}
          >
            <Ionicons name="star" size={16} color={theme.colors.primary} />
            <Text style={[styles.premiumText, { color: theme.colors.primary }]}>Premium Member</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.card }]}>
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
              {index < stats.length - 1 && (
                <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { backgroundColor: theme.colors.card },
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name={item.icon as any} size={22} color={theme.colors.primary} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.count && (
                  <View style={[styles.countBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                    <Text style={[styles.countText, { color: theme.colors.primary }]}>{item.count}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.colors.card }]}
          onPress={() => router.replace('/welcome')}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          SkillBox v5.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    marginBottom: 16,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  premiumText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    position: 'absolute',
    right: 0,
    top: '50%',
    width: 1,
    height: 40,
    marginTop: -20,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLast: {
    marginBottom: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 32,
  },
});
