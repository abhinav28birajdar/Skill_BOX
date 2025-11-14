// Biometric and Cognitive Configuration for SkillBox AI
export const BIOMETRIC_CONFIG = {
  FACE_DETECTION: {
    enabled: true,
    detectionInterval: 1000, // ms
    minConfidence: 0.8,
    trackLandmarks: true,
    trackExpressions: true
  },
  EYE_TRACKING: {
    enabled: true,
    samplingRate: 30, // Hz
    calibrationRequired: true
  },
  HEART_RATE: {
    enabled: true,
    method: 'CAMERA_PPG', // Photoplethysmography via camera
    samplingWindow: 30000 // ms
  },
  COGNITIVE_LOAD: {
    enabled: true,
    indicators: ['PUPIL_DILATION', 'BLINK_RATE', 'FACIAL_MICRO_EXPRESSIONS'],
    analysisInterval: 5000 // ms
  },
  AMBIENT: {
    ENVIRONMENT_SAMPLING_RATE: 1000
  },
  SAMPLING_RATES: {
    EYE_TRACKING: 30,
    FACIAL_ANALYSIS: 1000
  },
  HAPTIC_PATTERNS: {
    SUCCESS: [{ intensity: 0.8, duration: 200 }],
    WARNING: [{ intensity: 0.6, duration: 300 }],
    ERROR: [{ intensity: 1.0, duration: 500 }],
    FOCUS_PROMPT: [{ intensity: 0.4, duration: 100 }],
    FOCUS: [{ intensity: 0.4, duration: 100 }]
  },
  THRESHOLDS: {
    FOCUS: {
      LOW: 0.3,
      MEDIUM: 0.5,
      HIGH: 0.8
    },
    COGNITIVE_LOAD: {
      LOW: 0.2,
      MEDIUM: 0.5,
      HIGH: 0.8
    },
    LEARNING_READINESS: {
      LOW: 0.3,
      MEDIUM: 0.5,
      HIGH: 0.8
    }
  }
} as const;

export const COGNITIVE_ANALYSIS = {
  ATTENTION_THRESHOLD: 0.7,
  STRESS_THRESHOLD: 0.6,
  ENGAGEMENT_THRESHOLD: 0.75,
  COMPREHENSION_THRESHOLD: 0.8,
  FATIGUE_THRESHOLD: 0.4,
  LEARNING_READINESS_WEIGHTS: {
    FOCUS: 0.4,
    COGNITIVE_LOAD: 0.3,
    EMOTIONAL_STATE: 0.3
  },
  BRAINWAVE_BANDS: {
    ALPHA: { min: 8, max: 13 },
    BETA: { min: 13, max: 30 },
    THETA: { min: 4, max: 8 },
    DELTA: { min: 1, max: 4 },
    GAMMA: { min: 30, max: 100 }
  },
  ATTENTION_WEIGHTS: {
    ALPHA: 0.3,
    BETA: 0.5,
    THETA: -0.2,
    EYE_TRACKING: 0.4,
    FACIAL_EXPRESSION: 0.3,
    BRAINWAVES: 0.3
  }
} as const;
