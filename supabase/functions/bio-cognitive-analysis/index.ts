// @ts-nocheck - This is a Deno edge function, not React Native
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { supabaseClient } from '../_shared/supabaseClient.ts'

interface BiometricData {
  eeg_patterns: number[]
  heart_rate: number
  gsr_level: number
  eye_tracking: {
    gaze_position: { x: number; y: number }
    pupil_dilation: number
    fixation_duration: number
  }
  facial_expressions: {
    attention: number
    emotion: string
    micro_expressions: string[]
    engagement_score: number
  }
  timestamp: string
}

interface CognitiveState {
  focus_level: number
  cognitive_load: number
  emotional_state: string
  brainwave_states: {
    alpha: number
    beta: number
    theta: number
    delta: number
  }
  learning_readiness: number
  optimal_content_type: 'visual' | 'auditory' | 'kinesthetic' | 'reading'
  timestamp: string
}

serve(async (req: Request) => {
  try {
    const { user_id, biometric_data } = await req.json()
    
    // Validate input
    if (!user_id || !biometric_data) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Process biometric data
    const cognitiveState = await analyzeBiometricData(biometric_data)

    // Store in bio-cognitive history
    await supabaseClient
      .from('bio_cognitive_history')
      .insert([{
        user_id,
        biometric_data,
        cognitive_state: cognitiveState,
        timestamp: new Date().toISOString(),
      }])

    // Get learning recommendations based on cognitive state
    const recommendations = await generateRecommendations(cognitiveState)

    return new Response(
      JSON.stringify({
        cognitive_state: cognitiveState,
        recommendations,
        needs_adaptation: cognitiveState.cognitive_load > 0.7 || cognitiveState.focus_level < 0.3,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function analyzeBiometricData(data: BiometricData): Promise<CognitiveState> {
  // Calculate focus level
  const focusLevel = calculateFocusLevel(data)

  // Calculate cognitive load
  const cognitiveLoad = calculateCognitiveLoad(data)

  // Determine emotional state
  const emotionalState = determineEmotionalState(data)

  // Process brainwave patterns
  const brainwaveStates = processBrainwaves(data.eeg_patterns)

  // Calculate learning readiness
  const learningReadiness = calculateLearningReadiness(focusLevel, cognitiveLoad, emotionalState)

  // Determine optimal content type
  const optimalContentType = determineOptimalContentType(learningReadiness, brainwaveStates)

  return {
    focus_level: focusLevel,
    cognitive_load: cognitiveLoad,
    emotional_state: emotionalState,
    brainwave_states: brainwaveStates,
    learning_readiness: learningReadiness,
    optimal_content_type: optimalContentType,
    timestamp: new Date().toISOString(),
  }
}

function calculateFocusLevel(data: BiometricData): number {
  const eyeAttention = data.eye_tracking.fixation_duration * 0.4
  const facialAttention = data.facial_expressions.attention * 0.3
  const brainwaveAttention = calculateBrainwaveAttention(data.eeg_patterns) * 0.3
  return Math.min(1, Math.max(0, eyeAttention + facialAttention + brainwaveAttention))
}

function calculateCognitiveLoad(data: BiometricData): number {
  const pupilFactor = data.eye_tracking.pupil_dilation * 0.3
  const hrFactor = (data.heart_rate - 60) / 100 * 0.3
  const gsrFactor = data.gsr_level * 0.4
  return Math.min(1, Math.max(0, pupilFactor + hrFactor + gsrFactor))
}

function determineEmotionalState(data: BiometricData): string {
  return data.facial_expressions.emotion
}

function processBrainwaves(eegPatterns: number[]): { 
  alpha: number
  beta: number
  theta: number
  delta: number 
} {
  // Process raw EEG data into frequency bands
  // This is a simplified version - real implementation would use FFT
  return {
    alpha: eegPatterns[0] || 0,
    beta: eegPatterns[1] || 0,
    theta: eegPatterns[2] || 0,
    delta: eegPatterns[3] || 0,
  }
}

function calculateLearningReadiness(focusLevel: number, cognitiveLoad: number, emotionalState: string): number {
  const emotionalFactor = emotionalState === 'focused' ? 1 :
                         emotionalState === 'excited' ? 0.8 :
                         emotionalState === 'neutral' ? 0.6 :
                         emotionalState === 'bored' ? 0.4 : 0.2

  return Math.min(1, Math.max(0, 
    (focusLevel * 0.4) + 
    ((1 - cognitiveLoad) * 0.3) + 
    (emotionalFactor * 0.3)
  ))
}

function determineOptimalContentType(
  learningReadiness: number,
  brainwaves: { alpha: number; beta: number; theta: number; delta: number }
): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
  // High beta waves indicate analytical thinking - good for reading
  if (brainwaves.beta > 0.6) return 'reading'
  
  // High alpha waves indicate relaxed focus - good for visual learning
  if (brainwaves.alpha > 0.6) return 'visual'
  
  // High theta waves indicate deep learning state - good for kinesthetic
  if (brainwaves.theta > 0.6) return 'kinesthetic'
  
  // Default to auditory for balanced or uncertain states
  return 'auditory'
}

function calculateBrainwaveAttention(eegPatterns: number[]): number {
  const [alpha, beta, theta, delta] = eegPatterns
  // Higher beta and lower theta generally indicates attention
  return Math.min(1, Math.max(0, (beta * 0.6) - (theta * 0.4)))
}

async function generateRecommendations(cognitiveState: CognitiveState): Promise<string[]> {
  const recommendations: string[] = []
  
  if (cognitiveState.focus_level < 0.3) {
    recommendations.push('Take a short break')
    recommendations.push('Try mindfulness exercises')
  }
  
  if (cognitiveState.cognitive_load > 0.7) {
    recommendations.push('Break content into smaller chunks')
    recommendations.push('Review foundational concepts')
  }
  
  if (cognitiveState.learning_readiness < 0.5) {
    recommendations.push('Switch to interactive exercises')
    recommendations.push('Try a different learning modality')
  }

  switch (cognitiveState.optimal_content_type) {
    case 'visual':
      recommendations.push('Use more diagrams and visual aids')
      break
    case 'auditory':
      recommendations.push('Try audio explanations or discussions')
      break
    case 'kinesthetic':
      recommendations.push('Engage in hands-on exercises')
      break
    case 'reading':
      recommendations.push('Focus on text-based materials')
      break
  }

  return recommendations
}
