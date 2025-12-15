import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  error = false,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);
  const shakeAnimation = useSharedValue(0);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
  };

  const shake = () => {
    shakeAnimation.value = withSpring(10, { damping: 8 }, () => {
      shakeAnimation.value = withSpring(-10, { damping: 8 }, () => {
        shakeAnimation.value = withSpring(0, { damping: 8 });
      });
    });
  };

  React.useEffect(() => {
    if (error) {
      shake();
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnimation.value }],
  }));

  const handlePaste = (index: number, text: string) => {
    // Extract only digits from pasted text
    const digits = text.replace(/\D/g, '');
    const newOtp = [...otp];

    // Fill in the digits starting from current index
    for (let i = 0; i < digits.length && index + i < length; i++) {
      newOtp[index + i] = digits[i];
    }

    setOtp(newOtp);

    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
      setActiveIndex(nextEmptyIndex);
    } else {
      inputRefs.current[length - 1]?.focus();
      setActiveIndex(length - 1);
      if (newOtp.every((digit) => digit !== '')) {
        onComplete?.(newOtp.join(''));
      }
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {otp.map((digit, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            activeIndex === index && styles.activeInput,
            error && styles.errorInput,
          ]}
        >
          <TextInput
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => handleFocus(index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            onPaste={(e: any) => {
              e.preventDefault();
              const text = e.nativeEvent.text || '';
              handlePaste(index, text);
            }}
          />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeInput: {
    borderColor: '#6366F1',
    backgroundColor: '#FFFFFF',
  },
  errorInput: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    color: '#1F2937',
  },
});
