import { useAI } from '@/context/AIModelContext';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Optional imports - these will be undefined if packages aren't installed
let Camera: any = null;
let FaceDetector: any = null;

try {
  Camera = require('expo-camera').Camera;
} catch (e) {
  console.log('expo-camera not available');
}

try {
  FaceDetector = require('expo-face-detector');
} catch (e) {
  console.log('expo-face-detector not available');
}

interface BiometricEngagementTrackerProps {
  onEngagementChange?: (data: EngagementData) => void;
  isActive?: boolean;
  showVisualFeedback?: boolean;
}

interface EngagementData {
  focusScore: number;
  attentionLevel: 'low' | 'medium' | 'high';
  emotionalState: 'neutral' | 'positive' | 'confused' | 'frustrated';
  eyeContact: boolean;
  blinkRate: number;
  headPose: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  timestamp: number;
}

interface FaceFeature {
  leftEyeOpenProbability?: number;
  rightEyeOpenProbability?: number;
  smilingProbability?: number;
  yawAngle?: number;
  rollAngle?: number;
  bounds?: {
    origin?: { x: number; y: number };
    size?: { width: number; height: number };
  };
}

export function BiometricEngagementTracker({
  onEngagementChange,
  isActive = false,
  showVisualFeedback = true,
}: BiometricEngagementTrackerProps) {
  const { theme } = useTheme();
  const { isAIEnabled, analyzeEngagement } = useAI();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [currentEngagement, setCurrentEngagement] = useState<EngagementData | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const cameraRef = useRef<any>(null);
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const blinkCounter = useRef(0);
  const lastBlinkTime = useRef(Date.now());

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (isActive && hasPermission && isAIEnabled) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [isActive, hasPermission, isAIEnabled]);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: isTracking ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isTracking]);

  const requestCameraPermission = async () => {
    if (!Camera) {
      setHasPermission(false);
      return;
    }
    
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    blinkCounter.current = 0;
    lastBlinkTime.current = Date.now();
  };

  const stopTracking = () => {
    setIsTracking(false);
    setFaceDetected(false);
    setCurrentEngagement(null);
  };

  const handleFacesDetected = async ({ faces }: { faces: FaceFeature[] }) => {
    if (!isTracking || faces.length === 0) {
      setFaceDetected(false);
      return;
    }

    setFaceDetected(true);
    const face = faces[0]; // Use the first detected face

    try {
      // Calculate engagement metrics
      const engagementData = await calculateEngagement(face);
      setCurrentEngagement(engagementData);
      onEngagementChange?.(engagementData);
    } catch (error) {
      console.error('Engagement calculation error:', error);
    }
  };

  const calculateEngagement = async (face: FaceFeature): Promise<EngagementData> => {
    const now = Date.now();
    
    // Eye contact detection (looking at camera)
    const leftEyeOpen = face.leftEyeOpenProbability || 0;
    const rightEyeOpen = face.rightEyeOpenProbability || 0;
    const eyesOpen = (leftEyeOpen + rightEyeOpen) / 2 > 0.8;
    
    // Blink rate calculation
    if (!eyesOpen && now - lastBlinkTime.current > 100) {
      blinkCounter.current++;
      lastBlinkTime.current = now;
    }
    
    const blinkRate = blinkCounter.current / ((now - lastBlinkTime.current) / 60000); // blinks per minute

    // Head pose
    const yaw = face.yawAngle || 0;
    const pitch = face.rollAngle || 0; // Note: expo-face-detector doesn't provide pitch directly
    const roll = face.rollAngle || 0;

    // Focus score based on head pose and eye contact
    const headStability = Math.max(0, 1 - (Math.abs(yaw) + Math.abs(roll)) / 60);
    const eyeContactScore = eyesOpen ? 1 : 0;
    const focusScore = (headStability * 0.7 + eyeContactScore * 0.3) * 100;

    // Attention level
    let attentionLevel: 'low' | 'medium' | 'high';
    if (focusScore > 70) attentionLevel = 'high';
    else if (focusScore > 40) attentionLevel = 'medium';
    else attentionLevel = 'low';

    // Emotional state (simplified based on available data)
    let emotionalState: 'neutral' | 'positive' | 'confused' | 'frustrated';
    const smilingProbability = face.smilingProbability || 0;
    
    if (smilingProbability > 0.7) emotionalState = 'positive';
    else if (blinkRate > 20) emotionalState = 'frustrated'; // High blink rate might indicate stress
    else if (Math.abs(yaw) > 30) emotionalState = 'confused'; // Looking away might indicate confusion
    else emotionalState = 'neutral';

    return {
      focusScore,
      attentionLevel,
      emotionalState,
      eyeContact: eyesOpen && Math.abs(yaw) < 15,
      blinkRate,
      headPose: { yaw, pitch, roll },
      timestamp: now,
    };
  };

  const getEngagementColor = () => {
    if (!currentEngagement) return theme.colors.textTertiary;
    
    switch (currentEngagement.attentionLevel) {
      case 'high': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.error;
      default: return theme.colors.textTertiary;
    }
  };

  const getEngagementText = () => {
    if (!currentEngagement) return 'No data';
    
    return `${currentEngagement.attentionLevel.toUpperCase()} Focus (${Math.round(currentEngagement.focusScore)}%)`;
  };

  if (!hasPermission) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.permissionText, { color: theme.colors.textSecondary }]}>
          Camera access is required for engagement tracking
        </Text>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isAIEnabled) {
    return (
      <View style={[styles.disabledContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.disabledText, { color: theme.colors.textSecondary }]}>
          AI features must be enabled for engagement tracking
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isTracking && Camera && (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants?.Type?.front || 'front'}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector?.FaceDetectorMode?.fast || 'fast',
            detectLandmarks: FaceDetector?.FaceDetectorLandmarks?.all || 'all',
            runClassifications: FaceDetector?.FaceDetectorClassifications?.all || 'all',
            minDetectionInterval: 500,
            tracking: true,
          }}
        />
      )}
      
      {showVisualFeedback && (
        <Animated.View
          style={[
            styles.feedbackOverlay,
            {
              opacity: animatedOpacity,
              backgroundColor: theme.colors.surface + '90',
            }
          ]}
        >
          <View style={styles.feedbackContainer}>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: faceDetected ? theme.colors.success : theme.colors.error }
            ]} />
            
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {faceDetected ? 'Face Detected' : 'No Face Detected'}
            </Text>
            
            {currentEngagement && (
              <>
                <Text style={[
                  styles.engagementText,
                  { color: getEngagementColor() }
                ]}>
                  {getEngagementText()}
                </Text>
                
                <Text style={[styles.emotionalText, { color: theme.colors.textSecondary }]}>
                  Mood: {currentEngagement.emotionalState}
                </Text>
                
                <Text style={[styles.blinkText, { color: theme.colors.textTertiary }]}>
                  Blink Rate: {Math.round(currentEngagement.blinkRate)}/min
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  permissionText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  disabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  disabledText: {
    fontSize: 10,
    textAlign: 'center',
  },
  feedbackOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  feedbackContainer: {
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 8,
    fontWeight: '600',
    marginBottom: 2,
  },
  engagementText: {
    fontSize: 8,
    fontWeight: '600',
    marginBottom: 2,
  },
  emotionalText: {
    fontSize: 7,
    marginBottom: 1,
  },
  blinkText: {
    fontSize: 6,
  },
});
