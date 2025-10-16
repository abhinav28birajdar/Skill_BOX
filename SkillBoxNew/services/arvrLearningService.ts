import { CameraView } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as Haptics from 'expo-haptics';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { BIOMETRIC_CONFIG } from '../config/bioCognitiveConfig';
import { ARVRServiceState, FaceDetectionResult, HapticFeedbackType } from '../immersive/types';

export class ARVRLearningService {
  private camera: CameraView | null = null;
  private state: ARVRServiceState = {
    isTracking: false,
    lastAttentionScore: 0,
    calibrationComplete: false
  };
  private lastMotionUpdate: DeviceMotionMeasurement | null = null;
  private motionSubscription: { remove: () => void } | null = null;

  constructor() {
    this.initializeSensors();
  }

  private async initializeSensors() {
    try {
      // Note: Camera permissions will be handled by the component using useCameraPermissions hook
      console.log('ARVRLearningService initialized - camera permissions handled by components');

      // Initialize device motion tracking
      DeviceMotion.setUpdateInterval(BIOMETRIC_CONFIG.SAMPLING_RATES.EYE_TRACKING);

      this.motionSubscription = DeviceMotion.addListener(this.onMotionUpdate);
    } catch (error) {
      console.error('Failed to initialize AR/VR sensors:', error);
    }
  }

  private onMotionUpdate = (motion: DeviceMotionMeasurement) => {
    this.lastMotionUpdate = motion;
    // Trigger haptic feedback if significant motion is detected
    if (this.shouldTriggerHapticFeedback(motion)) {
      this.triggerHapticFeedback('warning');
    }
  };

  private shouldTriggerHapticFeedback(motion: DeviceMotionMeasurement): boolean {
    if (!this.lastMotionUpdate) return false;
    
    const rotationThreshold = 0.5; // radians/second
    return Math.abs(motion.rotation.gamma) > rotationThreshold;
  }

  public async triggerHapticFeedback(type: HapticFeedbackType) {
    let pattern;
    switch(type) {
      case 'success':
        pattern = BIOMETRIC_CONFIG.HAPTIC_PATTERNS.SUCCESS;
        break;
      case 'warning':
        pattern = BIOMETRIC_CONFIG.HAPTIC_PATTERNS.WARNING;
        break;
      case 'error':
        pattern = BIOMETRIC_CONFIG.HAPTIC_PATTERNS.ERROR;
        break;
      case 'focus':
        pattern = BIOMETRIC_CONFIG.HAPTIC_PATTERNS.FOCUS_PROMPT;
        break;
    }
    
    for (const step of pattern) {
      if (step.intensity >= 0.8) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (step.intensity >= 0.5) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      if (step.duration > 0) {
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
    }
  }

  public getFaceDetectionProps() {
    return {
      onFacesDetected: this.state.isTracking ? this.handleFacesDetected : undefined,
      faceDetectorSettings: {
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: BIOMETRIC_CONFIG.SAMPLING_RATES.FACIAL_ANALYSIS,
        tracking: true,
      }
    };
  }

  public setCameraRef = (ref: CameraView | null) => {
    this.camera = ref;
  };

  public startFaceTracking = async () => {
    if (!this.camera || this.state.isTracking) return;

    this.state.isTracking = true;
    this.setCameraRef(this.camera); // Update camera props with face detection
  };

  public stopFaceTracking = () => {
    if (!this.camera || !this.state.isTracking) return;

    this.state.isTracking = false;
    this.setCameraRef(this.camera); // Update camera props to remove face detection
  };

  private handleFacesDetected = (result: FaceDetectionResult) => {
    if (result.faces.length === 0) return;

    const face = result.faces[0];
    // Process face landmarks for attention detection
    this.processAttentionMetrics(face);
  };

  private processAttentionMetrics(face: FaceDetectionResult['faces'][0]) {
    // Calculate attention score based on eye state and head position
    const attentionScore = this.calculateAttentionScore(face);
    this.state.lastAttentionScore = attentionScore;
    
    if (attentionScore < BIOMETRIC_CONFIG.THRESHOLDS.FOCUS.LOW) {
      this.triggerHapticFeedback('focus');
    }
  }

  private calculateAttentionScore(face: FaceDetectionResult['faces'][0]): number {
    const eyeOpenScore = (face.leftEyeOpenProbability + face.rightEyeOpenProbability) / 2;
    const headAngleScore = 1 - (Math.abs(face.rollAngle) / 180);
    
    return eyeOpenScore * 0.6 + headAngleScore * 0.4;
  }

  public cleanup = () => {
    if (this.motionSubscription) {
      this.motionSubscription.remove();
    }
    this.stopFaceTracking();
  };

  public getState(): ARVRServiceState {
    return { ...this.state };
  }
}