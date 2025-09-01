// Simplified icon component without expo-symbols
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
    'paperplane': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'person': 'person',
    'gear': 'settings',
  };

  const iconName = iconMap[name] || 'help-circle' as keyof typeof Ionicons.glyphMap;

  return <Ionicons name={iconName} size={size} color={color} style={style} />;
}
