
export interface FaceDetectionResult {
  faces: Array<{
    leftEyeOpenProbability: number;
    rightEyeOpenProbability: number;
    rollAngle: number;
    yawAngle: number;
    pitchAngle: number;
    bounds: {
      origin: { x: number; y: number };
      size: { width: number; height: number };
    };
  }>;
}

export type HapticFeedbackType = 'success' | 'warning' | 'error' | 'focus';

export interface ARVRServiceState {
  isTracking: boolean;
  lastAttentionScore: number;
  calibrationComplete: boolean;
}