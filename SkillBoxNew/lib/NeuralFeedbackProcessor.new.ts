// TensorFlow temporarily disabled for compatibility
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
import { COGNITIVE_ANALYSIS } from '../config/bioCognitiveConfig';
import { BiometricMetrics, CognitiveMetrics } from '../services/bioCognitiveService';

export class NeuralFeedbackProcessor {
  // TensorFlow models temporarily disabled
  // private attentionModel: tf.LayersModel | null = null;
  // private cognitiveLoadModel: tf.LayersModel | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // TensorFlow initialization temporarily disabled
      // await tf.ready();
      // this.attentionModel = await tf.loadLayersModel(AI_MODELS.ATTENTION_DETECTION.MODEL_PATH);
      // this.cognitiveLoadModel = await tf.loadLayersModel(AI_MODELS.COGNITIVE_LOAD.MODEL_PATH);
      console.log('NeuralFeedbackProcessor initialized (TensorFlow features disabled)');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize neural feedback processor:', error);
    }
  }

  public async processBiometricData(data: BiometricMetrics): Promise<CognitiveMetrics> {
    if (!this.isInitialized) {
      throw new Error('Neural feedback processor not initialized');
    }

    // Analyze brainwave patterns
    const brainwaveStates = await this.analyzeBrainwaves(data.eeg_patterns);

    // Calculate attention level
    const attention = await this.calculateAttention({
      eyeTracking: data.eye_tracking,
      facialExpressions: data.facial_expressions,
      brainwaves: brainwaveStates
    });

    // Calculate cognitive load
    const cognitiveLoad = await this.calculateCognitiveLoad({
      pupilSize: data.eye_tracking.pupil_dilation,
      heartRate: data.heart_rate,
      gsr: data.gsr_level,
      brainwaves: brainwaveStates
    });

    // Determine emotional state
    const emotionalState = await this.analyzeEmotionalState(data.facial_expressions);

    // Calculate learning readiness
    const learningReadiness = this.calculateLearningReadiness(attention, cognitiveLoad, emotionalState);

    // Determine optimal content type
    const optimalContentType = this.determineOptimalContentType(brainwaveStates);

    return {
      focus_level: attention,
      cognitive_load: cognitiveLoad,
      emotional_state: emotionalState,
      brainwave_states: brainwaveStates,
      learning_readiness: learningReadiness,
      optimal_content_type: optimalContentType,
      timestamp: new Date().toISOString()
    };
  }

  private async analyzeBrainwaves(eegData: number[]): Promise<{
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
  }> {
    const { BRAINWAVE_BANDS } = COGNITIVE_ANALYSIS;
    
    // Simplified FFT calculation (mock implementation)
    const fftData = eegData.map(val => val * Math.random());
    const sampleRate = 256; // Hz
    const freqResolution = sampleRate / fftData.length;

    const getPowerInBand = (band: { min: number; max: number }) => {
      const startBin = Math.floor(band.min / freqResolution);
      const endBin = Math.floor(band.max / freqResolution);
      const dataArray = Array.isArray(fftData) ? (fftData as number[]) : [fftData as number];
      return dataArray
        .slice(startBin, endBin + 1)
        .reduce((sum: number, val: number) => sum + Math.pow(Math.abs(val), 2), 0);
    };

    const dataArray = Array.isArray(fftData) ? (fftData as number[]) : [fftData as number];
    const totalPower = dataArray.reduce((sum: number, val: number) => sum + Math.pow(Math.abs(val), 2), 0);

    return {
      delta: (getPowerInBand(BRAINWAVE_BANDS.DELTA) as number) / (totalPower as number),
      theta: (getPowerInBand(BRAINWAVE_BANDS.THETA) as number) / (totalPower as number),
      alpha: (getPowerInBand(BRAINWAVE_BANDS.ALPHA) as number) / (totalPower as number),
      beta: (getPowerInBand(BRAINWAVE_BANDS.BETA) as number) / (totalPower as number),
      gamma: (getPowerInBand(BRAINWAVE_BANDS.GAMMA) as number) / (totalPower as number),
    };
  }

  private async calculateAttention(data: {
    eyeTracking: BiometricMetrics['eye_tracking'];
    facialExpressions: BiometricMetrics['facial_expressions'];
    brainwaves: { alpha: number; beta: number; theta: number; delta: number; gamma: number; };
  }): Promise<number> {
    const { ATTENTION_WEIGHTS } = COGNITIVE_ANALYSIS;

    // Eye tracking component
    const eyeScore = data.eyeTracking.fixation_duration;

    // Facial expression component
    const faceScore = data.facialExpressions.attention;

    // Brainwave component (alpha/beta ratio indicates relaxed focus)
    const brainwaveScore = data.brainwaves.alpha / (data.brainwaves.beta + 0.01);

    // Weighted combination
    const attention = (
      eyeScore * ATTENTION_WEIGHTS.EYE_TRACKING +
      faceScore * ATTENTION_WEIGHTS.FACIAL_EXPRESSION +
      brainwaveScore * ATTENTION_WEIGHTS.BRAINWAVES
    );

    return Math.max(0, Math.min(1, attention));
  }

  private async calculateCognitiveLoad(data: {
    pupilSize: number;
    heartRate: number;
    gsr: number;
    brainwaves: { alpha: number; beta: number; theta: number; delta: number; gamma: number; };
  }): Promise<number> {
    // High cognitive load indicators:
    // - Increased pupil dilation
    // - Elevated heart rate
    // - Higher GSR (stress)
    // - Increased beta waves

    const pupilFactor = Math.min(1, data.pupilSize / 8); // Normalize pupil size
    const heartRateFactor = Math.min(1, (data.heartRate - 60) / 40); // Normalize heart rate above resting
    const gsrFactor = Math.min(1, data.gsr / 10); // Normalize GSR
    const brainwaveFactor = data.brainwaves.beta; // High beta indicates analytical thinking

    const cognitiveLoad = (pupilFactor + heartRateFactor + gsrFactor + brainwaveFactor) / 4;

    return Math.max(0, Math.min(1, cognitiveLoad));
  }

  private async analyzeEmotionalState(facialData: BiometricMetrics['facial_expressions']): Promise<string> {
    // Simple emotion analysis based on engagement score and existing emotion data
    if (facialData.engagement_score > 0.8) return 'excited';
    if (facialData.engagement_score > 0.6) return 'engaged';
    if (facialData.engagement_score > 0.4) return 'neutral';
    if (facialData.engagement_score > 0.2) return 'bored';
    return 'disengaged';
  }

  private calculateLearningReadiness(attention: number, cognitiveLoad: number, emotionalState: string): number {
    // Optimal learning requires balanced attention and cognitive load
    const attentionScore = attention;
    const loadScore = 1 - Math.abs(cognitiveLoad - 0.5) * 2; // Optimal at moderate load
    const emotionScore = emotionalState === 'engaged' ? 1 : 
                        emotionalState === 'excited' ? 0.8 :
                        emotionalState === 'neutral' ? 0.6 : 0.3;

    return (attentionScore + loadScore + emotionScore) / 3;
  }

  private determineOptimalContentType(
    brainwaves: { alpha: number; beta: number; theta: number; delta: number; gamma: number; }
  ): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    // High beta waves indicate analytical thinking - good for reading
    if (brainwaves.beta > 0.6) return 'reading';
    
    // High alpha waves indicate relaxed focus - good for visual learning
    if (brainwaves.alpha > 0.6) return 'visual';
    
    // High theta waves indicate deep learning state - good for kinesthetic
    if (brainwaves.theta > 0.4) return 'kinesthetic';
    
    // Default to auditory for balanced states
    return 'auditory';
  }

  public cleanup() {
    this.isInitialized = false;
    // TensorFlow cleanup temporarily disabled
    // this.attentionModel?.dispose();
    // this.cognitiveLoadModel?.dispose();
  }
}
