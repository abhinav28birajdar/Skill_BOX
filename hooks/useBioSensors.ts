import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { DeviceMotion, DeviceMotionMeasurement } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { BiometricData } from '../ai/models/interfaces';
import { BIOMETRIC_CONFIG } from '../config/bioCognitiveConfig';

export interface BiometricSensorData {
  motion: DeviceMotionMeasurement | null;
  faceData: any | null;
  isTracking: boolean;
  permissions: {
    camera: boolean;
    motion: boolean;
  };
}

export function useBioSensors() {
  const [sensorData, setSensorData] = useState<BiometricSensorData>({
    motion: null,
    faceData: null,
    isTracking: false,
    permissions: {
      camera: false,
      motion: false
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const motionSubscription = useRef<any>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    initializeSensors();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeSensors = async () => {
    try {
      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      
      // Setup device motion
      DeviceMotion.setUpdateInterval(BIOMETRIC_CONFIG.SAMPLING_RATES.EYE_TRACKING);
      
      setSensorData(prev => ({
        ...prev,
        permissions: {
          camera: cameraStatus === 'granted',
          motion: true // DeviceMotion doesn't require explicit permission
        }
      }));

      if (cameraStatus === 'granted') {
        await startFaceTracking();
      }

      await startMotionTracking();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing bio sensors:', error);
    }
  };

  const startFaceTracking = async () => {
    if (!sensorData.permissions.camera) return;

    setSensorData(prev => ({
      ...prev,
      isTracking: true
    }));
  };

  const startMotionTracking = async () => {
    if (motionSubscription.current) return;

    motionSubscription.current = DeviceMotion.addListener((motionData) => {
      setSensorData(prev => ({
        ...prev,
        motion: motionData
      }));
    });
  };

  const stopTracking = () => {
    if (motionSubscription.current) {
      motionSubscription.current.remove();
      motionSubscription.current = null;
    }

    setSensorData(prev => ({
      ...prev,
      isTracking: false,
      motion: null,
      faceData: null
    }));
  };

  const cleanup = () => {
    stopTracking();
  };

  const onFacesDetected = ({ faces }: { faces: any[] }) => {
    if (faces.length > 0) {
      setSensorData(prev => ({
        ...prev,
        faceData: faces[0]
      }));
    }
  };

  const getCameraProps = () => ({
    ref: cameraRef,
    onFacesDetected: sensorData.isTracking ? onFacesDetected : undefined,
    faceDetectorSettings: {
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      runClassifications: FaceDetector.FaceDetectorClassifications.all,
      minDetectionInterval: BIOMETRIC_CONFIG.SAMPLING_RATES.FACIAL_ANALYSIS,
      tracking: true,
    }
  });

  const getCurrentBiometricData = (): BiometricData => {
    return {
      timestamp: Date.now(),
      heartRate: undefined, // Would integrate with HealthKit/Google Fit
      gsrLevel: undefined, // Would integrate with external sensors
      eegPatterns: undefined, // Would integrate with BCI devices
      eyeTracking: sensorData.faceData ? {
        gazePosition: { x: 0.5, y: 0.5 }, // Calculate from face data
        pupilDilation: sensorData.faceData.leftEyeOpenProbability || 0.5
      } : undefined,
      facialExpressions: sensorData.faceData ? {
        attention: calculateAttentionScore(sensorData.faceData),
        emotion: determineEmotion(sensorData.faceData),
        microExpressions: []
      } : undefined
    };
  };

  return {
    sensorData,
    isInitialized,
    startFaceTracking,
    stopTracking,
    getCameraProps,
    getCurrentBiometricData
  };
}

function calculateAttentionScore(faceData: any): number {
  if (!faceData) return 0.5;
  
  const eyeOpenScore = (faceData.leftEyeOpenProbability + faceData.rightEyeOpenProbability) / 2;
  const headAngleScore = 1 - (Math.abs(faceData.rollAngle) / 180);
  
  return eyeOpenScore * 0.6 + headAngleScore * 0.4;
}

function determineEmotion(faceData: any): string {
  if (!faceData) return 'neutral';
  
  // Simplified emotion detection based on face detector results
  if (faceData.smilingProbability > 0.7) return 'happy';
  if (faceData.leftEyeOpenProbability < 0.3 && faceData.rightEyeOpenProbability < 0.3) return 'tired';
  
  return 'neutral';
}
