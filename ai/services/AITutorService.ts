import { BiometricData, CognitiveState, AITutorPersonality } from '../models/interfaces';
import { BIOMETRIC_CONFIG, COGNITIVE_ANALYSIS } from '../../config/bioCognitiveConfig';

export type { AITutorPersonality };

export interface LearningContent {
  id: string;
  title: string;
  difficulty: number;
  type: string;
  content: string;
}

export interface TutorResponse {
  content: string;
  followUpActions: string[];
  modality: string;
  difficulty: number;
}

export class AITutorService {
  protected tutorPersonality: AITutorPersonality;
  
  constructor(personality?: AITutorPersonality) {
    this.tutorPersonality = personality || {
      name: 'Default Tutor',
      style: 'supportive',
      adaptationLevel: 0.5,
      preferredModalities: ['text', 'visual']
    };
  }

  async generateResponse(
    userInput: string,
    currentCognitiveState: CognitiveState,
    learningHistory: any[] = []
  ): Promise<TutorResponse> {
    // This is a base method that should be implemented by subclasses
    throw new Error('Method not implemented in base class');
  }

  async analyzeBiometricData(data: BiometricData): Promise<CognitiveState> {
    // Process biometric data to derive cognitive state
    const focus = this.calculateFocus(data);
    const cognitiveLoad = this.calculateCognitiveLoad(data);
    const engagement = this.calculateEngagement(data, cognitiveLoad);
    const emotionalState = this.inferEmotionalState(data);
    const comprehension = this.estimateComprehension(focus, cognitiveLoad);
    const fatigue = this.estimateFatigue(data);
    const learningReadiness = this.calculateLearningReadiness(focus, cognitiveLoad, emotionalState);
    const focusLevel = focus;
    
    return {
      focus,
      focusLevel,
      cognitiveLoad,
      comprehension,
      engagement,
      emotionalState,
      learningReadiness,
      fatigue,
      timestamp: Date.now()
    };
  }

  private calculateFocus(biometricData: BiometricData): number {
    // Calculate focus level based on biometric data
    let focusScore = 0.5; // Default mid-level focus
    
    // Get focus from facial attention if available
    if (biometricData.facialExpressions?.attention) {
      focusScore = biometricData.facialExpressions.attention;
    }
    
    // Combine with blink rate if available
    if (biometricData.blinkRate) {
      // Normalize blink rate to focus score (lower blink rate = higher focus, within normal range)
      const normalizedBlinkRate = Math.min(Math.max(0, 1 - (biometricData.blinkRate - 5) / 15), 1);
      focusScore = (focusScore * 0.7) + (normalizedBlinkRate * 0.3);
    }
    
    return focusScore;
  }

  private calculateCognitiveLoad(biometricData: BiometricData): number {
    // Calculate cognitive load based on biometric data
    let loadScore = 0.5; // Default mid-level cognitive load
    
    // Use pupil dilation as primary indicator if available
    if (biometricData.eyeTracking?.pupilDilation) {
      // Normalize pupil dilation (higher dilation = higher cognitive load)
      loadScore += (biometricData.eyeTracking.pupilDilation - 0.5) * 0.4;
    }
    
    // Use heart rate variance as secondary indicator if available
    if (biometricData.heartRate) {
      // Simplified model: higher heart rate = higher cognitive load
      const heartRateNormalized = Math.min(Math.max(0, (biometricData.heartRate - 60) / 60), 1);
      loadScore = (loadScore * 0.7) + (heartRateNormalized * 0.3);
    }
    
    return Math.min(Math.max(0, loadScore), 1);
  }
  
  private calculateEngagement(biometricData: BiometricData, cognitiveLoad: number): number {
    // Calculate engagement level based on biometric data and cognitive load
    // Engagement is a combination of attention and emotional response
    let engagement = 0.5; // Default mid-level engagement
    
    // Use cognitive load as a factor (moderate cognitive load is ideal for engagement)
    const optimalLoad = 1 - Math.abs(cognitiveLoad - 0.6) * 2; 
    
    // Combine with attention if available
    if (biometricData.attentionLevel) {
      engagement = (optimalLoad * 0.4) + (biometricData.attentionLevel * 0.6);
    } else {
      engagement = optimalLoad;
    }
    
    return Math.min(Math.max(0, engagement), 1);
  }
  
  private inferEmotionalState(biometricData: BiometricData): string {
    // Infer emotional state based on biometric data
    if (biometricData.facialExpressions?.emotion) {
      return biometricData.facialExpressions.emotion;
    }
    
    // Default to neutral if no facial expression data
    return 'neutral';
  }
  
  private estimateComprehension(focus: number, cognitiveLoad: number): number {
    // Estimate comprehension based on focus and cognitive load
    // Optimal comprehension is high focus with moderate cognitive load
    let comprehension = focus * 0.6;
    
    // Cognitive load has a curved relationship with comprehension
    // Too low or too high cognitive load reduces comprehension
    const cognitiveLoadFactor = 1 - Math.abs(cognitiveLoad - 0.5) * 2;
    comprehension *= cognitiveLoadFactor;
    
    return Math.min(Math.max(0, comprehension), 1);
  }
  
  private estimateFatigue(biometricData: BiometricData): number {
    // Estimate fatigue based on biometric data
    let fatigueScore = 0.3; // Default low-moderate fatigue
    
    // Use blink rate as a primary indicator if available
    if (biometricData.blinkRate) {
      // Higher blink rate indicates more fatigue
      fatigueScore = Math.min(biometricData.blinkRate / 30, 1);
    }
    
    return fatigueScore;
  }
  
  private calculateLearningReadiness(focus: number, cognitiveLoad: number, emotionalState: string): number {
    // Calculate learning readiness based on cognitive factors
    // Map emotional state to a numeric value for calculation
    let emotionalPositivity = 0.5;
    switch(emotionalState.toLowerCase()) {
      case 'happy': case 'excited': case 'confident':
        emotionalPositivity = 0.9;
        break;
      case 'neutral': case 'calm':
        emotionalPositivity = 0.7;
        break;
      case 'confused': case 'frustrated':
        emotionalPositivity = 0.3;
        break;
      case 'bored': case 'disengaged':
        emotionalPositivity = 0.2;
        break;
      case 'stressed': case 'overwhelmed':
        emotionalPositivity = 0.1;
        break;
    }
    
    // Weighted combination of factors
    const learningReadiness = 
      focus * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.FOCUS +
      (1 - Math.abs(cognitiveLoad - 0.6)) * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.COGNITIVE_LOAD +
      emotionalPositivity * COGNITIVE_ANALYSIS.LEARNING_READINESS_WEIGHTS.EMOTIONAL_STATE;
    
    return Math.min(Math.max(0, learningReadiness), 1);
  }

  // Additional methods for cognitive state analysis and adaptation
  private adaptToFocusLevel(cognitiveState: CognitiveState) {
    if (cognitiveState.focusLevel < BIOMETRIC_CONFIG.THRESHOLDS.FOCUS.LOW) {
      return {
        type: 'attention_prompt',
        content: 'I notice your focus might be drifting. Let\'s try a more engaging approach.',
        modalityChange: 'interactive'
      };
    }
    return null;
  }
  
  private adaptToCognitiveLoad(cognitiveState: CognitiveState) {
    if (cognitiveState.cognitiveLoad > BIOMETRIC_CONFIG.THRESHOLDS.COGNITIVE_LOAD.HIGH) {
      return {
        type: 'simplify',
        content: 'Let\'s break this down into simpler concepts to make it easier to process.',
        difficultyChange: -0.2
      };
    }
    return null;
  }
  
  private adaptToLearningReadiness(cognitiveState: CognitiveState) {
    if (cognitiveState.learningReadiness > BIOMETRIC_CONFIG.THRESHOLDS.LEARNING_READINESS.HIGH) {
      return {
        type: 'challenge',
        content: 'You seem ready for a more challenging concept. Let\'s explore something more advanced.',
        difficultyChange: 0.2
      };
    }
    return null;
  }
  
  protected adaptResponseToCognitiveState(
    baseResponse: TutorResponse,
    cognitiveState: CognitiveState
  ): TutorResponse {
    const adaptations = [
      this.adaptToFocusLevel(cognitiveState),
      this.adaptToCognitiveLoad(cognitiveState),
      this.adaptToLearningReadiness(cognitiveState)
    ].filter(Boolean);
    
    if (adaptations.length === 0) {
      return baseResponse;
    }
    
    const response = { ...baseResponse };
    
    // Apply adaptations
    adaptations.forEach(adaptation => {
      if (!adaptation) return;
      
      // Add adaptation content as a follow-up action
      response.followUpActions.push(adaptation.content);
      
      // Adjust difficulty if specified
      if ('difficultyChange' in adaptation) {
        response.difficulty = Math.max(0, Math.min(1, response.difficulty + (adaptation as any).difficultyChange));
      }
      
      // Change modality if specified
      if ('modalityChange' in adaptation) {
        response.modality = (adaptation as any).modalityChange;
      }
    });
    
    return response;
  }
  
  protected createRealtimeAdaptation(currentBiometrics: BiometricData): string[] {
    const adaptations: string[] = [];
    
    // Check focus level
    if (currentBiometrics.attentionLevel && currentBiometrics.attentionLevel < 0.4) {
      adaptations.push("I notice you may be distracted. Let's refocus.");
    }
    
    // Check stress level
    if (currentBiometrics.stressLevel && currentBiometrics.stressLevel > 0.7) {
      adaptations.push("You seem a bit stressed. Let's take a short break or approach this differently.");
    }
    
    return adaptations;
  }
}