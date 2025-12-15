import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PasswordStrengthProps {
  password: string;
}

interface StrengthLevel {
  level: number;
  label: string;
  color: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const getPasswordStrength = (): StrengthLevel => {
    if (!password) {
      return { level: 0, label: '', color: '#E5E7EB' };
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { level: 1, label: 'Weak', color: '#EF4444' };
    } else if (strength <= 4) {
      return { level: 2, label: 'Medium', color: '#F59E0B' };
    } else {
      return { level: 3, label: 'Strong', color: '#10B981' };
    }
  };

  const strength = getPasswordStrength();

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {[1, 2, 3].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              { backgroundColor: bar <= strength.level ? strength.color : '#E5E7EB' },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: strength.color }]}>{strength.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
