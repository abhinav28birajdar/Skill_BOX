import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useBioSensors } from '../../hooks/useBioSensors';
import { useCognitiveLoad } from '../../hooks/useCognitiveLoad';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface ImmersiveARLearningProps {
  lessonContent: {
    id: string;
    title: string;
    arModels: any[];
    concepts: string[];
    interactionPoints: any[];
  };
  onProgress: (progress: number) => void;
  onComplete: () => void;
}

interface ARObject {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
  type: 'model' | 'text' | 'interactive';
  content: any;
  cognitiveLoad: number;
}

export function ImmersiveARLearning({
  lessonContent,
  onProgress,
  onComplete
}: ImmersiveARLearningProps) {
  const { theme } = useTheme();
  const bioSensors = useBioSensors();
  const cognitiveAnalysis = useCognitiveLoad(bioSensors.getCurrentBiometricData());
  const { cognitiveState } = cognitiveAnalysis;
  
  const cognitiveLoad = cognitiveState.cognitiveLoad;
  const focusLevel = cognitiveState.focusLevel;
  const learningReadiness = cognitiveState.learningReadiness;

  // AR and tracking states
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [faceData, setFaceData] = useState<any>(null);
  const [arObjects, setArObjects] = useState<ARObject[]>([]);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [learningProgress, setLearningProgress] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  // Gesture handling
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        handleGestureInteraction(evt, gestureState);
      },
      onPanResponderRelease: () => {
        handleGestureEnd();
      },
    })
  ).current;

  useEffect(() => {
    initializeARSession();
  }, []);

  useEffect(() => {
    adaptARBasedOnCognition();
  }, [cognitiveLoad, focusLevel, learningReadiness]);

  useEffect(() => {
    if (faceData) {
      updateGazeFocus();
    }
  }, [faceData]);

  const initializeARSession = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');

    if (status === 'granted') {
      initializeARContent();
      startARSession();
    }
  };

  const initializeARContent = () => {
    // Convert lesson content to AR objects
    const initialObjects: ARObject[] = lessonContent.arModels.map((model, index) => ({
      id: `model_${index}`,
      position: { x: 0, y: 0, z: -2 - index },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
      type: 'model',
      content: model,
      cognitiveLoad: 0.3
    }));

    // Add interactive elements
    lessonContent.interactionPoints.forEach((point, index) => {
      initialObjects.push({
        id: `interaction_${index}`,
        position: { x: point.x || 0, y: point.y || 0, z: point.z || -1 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.8,
        type: 'interactive',
        content: point,
        cognitiveLoad: 0.5
      });
    });

    setArObjects(initialObjects);
  };

  const startARSession = () => {
    setIsARActive(true);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Provide haptic feedback for session start
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const adaptARBasedOnCognition = () => {
    if (!isARActive) return;

    // Adjust AR complexity based on cognitive load
    if (cognitiveLoad > 0.8) {
      simplifyARExperience();
    } else if (cognitiveLoad < 0.3 && focusLevel > 0.7) {
      enhanceARComplexity();
    }

    // Adjust visual elements based on attention
    if (focusLevel < 0.5) {
      highlightImportantElements();
    }

    // Provide adaptive guidance
    if (learningReadiness > 0.8) {
      introduceAdvancedConcepts();
    }
  };

  const simplifyARExperience = () => {
    // Reduce number of active AR objects
    const simplifiedObjects = arObjects.filter(obj => obj.cognitiveLoad <= 0.4);
    setArObjects(simplifiedObjects);

    // Slow down animations
    Animated.timing(rotationAnim, {
      toValue: 0.5,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Provide gentle haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const enhanceARComplexity = () => {
    // Add more interactive elements
    const enhancedObjects = [...arObjects];
    
    // Add secondary information layers
    lessonContent.concepts.forEach((concept, index) => {
      if (!arObjects.find(obj => obj.id === `concept_${index}`)) {
        enhancedObjects.push({
          id: `concept_${index}`,
          position: { x: 1 + index * 0.5, y: 0.5, z: -1.5 },
          rotation: { x: 0, y: 0, z: 0 },
          scale: 0.6,
          type: 'text',
          content: { text: concept, detail: true },
          cognitiveLoad: 0.6
        });
      }
    });

    setArObjects(enhancedObjects);

    // Speed up animations for engaged users
    Animated.timing(rotationAnim, {
      toValue: 2,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const highlightImportantElements = () => {
    // Pulse important elements to regain attention
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Provide attention-grabbing haptic pattern
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 400);
  };

  const introduceAdvancedConcepts = () => {
    // Add advanced content for highly engaged learners
    const advancedObjects = arObjects.map(obj => {
      if (obj.type === 'interactive' && obj.content.hasAdvanced) {
        return {
          ...obj,
          content: {
            ...obj.content,
            showAdvanced: true,
            additionalLayers: true
          },
          cognitiveLoad: obj.cognitiveLoad + 0.2
        };
      }
      return obj;
    });

    setArObjects(advancedObjects);
  };

  const updateGazeFocus = () => {
    if (!faceData?.faces || faceData.faces.length === 0) return;

    const face = faceData.faces[0];
    
    // Calculate gaze direction based on face landmarks
    const gazeX = face.bounds.origin.x + face.bounds.size.width / 2;
    const gazeY = face.bounds.origin.y + face.bounds.size.height / 2;

    // Find which AR object the user is looking at
    const focusedObject = findObjectAtGaze(gazeX, gazeY);
    
    if (focusedObject && focusedObject.id !== currentFocus) {
      setCurrentFocus(focusedObject.id);
      handleObjectFocus(focusedObject);
    }
  };

  const findObjectAtGaze = (gazeX: number, gazeY: number): ARObject | null => {
    // Simple proximity-based focus detection
    // In a real implementation, this would use more sophisticated 3D projection
    const threshold = 100;
    
    return arObjects.find(obj => {
      const screenX = width / 2 + obj.position.x * 100;
      const screenY = height / 2 + obj.position.y * 100;
      
      const distance = Math.sqrt(
        Math.pow(gazeX - screenX, 2) + Math.pow(gazeY - screenY, 2)
      );
      
      return distance < threshold;
    }) || null;
  };

  const handleObjectFocus = (object: ARObject) => {
    // Provide feedback when user focuses on an object
    Haptics.selectionAsync();
    
    // Animate focused object
    Animated.timing(scaleAnim, {
      toValue: 1.15,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update learning progress
    const newProgress = Math.min(learningProgress + 0.1, 1);
    setLearningProgress(newProgress);
    onProgress(newProgress);

    // Trigger content reveal if appropriate
    if (object.type === 'interactive') {
      revealInteractiveContent(object);
    }
  };

  const revealInteractiveContent = (object: ARObject) => {
    if (object.content.triggerType === 'gaze' && focusLevel > 0.6) {
      // Show additional content based on user's focus level
      Alert.alert(
        object.content.title || 'Interactive Content',
        object.content.description || 'Content revealed through gaze interaction',
        [
          {
            text: 'Continue Learning',
            onPress: () => {
              updateProgress(0.2);
            }
          }
        ]
      );
    }
  };

  const handleGestureInteraction = (evt: any, gestureState: any) => {
    // Handle touch and gesture interactions with AR objects
    const touchX = evt.nativeEvent.pageX;
    const touchY = evt.nativeEvent.pageY;

    const touchedObject = findObjectAtTouch(touchX, touchY);
    if (touchedObject) {
      handleObjectInteraction(touchedObject, gestureState);
    }
  };

  const findObjectAtTouch = (touchX: number, touchY: number): ARObject | null => {
    const threshold = 80;
    
    return arObjects.find(obj => {
      const screenX = width / 2 + obj.position.x * 100;
      const screenY = height / 2 + obj.position.y * 100;
      
      const distance = Math.sqrt(
        Math.pow(touchX - screenX, 2) + Math.pow(touchY - screenY, 2)
      );
      
      return distance < threshold;
    }) || null;
  };

  const handleObjectInteraction = (object: ARObject, gestureState: any) => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Rotate object based on gesture
    const rotation = gestureState.dx * 0.01;
    updateObjectRotation(object.id, rotation);

    // Update progress
    updateProgress(0.05);
  };

  const updateObjectRotation = (objectId: string, deltaRotation: number) => {
    setArObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === objectId
          ? {
              ...obj,
              rotation: {
                ...obj.rotation,
                y: obj.rotation.y + deltaRotation
              }
            }
          : obj
      )
    );
  };

  const handleGestureEnd = () => {
    // Reset scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const updateProgress = (increment: number) => {
    const newProgress = Math.min(learningProgress + increment, 1);
    setLearningProgress(newProgress);
    onProgress(newProgress);

    if (newProgress >= 1) {
      completeARSession();
    }
  };

  const completeARSession = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsARActive(false);
      onComplete();
    });

    // Completion haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleFacesDetected = ({ faces }: { faces: any[] }) => {
    setFaceData({ faces });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={[styles.permissionText, { color: theme.colors.text }]}>
          Requesting camera permission...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={[styles.permissionText, { color: theme.colors.text }]}>
          Camera permission denied. Enable camera access to use AR learning.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* AR Camera View */}
      <Camera
        style={styles.camera}
        type={CameraType.back}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
        }}
      >
        {/* AR Overlay */}
        <Animated.View
          style={[
            styles.arOverlay,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                {
                  rotate: rotationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {/* 3D AR Objects Placeholder */}
          <View style={styles.canvas}>
            {/* AR objects would be rendered here in a real implementation */}
            {/* For this demo, we'll show placeholder representations */}
          </View>

          {/* 2D AR Elements Overlay */}
          {arObjects.map((object, index) => (
            <ARObjectRenderer
              key={object.id}
              object={object}
              isFocused={currentFocus === object.id}
              theme={theme}
            />
          ))}
        </Animated.View>

        {/* UI Controls */}
        <View style={styles.controls}>
          {/* Progress Indicator */}
          <View style={[styles.progressContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: `${learningProgress * 100}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              {Math.round(learningProgress * 100)}%
            </Text>
          </View>

          {/* Cognitive State Indicator */}
          <View style={[styles.cognitiveIndicator, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Ionicons
              name="analytics"
              size={16}
              color={cognitiveLoad > 0.7 ? '#ff6b6b' : '#4ecdc4'}
            />
            <Text style={[styles.cognitiveText, { color: theme.colors.text }]}>
              {focusLevel > 0.7 ? 'Focused' : focusLevel > 0.4 ? 'Moderate' : 'Distracted'}
            </Text>
          </View>

          {/* Exit Button */}
          <TouchableOpacity
            style={[styles.exitButton, { backgroundColor: theme.colors.backgroundSecondary }]}
            onPress={() => setIsARActive(false)}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

// Component for rendering individual AR objects
function ARObjectRenderer({
  object,
  isFocused,
  theme,
}: {
  object: ARObject;
  isFocused: boolean;
  theme: any;
}) {
  const screenX = width / 2 + object.position.x * 100;
  const screenY = height / 2 + object.position.y * 100;

  return (
    <Animated.View
      style={[
        styles.arObject,
        {
          left: screenX - 25,
          top: screenY - 25,
          backgroundColor: isFocused ? theme.colors.primary : theme.colors.backgroundSecondary,
          transform: [
            { scale: object.scale * (isFocused ? 1.2 : 1) },
            { rotateY: `${object.rotation.y}rad` },
          ],
        },
      ]}
    >
      {object.type === 'text' ? (
        <Text style={[styles.arText, { color: theme.colors.text }]}>
          {object.content.text}
        </Text>
      ) : (
        <Ionicons
          name={object.type === 'interactive' ? 'cube' : 'shapes'}
          size={24}
          color={theme.colors.text}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  arOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  arObject: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  arText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressContainer: {
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cognitiveIndicator: {
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  cognitiveText: {
    fontSize: 12,
    marginLeft: 4,
  },
  exitButton: {
    padding: 8,
    borderRadius: 8,
    elevation: 3,
  },
});
