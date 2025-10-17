export interface BiometricData {// AI and Biometric Interface Types for SkillBox// AI and Biometric Interface Types for SkillBoxexport interface BiometricData {

  timestamp: number;

  heartRate?: number;

  pupilDilation?: number;

  blinkRate?: number;export interface BiometricData {  eegPatterns?: number[];

  eyeMovements?: {

    x: number;  timestamp: number;

    y: number;

    velocity: number;  heartRate?: number;export interface BiometricData {  heartRate?: number;

  };

  facialExpression?: {  pupilDilation?: number;

    emotion: string;

    confidence: number;  blinkRate?: number;  timestamp: number;  gsrLevel?: number;

  };

  stressLevel?: number;  eyeMovements?: {

  attentionLevel?: number;

}    x: number;  heartRate?: number;  eyeTracking?: {



export interface CognitiveState {    y: number;

  focus: number;

  cognitiveLoad: number;    velocity: number;  pupilDilation?: number;    gazePosition: { x: number; y: number };

  comprehension: number;

  engagement: number;  };

  emotionalState: string;

  learningReadiness: number;  facialExpression?: {  blinkRate?: number;    pupilDilation: number;

  fatigue: number;

  timestamp: number;    emotion: string;

}

    confidence: number;  eyeMovements?: {  };

export interface AITutorPersonality {

  name: string;  };

  style: 'supportive' | 'challenging' | 'patient' | 'enthusiastic';

  adaptationLevel: number;  stressLevel?: number;    x: number;  facialExpressions?: {

  preferredModalities: string[];

}  attentionLevel?: number;

}    y: number;    attention: number;



export interface CognitiveState {    velocity: number;    emotion: string;

  focus: number;

  cognitiveLoad: number;  };    microExpressions: string[];

  comprehension: number;

  engagement: number;  facialExpression?: {  };

  emotionalState: string;

  learningReadiness: number;    emotion: string;  timestamp: number;

  fatigue: number;

  timestamp: number;    confidence: number;}

}

  };

export interface AITutorPersonality {

  name: string;  stressLevel?: number;export interface CognitiveState {

  style: 'supportive' | 'challenging' | 'patient' | 'enthusiastic';

  adaptationLevel: number;  attentionLevel?: number;  focusLevel: number;

  preferredModalities: string[];

}}  cognitiveLoad: number;



export interface LearningContext {  emotionalState: string;

  subject: string;

  difficulty: number;export interface CognitiveState {  brainwaveStates: {

  duration: number;

  objectives: string[];  focus: number;    alpha: number;

  prerequisites: string[];

}  cognitiveLoad: number;    beta: number;



export interface AdaptiveResponse {  comprehension: number;    theta: number;

  content: string;

  modality: string;  engagement: number;    delta: number;

  difficulty: number;

  followUpActions: string[];  emotionalState: string;  };

  biometricTriggers: string[];

}  learningReadiness: number;  learningReadiness: number;

  fatigue: number;}

  timestamp: number;

}export type EmotionalState = 

  | 'focused' 

export interface AITutorPersonality {  | 'confused' 

  name: string;  | 'excited' 

  style: 'supportive' | 'challenging' | 'patient' | 'enthusiastic';  | 'bored' 

  adaptationLevel: number;  | 'frustrated' 

  preferredModalities: string[];  | 'neutral'

}  | 'confident'

  | 'overwhelmed'

export interface LearningContext {  | 'happy';

  subject: string;

  difficulty: number;export type LearningModality = 

  duration: number;  | 'visual' 

  objectives: string[];  | 'auditory' 

  prerequisites: string[];  | 'kinesthetic' 

}  | 'reading'

  | 'spatial'

export interface AdaptiveResponse {  | 'tactile';

  content: string;

  modality: string;export interface LearnerProfile {

  difficulty: number;  userId: string;

  followUpActions: string[];  learningStyle: LearningModality[];

  biometricTriggers: string[];  preferredDifficulty: number;

}  averageFocusScore: number;
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