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
  }
} as const;

export const COGNITIVE_ANALYSIS = {
  ATTENTION_THRESHOLD: 0.7,
  STRESS_THRESHOLD: 0.6,
  ENGAGEMENT_THRESHOLD: 0.75,
  COMPREHENSION_THRESHOLD: 0.8,
  FATIGUE_THRESHOLD: 0.4
} as const;
