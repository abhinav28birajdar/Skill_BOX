import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    setLoading(true);
    // Simulate verification process
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Email verified successfully!', [
        { text: 'OK', onPress: () => router.replace('/(student)' as any) }
      ]);
    }, 2000);
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    // Simulate resend
    setTimeout(() => {
      setLoading(false);
      setTimer(60);
      setCanResend(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: '#f5f5f5' }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 px-6">
        {/* Icon */}
        <View className="items-center mb-8">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: '#3b82f620' }}
          >
            <Ionicons name="mail-outline" size={40} color="#3b82f6" />
          </View>
          
          <Text 
            className="text-3xl font-bold text-center mb-4"
            style={{ color: '#000' }}
          >
            Check your email
          </Text>
          
          <Text 
            className="text-lg text-center leading-6"
            style={{ color: '#666' }}
          >
            We've sent a 6-digit verification code to your email
          </Text>
        </View>

        {/* Code Input */}
        <View className="mb-8">
          <Text 
            className="text-base font-semibold mb-4 text-center"
            style={{ color: '#000' }}
          >
            Enter verification code
          </Text>
          
          <View className="flex-row justify-center space-x-3">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                maxLength={1}
                keyboardType="numeric"
                className="w-12 h-12 rounded-xl text-center text-xl font-bold border-2"
                style={{ 
                  borderColor: digit ? '#3b82f6' : '#e5e5e5',
                  backgroundColor: '#f5f5f5',
                  color: '#000'
                }}
              />
            ))}
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className="bg-blue-600 py-4 rounded-xl items-center mb-6"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Text className="text-white text-lg font-semibold">
            {loading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View className="items-center">
          <Text 
            className="text-sm mb-2"
            style={{ color: '#666' }}
          >
            Didn't receive the code?
          </Text>
          
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text 
                className="text-base font-semibold"
                style={{ color: '#3b82f6' }}
              >
                Resend Code
              </Text>
            </TouchableOpacity>
          ) : (
            <Text 
              className="text-sm"
              style={{ color: '#999' }}
            >
              Resend in {timer}s
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}