// Platform-agnostic icon component
import { Ionicons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
}) {
  // Map common symbol names to Ionicons
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    'house': 'home',
    'house.fill': 'home',
    'paperplane': 'send',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'person': 'person',
    'person.fill': 'person',
    'gear': 'settings',
    'bell': 'notifications-outline',
    'bell.fill': 'notifications',
    'star': 'star-outline',
    'star.fill': 'star',
    'book.fill': 'book',
    'checkmark': 'checkmark',
    'xmark': 'close',
    'plus': 'add',
    'search': 'search',
    'magnifyingglass': 'search',
    'calendar': 'calendar',
    'clock': 'time',
    'heart': 'heart-outline',
    'heart.fill': 'heart',
    'play.fill': 'play',
    'pause.fill': 'pause',
    'arrow.up.circle.fill': 'trending-up',
    'ellipsis': 'ellipsis-vertical',
  };

  const iconName = iconMap[name] || 'help-circle' as keyof typeof Ionicons.glyphMap;

  return <Ionicons name={iconName} size={size} color={color} style={style} />;
}
