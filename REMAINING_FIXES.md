# Remaining Fixes for SkillBox Project

## Theme Related Issues
1. Update darkTheme colors in `constants/Theme.ts` to include all required properties:
   - textPrimary
   - card
   - cardSecondary
   - star
   - starEmpty

## Component Variant Fixes
1. Replace "outlined" with "outline" in Card components:
   - `app/(creator)/content.tsx` lines 407, 416, 425, 434, 542
   - `app/(creator)/courses.tsx` lines 295, 304, 313, 364
   - `app/(creator)/index.tsx` lines 56, 381, 435
   - `app/(tabs)/learning.tsx` lines 110, 366, 375, 384, 393, 465, 533

2. Remove variant property from TouchableCard components (not supported):
   - `app/(creator)/content.tsx` lines 109, 218
   - `app/(creator)/classes.tsx` lines 138, 427, 444, 461, 478
   - `app/(creator)/courses.tsx` line 78
   - `app/(creator)/index.tsx` lines 94, 461, 481
   - `app/(tabs)/learning.tsx` lines 40, 138

## Import Missing Components
1. Add imports for TouchableCard in:
   - `app/(creator)/content.tsx`
   - `app/(creator)/courses.tsx`
   - `app/(creator)/index.tsx`
   - `app/(tabs)/learning.tsx`

## Type Definition Updates
1. Update type definitions for SignUpData in AuthContext
2. Fix missing accent color in theme
3. Add class_type and base_price properties to Class interface
4. Add new notification types to NotificationType enum:
   - 'booking_update'
   - 'content_status_update'
   - 'review_received'
   - 'assignment_graded'
   - 'admin_announcement'

## Other Fixes
1. Update import path in `app/(tabs)/index.tsx` from '@/types/database.enhanced' to '@/types/database'
2. Fix useTheme usage in TouchableCard component

## How to Fix Card Variant Issues
```tsx
// Find
<Card variant="outlined" padding="md" style={styles.statCard}>

// Replace with
<Card variant="outline" padding="md" style={styles.statCard}>
```

## How to Fix TouchableCard Variant Issues
```tsx
// Find
<TouchableCard variant="outlined" padding="md" onPress={handlePress}>

// Replace with
<TouchableCard onPress={handlePress} style={styles.card}>
```
