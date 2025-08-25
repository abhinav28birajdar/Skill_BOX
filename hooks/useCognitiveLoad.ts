import { useEffect, useRef, useState } from 'react';
import { BiometricData, CognitiveState } from '../ai/models/interfaces';
import { BIOMETRIC_CONFIG, COGNITIVE_ANALYSIS } from '../config/bioCognitiveConfig';

export interface CognitiveLoadMetrics {
  currentLoad: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  peak: number;
  average: number;
  recommendation: 'continue' | 'break' | 'simplify' | 'challenge';
}

export function useCognitiveLoad(biometricData?: BiometricData) {
  const [cognitiveState, setCognitiveState] = useState<CognitiveState>({
    focusLevel: 0.5,
    cognitiveLoad: 0.5,
    emotionalState: 'neutral',
    brainwaveStates: {
      alpha: 0.5,
      beta: 0.5,
      theta: 0.3,
      delta: 0.2
    },
    learningReadiness: 0.5
  });

  const [metrics, setMetrics] = useState<CognitiveLoadMetrics>({
    currentLoad: 0.5,
    trend: 'stable',
    peak: 0.5,
    average: 0.5,
    recommendation: 'continue'
  });

  const history = useRef<number[]>([]);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (biometricData) {
      analyzeCognitiveLoad(biometricData);
    }
  }, [biometricData]);

  useEffect(() => {
    // Start continuous analysis
    analysisInterval.current = setInterval(() => {
      updateMetrics();
    }, 5000); // Update every 5 seconds

    return () => {
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
      }
    };
  }, []);

  const analyzeCognitiveLoad = (data: BiometricData) => {
    const focusLevel = calculateFocusLevel(data);
    const cognitiveLoad = calculateCognitiveLoad(data);
    const emotionalState = determineEmotionalState(data);
    const learningReadiness = calculateLearningReadiness(focusLevel, cognitiveLoad, emotionalState);

    const newState: CognitiveState = {
      focusLevel,
      cognitiveLoad,
      emotionalState,
      brainwaveStates: analyzeBrainwaves(data),
      learningReadiness
    };

    setCognitiveState(newState);
    
    // Update history for trend analysis
    history.current.push(cognitiveLoad);
    if (history.current.length > 20) {
      history.current.shift(); // Keep last 20 readings
    }
  };

  const calculateFocusLevel = (data: BiometricData): number => {
    let focusScore = 0.5; // Default neutral focus

    if (data.eyeTracking) {
      // Eye tracking indicates attention
      focusScore += 0.3;
      
      // Pupil dilation can indicate engagement
      if (data.eyeTracking.pupilDilation > 0.6) {
        focusScore += 0.2;
      }
    }

    if (data.facialExpressions?.attention) {
      focusScore = data.facialExpressions.attention;
    }

    // Motion stability indicates focus
    // (less head movement = more focused)
    // This would be calculated from motion data

    return Math.max(0, Math.min(1, focusScore));
  };

  const calculateCognitiveLoad = (data: BiometricData): number => {
    let loadScore = 0.5; // Default moderate load

    // Pupil dilation indicates cognitive effort
    if (data.eyeTracking?.pupilDilation) {
      loadScore += (data.eyeTracking.pupilDilation - 0.5) * 0.4;
    }

    // Heart rate variability indicates stress/load
    if (data.heartRate) {
      const normalizedHR = (data.heartRate - 70) / 50; // Normalize around 70 BPM
      loadScore += normalizedHR * 0.2;
    }

    // GSR indicates arousal/stress
    if (data.gsrLevel) {
      loadScore += (data.gsrLevel - 0.5) * 0.3;
    }

    // EEG beta waves indicate active thinking
    if (data.eegPatterns) {
      // This would involve FFT analysis
      // For now, use a simple heuristic
      const avgActivity = data.eegPatterns.reduce((a, b) => a + b, 0) / data.eegPatterns.length;
      loadScore += (avgActivity - 0.5) * 0.2;
    }

    return Math.max(0, Math.min(1, loadScore));
  };

  const determineEmotionalState = (data: BiometricData): string => {
    if (data.facialExpressions?.emotion) {
      return data.facialExpressions.emotion;
    }

    // Fallback analysis based on other metrics
    if (data.heartRate) {
      if (data.heartRate > 100) return 'excited';
      if (data.heartRate < 60) return 'calm';
    }

    if (data.gsrLevel) {
      if (data.gsrLevel > 0.7) return 'stressed';
      if (data.gsrLevel < 0.3) return 'relaxed';
    }

    return 'neutral';
  };

  const calculateLearningReadiness = (
    focus: number,
    cognitiveLoad: number,
    emotionalState: string
  ): number => {
    const emotionalPositivity = assessEmotionalPositivity(emotionalState);

    // Optimal learning readiness: high focus, moderate cognitive load, positive emotion
    const readiness = (
      focus * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.FOCUS +
      (1 - Math.abs(cognitiveLoad - 0.6)) * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.COGNITIVE_LOAD +
      emotionalPositivity * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.EMOTIONAL_STATE
    );

    return Math.max(0, Math.min(1, readiness));
  };

  const assessEmotionalPositivity = (emotionalState: string): number => {
    const positiveEmotions = ['happy', 'excited', 'confident', 'focused', 'calm'];
    const negativeEmotions = ['frustrated', 'confused', 'bored', 'stressed', 'tired'];

    if (positiveEmotions.includes(emotionalState)) return 0.8;
    if (negativeEmotions.includes(emotionalState)) return 0.3;
    return 0.5; // Neutral
  };

  const analyzeBrainwaves = (data: BiometricData): any => {
    if (!data.eegPatterns || data.eegPatterns.length === 0) {
      return {
        alpha: 0.5,
        beta: 0.5,
        theta: 0.3,
        delta: 0.2
      };
    }

    // Simplified brainwave analysis
    // In a real implementation, this would use FFT to extract frequency bands
    const avg = data.eegPatterns.reduce((a, b) => a + b, 0) / data.eegPatterns.length;
    const variance = data.eegPatterns.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / data.eegPatterns.length;

    return {
      alpha: Math.min(1, Math.max(0, avg + 0.1)), // Associated with relaxed awareness
      beta: Math.min(1, Math.max(0, variance)), // Associated with active thinking
      theta: Math.min(1, Math.max(0, avg - 0.1)), // Associated with creativity
      delta: Math.min(1, Math.max(0, 1 - variance)) // Associated with deep rest
    };
  };

  const updateMetrics = () => {
    if (history.current.length < 2) return;

    const currentLoad = cognitiveState.cognitiveLoad;
    const recent = history.current.slice(-5);
    const average = recent.reduce((a, b) => a + b, 0) / recent.length;
    const peak = Math.max(...history.current);

    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (recent.length >= 3) {
      const lastThree = recent.slice(-3);
      const isIncreasing = lastThree[2] > lastThree[1] && lastThree[1] > lastThree[0];
      const isDecreasing = lastThree[2] < lastThree[1] && lastThree[1] < lastThree[0];
      
      if (isIncreasing) trend = 'increasing';
      else if (isDecreasing) trend = 'decreasing';
    }

    // Generate recommendation
    let recommendation: 'continue' | 'break' | 'simplify' | 'challenge' = 'continue';
    
    if (currentLoad > BIOMETRIC_CONFIG.THRESHOLDS.COGNITIVE_LOAD.HIGH) {
      recommendation = cognitiveState.focusLevel > 0.7 ? 'simplify' : 'break';
    } else if (currentLoad < BIOMETRIC_CONFIG.THRESHOLDS.COGNITIVE_LOAD.LOW && 
               cognitiveState.learningReadiness > BIOMETRIC_CONFIG.THRESHOLDS.LEARNING_READINESS.HIGH) {
      recommendation = 'challenge';
    }

    setMetrics({
      currentLoad,
      trend,
      peak,
      average,
      recommendation
    });
  };

  const getAdaptationSuggestions = () => {
    const suggestions = [];

    if (cognitiveState.cognitiveLoad > 0.8) {
      suggestions.push('Take a 5-minute break');
      suggestions.push('Switch to visual learning mode');
      suggestions.push('Reduce content complexity');
    }

    if (cognitiveState.focusLevel < 0.4) {
      suggestions.push('Change learning environment');
      suggestions.push('Use interactive content');
      suggestions.push('Enable focus-enhancing audio');
    }

    if (cognitiveState.learningReadiness > 0.8) {
      suggestions.push('Increase difficulty level');
      suggestions.push('Add advanced challenges');
      suggestions.push('Introduce new concepts');
    }

    if (cognitiveState.emotionalState === 'frustrated') {
      suggestions.push('Provide encouraging feedback');
      suggestions.push('Review previous concepts');
      suggestions.push('Use simpler explanations');
    }

    return suggestions;
  };

  const isOptimalLearningState = (): boolean => {
    return (
      cognitiveState.focusLevel > BIOMETRIC_CONFIG.THRESHOLDS.FOCUS.MEDIUM &&
      cognitiveState.cognitiveLoad > BIOMETRIC_CONFIG.THRESHOLDS.COGNITIVE_LOAD.LOW &&
      cognitiveState.cognitiveLoad < BIOMETRIC_CONFIG.THRESHOLDS.COGNITIVE_LOAD.HIGH &&
      cognitiveState.learningReadiness > BIOMETRIC_CONFIG.THRESHOLDS.LEARNING_READINESS.MEDIUM
    );
  };

  const resetAnalysis = () => {
    history.current = [];
    setCognitiveState({
      focusLevel: 0.5,
      cognitiveLoad: 0.5,
      emotionalState: 'neutral',
      brainwaveStates: {
        alpha: 0.5,
        beta: 0.5,
        theta: 0.3,
        delta: 0.2
      },
      learningReadiness: 0.5
    });
  };

  return {
    cognitiveState,
    metrics,
    getAdaptationSuggestions,
    isOptimalLearningState,
    resetAnalysis
  };
}
