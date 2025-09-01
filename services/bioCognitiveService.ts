import { supabase } from '../lib/supabase';

export interface BiometricMetrics {
  eeg_patterns: number[];
  heart_rate: number;
  gsr_level: number;
  eye_tracking: {
    gaze_position: { x: number; y: number };
    pupil_dilation: number;
    fixation_duration: number;
  };
  facial_expressions: {
    attention: number;
    emotion: string;
    micro_expressions: string[];
    engagement_score: number;
  };
  timestamp: string;
}

export interface CognitiveMetrics {
  focus_level: number;
  cognitive_load: number;
  emotional_state: string;
  brainwave_states: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
  };
  learning_readiness: number;
  optimal_content_type: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  timestamp: string;
}

export interface BioCognitiveAnalysis {
  cognitive_state: CognitiveMetrics;
  learning_recommendations: string[];
  adaptation_required: boolean;
}

export interface ImmersiveContent {
  type: '3d' | 'ar' | 'hologram';
  content_uri?: string;
  haptic_pattern?: string;
  spatial_audio?: {
    uri: string;
    position: { x: number; y: number; z: number };
  };
  metadata?: any;
}

export class BioCognitiveService {
  static async analyzeBiometricData(
    userId: string,
    biometricData: BiometricMetrics
  ): Promise<BioCognitiveAnalysis> {
    try {
      const { data, error } = await supabase.functions.invoke('bio-cognitive-analysis', {
        body: {
          user_id: userId,
          biometric_data: biometricData,
        },
      });

      if (error) throw error;

      return {
        cognitive_state: data.cognitive_state,
        learning_recommendations: data.recommendations || [],
        adaptation_required: data.needs_adaptation || false,
      };
    } catch (error) {
      console.error('Error analyzing biometric data:', error);
      return {
        cognitive_state: {
          focus_level: 0.5,
          cognitive_load: 0.5,
          emotional_state: 'neutral',
          brainwave_states: { alpha: 0, beta: 0, theta: 0, delta: 0, gamma: 0 },
          learning_readiness: 0.5,
          optimal_content_type: 'visual',
          timestamp: new Date().toISOString()
        },
        learning_recommendations: [],
        adaptation_required: false
      };
    }
  }

  static async generateImmersiveContent(
    type: '3d' | 'ar' | 'hologram',
    context: {
      content_prompt: string;
      user_state: CognitiveMetrics;
      environment_data?: any;
    }
  ): Promise<ImmersiveContent> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-immersive-content', {
        body: {
          content_type: type,
          context,
        },
      });

      if (error) throw error;

      return {
        type,
        content_uri: data.content_uri,
        haptic_pattern: data.haptic_pattern,
        spatial_audio: data.spatial_audio,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Error generating immersive content:', error);
      return {
        type,
        content_uri: '',
        haptic_pattern: '',
      };
    }
  }

  static async generateHapticPattern(
    emotion: string,
    intensity: number
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-haptic-pattern', {
        body: {
          emotion,
          intensity,
        },
      });

      if (error) throw error;
      return data.pattern;
    } catch (error) {
      console.error('Error generating haptic pattern:', error);
      return 'light';
    }
  }

  static async updateLearningEnvironment(
    userId: string,
    cognitiveState: CognitiveMetrics
  ): Promise<{
    ui_adaptations: any;
    content_modifications: any;
    environmental_controls?: any;
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('adapt-learning-environment', {
        body: {
          user_id: userId,
          cognitive_state: cognitiveState,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating learning environment:', error);
      return {
        ui_adaptations: {},
        content_modifications: {},
      };
    }
  }
}
