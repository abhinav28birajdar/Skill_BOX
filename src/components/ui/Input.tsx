import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#1C1C1E',
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F2F2F7',
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: error ? '#FF3B30' : isFocused ? '#007AFF' : 'transparent',
          paddingHorizontal: 12,
        }}
      >
        {icon && iconPosition === 'left' && (
          <Ionicons name={icon} size={20} color="#8E8E93" style={{ marginRight: 8 }} />
        )}
        
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            flex: 1,
            fontSize: 16,
            color: '#1C1C1E',
            paddingVertical: 12,
          }}
          placeholderTextColor="#8E8E93"
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8E8E93"
            />
          </TouchableOpacity>
        )}
        
        {icon && iconPosition === 'right' && !secureTextEntry && (
          <Ionicons name={icon} size={20} color="#8E8E93" style={{ marginLeft: 8 }} />
        )}
      </View>
      
      {error && (
        <Text
          style={{
            fontSize: 12,
            color: '#FF3B30',
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
