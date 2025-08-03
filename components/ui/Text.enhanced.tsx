import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import {
    Text as RNText,
    TextProps as RNTextProps,
    TextStyle
} from 'react-native';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'button';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textTertiary' | 'success' | 'warning' | 'error' | 'info' | 'white';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body1', 
  color = 'text',
  weight = 'normal',
  align = 'left',
  style,
  children,
  ...props 
}) => {
  const { theme } = useTheme();
  
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.fontSizes['5xl'],
          fontWeight: '700',
          lineHeight: theme.fontSizes['5xl'] * 1.2,
        };
      case 'h2':
        return {
          fontSize: theme.fontSizes['4xl'],
          fontWeight: '600',
          lineHeight: theme.fontSizes['4xl'] * 1.2,
        };
      case 'h3':
        return {
          fontSize: theme.fontSizes['3xl'],
          fontWeight: '600',
          lineHeight: theme.fontSizes['3xl'] * 1.3,
        };
      case 'h4':
        return {
          fontSize: theme.fontSizes['2xl'],
          fontWeight: '600',
          lineHeight: theme.fontSizes['2xl'] * 1.3,
        };
      case 'h5':
        return {
          fontSize: theme.fontSizes.xl,
          fontWeight: '600',
          lineHeight: theme.fontSizes.xl * 1.4,
        };
      case 'h6':
        return {
          fontSize: theme.fontSizes.lg,
          fontWeight: '600',
          lineHeight: theme.fontSizes.lg * 1.4,
        };
      case 'body1':
        return {
          fontSize: theme.fontSizes.base,
          lineHeight: theme.fontSizes.base * 1.5,
        };
      case 'body2':
        return {
          fontSize: theme.fontSizes.sm,
          lineHeight: theme.fontSizes.sm * 1.5,
        };
      case 'caption':
        return {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.fontSizes.xs * 1.4,
        };
      case 'overline':
        return {
          fontSize: theme.fontSizes.xs,
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
      case 'button':
        return {
          fontSize: theme.fontSizes.base,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        };
      default:
        return {};
    }
  };

  const getColorStyle = (): TextStyle => {
    switch (color) {
      case 'primary':
        return { color: theme.colors.primary };
      case 'secondary':
        return { color: theme.colors.secondary };
      case 'text':
        return { color: theme.colors.text };
      case 'textSecondary':
        return { color: theme.colors.textSecondary };
      case 'textTertiary':
        return { color: theme.colors.textTertiary };
      case 'success':
        return { color: theme.colors.success };
      case 'warning':
        return { color: theme.colors.warning };
      case 'error':
        return { color: theme.colors.error };
      case 'info':
        return { color: theme.colors.info };
      case 'white':
        return { color: '#FFFFFF' };
      default:
        return { color: theme.colors.text };
    }
  };

  const getWeightStyle = (): TextStyle => {
    switch (weight) {
      case 'medium':
        return { fontWeight: '500' };
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      default:
        return { fontWeight: '400' };
    }
  };

  const getAlignStyle = (): TextStyle => {
    return { textAlign: align };
  };

  const combinedStyle = [
    getVariantStyle(),
    getColorStyle(),
    getWeightStyle(),
    getAlignStyle(),
    style,
  ];

  return (
    <RNText style={combinedStyle} {...props}>
      {children}
    </RNText>
  );
};
