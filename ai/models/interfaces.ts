export interface BiometricData {
  eegPatterns?: number[];
  heartRate?: number;
  gsrLevel?: number;
  eyeTracking?: {
    gazePosition: { x: number; y: number };
    pupilDilation: number;
  };
  facialExpressions?: {
    attention: number;
    emotion: string;
    microExpressions: string[];
  };
  timestamp: number;
}

export interface CognitiveState {
  focusLevel: number;
  cognitiveLoad: number;
  emotionalState: string;
  brainwaveStates: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
  };
  learningReadiness: number;
}

export type EmotionalState = 
  | 'focused' 
  | 'confused' 
  | 'excited' 
  | 'bored' 
  | 'frustrated' 
  | 'neutral'
  | 'confident'
  | 'overwhelmed'
  | 'happy';

export type LearningModality = 
  | 'visual' 
  | 'auditory' 
  | 'kinesthetic' 
  | 'reading'
  | 'spatial'
  | 'tactile';

export interface LearnerProfile {
  userId: string;
  learningStyle: LearningModality[];
  preferredDifficulty: number;
  averageFocusScore: number;
  cognitiveBaseline: CognitiveState;
  emotionalProfile: {
    dominantEmotions: EmotionalState[];
    stressThreshold: number;
    motivationTriggers: string[];
  };
  biometricConsent: {
    eegEnabled: boolean;
    eyeTrackingEnabled: boolean;
    facialAnalysisEnabled: boolean;
    heartRateEnabled: boolean;
  };
}

export interface LearningSession {
  id: string;
  userId: string;
  courseId: string;
  startTime: Date;
  endTime?: Date;
  biometricData: BiometricData[];
  cognitiveStates: CognitiveState[];
  contentInteractions: any[];
  adaptations: any[];
  outcomes: {
    masteryLevel: number;
    engagementScore: number;
    retentionPrediction: number;
  };
}

export interface ImmersiveContent {
  id: string;
  type: '2d' | '3d' | 'ar' | 'vr' | 'haptic' | 'spatial_audio';
  assetUrls: string[];
  interactionSchema: any;
  adaptiveParameters: {
    difficultyScaling: boolean;
    biometricResponsive: boolean;
    environmentalAdaptive: boolean;
  };
}

export interface HapticPattern {
  id: string;
  name: string;
  sequence: Array<{
    intensity: number;
    duration: number;
    frequency?: number;
  }>;
  emotion?: EmotionalState;
  learningContext?: string;
}