import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type TimerMode = 'focus' | 'short-break' | 'long-break';

interface TimerStats {
  sessionsCompleted: number;
  totalFocusTime: number;
  todayFocusTime: number;
  streak: number;
}

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<TimerStats>({
    sessionsCompleted: 8,
    totalFocusTime: 640, // in minutes
    todayFocusTime: 150, // in minutes
    streak: 5,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  const durations = {
    focus: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const progress = timeLeft / durations[mode];
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, mode]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    // Play completion sound
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/timer-complete.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }

    // Update stats
    if (mode === 'focus') {
      setStats(prev => ({
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalFocusTime: prev.totalFocusTime + 25,
        todayFocusTime: prev.todayFocusTime + 25,
      }));

      // Auto-switch to break
      if ((stats.sessionsCompleted + 1) % 4 === 0) {
        switchMode('long-break');
      } else {
        switchMode('short-break');
      }
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(durations[newMode]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const modeColors = {
    focus: { bg: '#3B82F6', light: '#DBEAFE', text: 'Focus Time' },
    'short-break': { bg: '#10B981', light: '#D1FAE5', text: 'Short Break' },
    'long-break': { bg: '#8B5CF6', light: '#EDE9FE', text: 'Long Break' },
  };

  const currentColor = modeColors[mode];
  const progress = (timeLeft / durations[mode]) * 100;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      {/* Mode Selector */}
      <View className="flex-row bg-white dark:bg-gray-800 rounded-xl p-2 mb-6">
        {(['focus', 'short-break', 'long-break'] as TimerMode[]).map(m => (
          <TouchableOpacity
            key={m}
            onPress={() => !isRunning && switchMode(m)}
            className={`flex-1 py-3 rounded-lg items-center ${
              mode === m ? 'bg-blue-500' : ''
            }`}
            disabled={isRunning}
          >
            <Text
              className={`text-sm font-semibold ${
                mode === m ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {modeColors[m].text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Circle */}
      <View className="items-center justify-center flex-1">
        <View className="relative items-center justify-center">
          {/* Outer Circle */}
          <View
            className="w-72 h-72 rounded-full items-center justify-center"
            style={{ backgroundColor: currentColor.light }}
          >
            {/* Progress Circle */}
            <View className="absolute inset-4 rounded-full overflow-hidden">
              <View
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: currentColor.bg,
                  transform: [{ scale: progress / 100 }],
                }}
              />
            </View>

            {/* Time Display */}
            <View className="bg-white dark:bg-gray-800 w-56 h-56 rounded-full items-center justify-center">
              <Text className="text-6xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeLeft)}
              </Text>
              <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                {currentColor.text}
              </Text>
            </View>
          </View>

          {/* Session Counter */}
          <View className="absolute -bottom-6 bg-white dark:bg-gray-800 rounded-full px-6 py-2 shadow-lg">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Session {stats.sessionsCompleted + 1}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View className="mb-6">
        <View className="flex-row justify-center space-x-4 mb-6">
          <TouchableOpacity
            onPress={toggleTimer}
            className="w-20 h-20 rounded-full items-center justify-center shadow-lg"
            style={{ backgroundColor: currentColor.bg }}
          >
            <Ionicons name={isRunning ? 'pause' : 'play'} size={32} color="white" />
          </TouchableOpacity>
          
          {!isRunning && (
            <TouchableOpacity
              onPress={resetTimer}
              className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center shadow-lg"
            >
              <Ionicons name="refresh" size={32} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.sessionsCompleted}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Sessions</Text>
            </View>
            
            <View className="items-center">
              <Ionicons name="time" size={24} color="#3B82F6" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.todayFocusTime}m
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Today</Text>
            </View>
            
            <View className="items-center">
              <Ionicons name="flame" size={24} color="#EF4444" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.streak}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">Day Streak</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tips */}
      <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text className="flex-1 ml-2 text-sm text-blue-800 dark:text-blue-200">
            {mode === 'focus'
              ? '💡 Stay focused! Turn off notifications and find a quiet space.'
              : '☕ Take a break! Stretch, hydrate, or take a short walk.'}
          </Text>
        </View>
      </View>
    </View>
  );
}
