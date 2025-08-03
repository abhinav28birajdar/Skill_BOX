// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'person.fill': 'person',
  'envelope.fill': 'email',
  'envelope': 'email',
  'lock.fill': 'lock',
  'lock': 'lock',
  'eye.fill': 'visibility',
  'eye': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'eye.slash': 'visibility-off',
  'checkmark.circle.fill': 'check-circle',
  'checkmark': 'check',
  'xmark': 'close',
  'gear': 'settings',
  'bell.fill': 'notifications',
  'bell': 'notifications',
  'bell.slash.fill': 'notifications-off',
  'star.fill': 'star',
  'star': 'star-border',
  'trophy.fill': 'emoji-events',
  'book.fill': 'menu-book',
  'bubble.left.fill': 'chat',
  'app.badge.fill': 'apps',
  'exclamationmark.triangle.fill': 'warning',
  'lightbulb.fill': 'lightbulb',
  'arrow.up.circle.fill': 'trending-up',
  'plus': 'add',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-border',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'square.and.arrow.up': 'share',
  'ellipsis': 'more-vert',
  'magnifyingglass': 'search',
  'calendar': 'event',
  'clock': 'schedule',
  'chart.bar.fill': 'bar-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'dollarsign.circle.fill': 'monetization-on',
  'graduationcap.fill': 'school',
  'paintbrush.fill': 'brush',
  'briefcase.fill': 'work',
  'leaf.fill': 'eco',
  'hammer.fill': 'build',
  'globe': 'language',
  'heart.pulse.fill': 'favorite',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Get the mapped icon name, fallback to a default icon if not found
  const mappedName = MAPPING[name] || 'help-outline';
  
  return <MaterialIcons color={color} size={size} name={mappedName} style={style} />;
}
