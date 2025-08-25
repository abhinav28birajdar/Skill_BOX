// Bio-Cognitive System Configuration

export const BIOMETRIC_CONFIG = {
  // Sensor sampling rates (in ms)
  SAMPLING_RATES: {
    EEG: 250,  // 4Hz for brain wave patterns
    HEART_RATE: 1000,  // 1Hz for heart rate
    GSR: 500,  // 2Hz for galvanic skin response
    EYE_TRACKING: 33,  // 30Hz for eye tracking
    FACIAL_ANALYSIS: 100,  // 10Hz for facial expression analysis
  },

  // Cognitive state thresholds
  THRESHOLDS: {
    FOCUS: {
      LOW: 0.3,
      MEDIUM: 0.6,
      HIGH: 0.8,
    },
    COGNITIVE_LOAD: {
      LOW: 0.3,
      MEDIUM: 0.6,
      HIGH: 0.7,
    },
    LEARNING_READINESS: {
      LOW: 0.4,
      MEDIUM: 0.7,
      HIGH: 0.9,
    },
  },

  // Emotional state classifications
  EMOTIONAL_STATES: {
    FOCUSED: 'focused',
    CONFUSED: 'confused',
    EXCITED: 'excited',
    BORED: 'bored',
    FRUSTRATED: 'frustrated',
    NEUTRAL: 'neutral',
  },

  // Learning modalities
  LEARNING_MODALITIES: {
    VISUAL: 'visual',
    AUDITORY: 'auditory',
    KINESTHETIC: 'kinesthetic',
    READING: 'reading',
  },

  // Haptic feedback patterns
  HAPTIC_PATTERNS: {
    SUCCESS: [
      { intensity: 1.0, duration: 100 },
      { intensity: 0.0, duration: 50 },
      { intensity: 0.7, duration: 100 },
    ],
    WARNING: [
      { intensity: 0.7, duration: 200 },
      { intensity: 0.0, duration: 100 },
      { intensity: 0.7, duration: 200 },
    ],
    ERROR: [
      { intensity: 1.0, duration: 300 },
      { intensity: 0.0, duration: 100 },
      { intensity: 1.0, duration: 300 },
    ],
    FOCUS_PROMPT: [
      { intensity: 0.3, duration: 100 },
      { intensity: 0.0, duration: 50 },
      { intensity: 0.3, duration: 100 },
    ],
  },

  // AR/VR content adaptation
  IMMERSIVE_CONTENT: {
    RENDER_QUALITY: {
      CPU_THRESHOLD: 0.8,  // Reduce quality if CPU usage > 80%
      MEMORY_THRESHOLD: 0.9,  // Reduce quality if memory usage > 90%
      BATTERY_THRESHOLD: 0.2,  // Reduce quality if battery < 20%
    },
    SPATIAL_AUDIO: {
      ENABLED: true,
      MAX_SOURCES: 8,
      DISTANCE_MODEL: 'inverse',
      ROLLOFF_FACTOR: 1.5,
    },
    AR_FEATURES: {
      PLANE_DETECTION: true,
      LIGHT_ESTIMATION: true,
      PEOPLE_OCCLUSION: true,
      FACE_TRACKING: true,
      WORLD_TRACKING: true,
    },
  },

  // Neural feedback adaptation
  NEURAL_ADAPTATION: {
    LEARNING_RATE: 0.01,
    BATCH_SIZE: 32,
    UPDATE_INTERVAL: 5000,  // 5 seconds
    MIN_SAMPLES: 100,
    DECAY_FACTOR: 0.95,
  },

  // Privacy and security
  PRIVACY: {
    DATA_RETENTION_DAYS: 30,
    ANONYMIZATION_ENABLED: true,
    ENCRYPTION_ALGORITHM: 'AES-256-GCM',
    CONSENT_REQUIRED: true,
    LOCAL_PROCESSING_ONLY: false,
  },

  // Edge computing configuration
  EDGE_COMPUTE: {
    ENABLED: true,
    MAX_BATCH_SIZE: 64,
    INFERENCE_TIMEOUT: 100,  // ms
    MODEL_UPDATE_INTERVAL: 86400000,  // 24 hours
  },

  // Ambient intelligence
  AMBIENT: {
    LIGHT_ADAPTATION: true,
    NOISE_ADAPTATION: true,
    TEMPERATURE_MONITORING: true,
    ENVIRONMENT_SAMPLING_RATE: 60000,  // 1 minute
  },
} as const;

export const COGNITIVE_ANALYSIS = {
  // EEG frequency bands (Hz)
  BRAINWAVE_BANDS: {
    DELTA: { min: 0.5, max: 4 },
    THETA: { min: 4, max: 8 },
    ALPHA: { min: 8, max: 13 },
    BETA: { min: 13, max: 30 },
    GAMMA: { min: 30, max: 100 },
  },

  // Attention calculation weights
  ATTENTION_WEIGHTS: {
    EYE_TRACKING: 0.4,
    FACIAL_EXPRESSION: 0.3,
    BRAINWAVES: 0.3,
  },

  // Cognitive load calculation weights
  COGNITIVE_LOAD_WEIGHTS: {
    PUPIL_DILATION: 0.3,
    HEART_RATE: 0.3,
    GSR: 0.4,
  },

  // Learning readiness weights
  LEARNING_READINESS_WEIGHTS: {
    FOCUS: 0.4,
    COGNITIVE_LOAD: 0.3,
    EMOTIONAL_STATE: 0.3,
  },
} as const;

export const AI_MODELS = {
  FACIAL_ANALYSIS: {
    MODEL_PATH: 'models/facial-analysis-v2.tflite',
    INPUT_SHAPE: [1, 224, 224, 3],
    OUTPUT_CLASSES: ['neutral', 'happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted'],
    CONFIDENCE_THRESHOLD: 0.7,
  },

  ATTENTION_DETECTION: {
    MODEL_PATH: 'models/attention-detection-v1.tflite',
    UPDATE_INTERVAL: 500,  // ms
    MIN_CONFIDENCE: 0.6,
  },

  COGNITIVE_LOAD: {
    MODEL_PATH: 'models/cognitive-load-v1.tflite',
    FEATURES: ['pupil_size', 'heart_rate', 'gsr', 'eeg_alpha', 'eeg_beta'],
    WINDOW_SIZE: 30,  // seconds
  },
} as const;
