import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { AI_MODELS, COGNITIVE_ANALYSIS } from '../config/bioCognitiveConfig';
import { BiometricMetrics, CognitiveMetrics } from '../services/bioCognitiveService';

export class NeuralFeedbackProcessor {
  private attentionModel: tf.LayersModel | null = null;
  private cognitiveLoadModel: tf.LayersModel | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      await tf.ready();
      this.attentionModel = await tf.loadLayersModel(AI_MODELS.ATTENTION_DETECTION.MODEL_PATH);
      this.cognitiveLoadModel = await tf.loadLayersModel(AI_MODELS.COGNITIVE_LOAD.MODEL_PATH);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing neural feedback processor:', error);
    }
  }

  public async processBiometricData(data: BiometricMetrics): Promise<CognitiveMetrics> {
    if (!this.isInitialized) {
      throw new Error('Neural feedback processor not initialized');
    }

    // Process EEG data
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
      eegAlpha: brainwaveStates.alpha,
      eegBeta: brainwaveStates.beta
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
  }> {
    const { BRAINWAVE_BANDS } = COGNITIVE_ANALYSIS;

    // Convert time-domain EEG data to frequency domain using FFT
    const fftData = await tf.spectral.rfft(tf.tensor1d(eegData)).array();

    // Calculate power in each frequency band
    const sampleRate = 250; // Hz
    const freqResolution = sampleRate / eegData.length;

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
    const facialScore = data.facialExpressions.attention;

    // Brainwave component (high beta/theta ratio indicates attention)
    const brainwaveScore = data.brainwaves.beta / (data.brainwaves.theta + 0.1);

    return ATTENTION_WEIGHTS.EYE_TRACKING * eyeScore +
           ATTENTION_WEIGHTS.FACIAL_EXPRESSION * facialScore +
           ATTENTION_WEIGHTS.BRAINWAVES * Math.min(1, brainwaveScore);
  }

  private async calculateCognitiveLoad(data: {
    pupilSize: number;
    heartRate: number;
    gsr: number;
    eegAlpha: number;
    eegBeta: number;
  }): Promise<number> {
    const { COGNITIVE_LOAD_WEIGHTS } = COGNITIVE_ANALYSIS;

    if (!this.cognitiveLoadModel) return 0.5;

    const inputTensor = tf.tensor2d([[
      data.pupilSize,
      data.heartRate,
      data.gsr,
      data.eegAlpha,
      data.eegBeta
    ]]);

    const prediction = this.cognitiveLoadModel.predict(inputTensor) as tf.Tensor;
    const cognitiveLoad = (await prediction.data())[0];

    inputTensor.dispose();
    prediction.dispose();

    return cognitiveLoad;
  }

  private async analyzeEmotionalState(
    facialData: BiometricMetrics['facial_expressions']
  ): Promise<string> {
    return facialData.emotion;
  }

  private calculateLearningReadiness(
    attention: number,
    cognitiveLoad: number,
    emotionalState: string
  ): number {
    const { LEARNING_READINESS_WEIGHTS } = COGNITIVE_ANALYSIS;

    const emotionalFactor = 
      emotionalState === 'focused' ? 1.0 :
      emotionalState === 'excited' ? 0.8 :
      emotionalState === 'neutral' ? 0.6 :
      emotionalState === 'bored' ? 0.4 : 0.2;

    return (
      attention * LEARNING_READINESS_WEIGHTS.FOCUS +
      (1 - cognitiveLoad) * LEARNING_READINESS_WEIGHTS.COGNITIVE_LOAD +
      emotionalFactor * LEARNING_READINESS_WEIGHTS.EMOTIONAL_STATE
    );
  }

  private determineOptimalContentType(
    brainwaves: { alpha: number; beta: number; theta: number; delta: number; gamma: number; }
  ): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    // High beta waves indicate analytical thinking - good for reading
    if (brainwaves.beta > 0.6) return 'reading';
    
    // High alpha waves indicate relaxed focus - good for visual learning
    if (brainwaves.alpha > 0.6) return 'visual';
    
    // High theta waves indicate deep learning state - good for kinesthetic
    if (brainwaves.theta > 0.6) return 'kinesthetic';
    
    // Default to auditory for balanced or uncertain states
    return 'auditory';
  }

  public dispose() {
    if (this.attentionModel) {
      this.attentionModel.dispose();
      this.attentionModel = null;
    }
    if (this.cognitiveLoadModel) {
      this.cognitiveLoadModel.dispose();
      this.cognitiveLoadModel = null;
    }
    this.isInitialized = false;
  }
}
