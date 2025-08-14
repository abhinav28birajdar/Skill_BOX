import { useAI } from '@/context/AIModelContext';
import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface VirtualEnvironment {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'museum' | 'space' | 'ocean' | 'forest';
  description: string;
  immersionLevel: number;
  interactiveObjects: InteractiveObject[];
  ambientSound?: string;
  lighting: LightingConfig;
}

interface InteractiveObject {
  id: string;
  name: string;
  type: 'model3d' | 'hologram' | 'portal' | 'tool' | 'document';
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: { x: number; y: number; z: number };
  clickable: boolean;
  metadata?: any;
}

interface LightingConfig {
  ambient: number;
  directional: { x: number; y: number; z: number; intensity: number };
  color: string;
  shadows: boolean;
}

interface VRLearningEnvironmentProps {
  environment: VirtualEnvironment;
  onObjectInteract?: (object: InteractiveObject) => void;
  onEnvironmentChange?: (newEnvironment: VirtualEnvironment) => void;
  enableAIGuidance?: boolean;
  immersiveMode?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const VRLearningEnvironment: React.FC<VRLearningEnvironmentProps> = ({
  environment,
  onObjectInteract,
  onEnvironmentChange,
  enableAIGuidance = true,
  immersiveMode = false,
}) => {
  const { theme } = useTheme();
  const { isAIEnabled, generateContent } = useAI();
  
  const [currentView, setCurrentView] = useState({ x: 0, y: 0, z: 0 });
  const [selectedObject, setSelectedObject] = useState<InteractiveObject | null>(null);
  const [immersionLevel, setImmersionLevel] = useState(0.7);
  const [showControls, setShowControls] = useState(true);
  const [aiGuidanceText, setAiGuidanceText] = useState('');
  const [environmentLoaded, setEnvironmentLoaded] = useState(false);
  
  const viewAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const objectAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const immersionAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeEnvironment();
    if (enableAIGuidance && isAIEnabled) {
      generateAIGuidance();
    }
  }, [environment]);

  useEffect(() => {
    // Animate immersion level changes
    Animated.timing(immersionAnim, {
      toValue: immersionLevel,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [immersionLevel]);

  const initializeEnvironment = async () => {
    setEnvironmentLoaded(false);
    
    // Initialize object animations
    environment.interactiveObjects.forEach(obj => {
      if (!objectAnimations.has(obj.id)) {
        objectAnimations.set(obj.id, new Animated.Value(0));
      }
    });

    // Simulate environment loading
    setTimeout(() => {
      setEnvironmentLoaded(true);
      
      // Animate objects into view
      const animations = Array.from(objectAnimations.values()).map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        })
      );
      
      Animated.stagger(200, animations).start();
    }, 1500);
  };

  const generateAIGuidance = async () => {
    if (!isAIEnabled) return;
    
    try {
      const guidancePrompt = `Generate immersive learning guidance for a ${environment.type} environment called "${environment.name}". Include interactive suggestions and exploration tips.`;
      const guidance = await generateContent(guidancePrompt, 'educational');
      setAiGuidanceText(guidance);
    } catch (error) {
      console.error('Error generating AI guidance:', error);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Update view based on gesture
      const sensitivity = 0.5;
      const newX = currentView.x + gestureState.dx * sensitivity;
      const newY = currentView.y + gestureState.dy * sensitivity;
      
      setCurrentView(prev => ({
        ...prev,
        x: Math.max(-180, Math.min(180, newX)),
        y: Math.max(-90, Math.min(90, newY)),
      }));
      
      viewAnim.setValue({ x: newX, y: newY });
    },
    onPanResponderRelease: () => {
      // Smooth return to center if needed
      Animated.spring(viewAnim, {
        toValue: { x: currentView.x, y: currentView.y },
        useNativeDriver: true,
      }).start();
    },
  });

  const handleObjectPress = (object: InteractiveObject) => {
    setSelectedObject(object);
    
    // Animate object selection
    const objectAnim = objectAnimations.get(object.id);
    if (objectAnim) {
      Animated.sequence([
        Animated.timing(objectAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(objectAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onObjectInteract?.(object);
  };

  const renderInteractiveObject = (object: InteractiveObject, index: number) => {
    const objectAnim = objectAnimations.get(object.id) || new Animated.Value(0);
    
    const transform3D = {
      transform: [
        { perspective: 1000 },
        { rotateX: `${object.rotation.x + currentView.y * 0.1}deg` },
        { rotateY: `${object.rotation.y + currentView.x * 0.1}deg` },
        { scale: objectAnim },
        {
          translateX: object.position.x + Math.sin(currentView.x * Math.PI / 180) * 20,
        },
        {
          translateY: object.position.y + Math.sin(currentView.y * Math.PI / 180) * 10,
        },
      ],
    };

    return (
      <Animated.View
        key={object.id}
        style={[
          styles.interactiveObject,
          transform3D,
          {
            left: object.position.x + screenWidth / 2,
            top: object.position.y + screenHeight / 2,
            opacity: objectAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.objectButton,
            {
              backgroundColor: getObjectColor(object.type),
              borderColor: selectedObject?.id === object.id ? theme.colors.primary : 'transparent',
            },
          ]}
          onPress={() => handleObjectPress(object)}
        >
          <Text style={styles.objectIcon}>{getObjectIcon(object.type)}</Text>
          <Text style={[styles.objectName, { color: theme.colors.text }]}>
            {object.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const getObjectColor = (type: InteractiveObject['type']) => {
    const colors = {
      model3d: '#FF6B6B',
      hologram: '#4ECDC4',
      portal: '#45B7D1',
      tool: '#96CEB4',
      document: '#FFEAA7',
    };
    return colors[type] || '#DDA0DD';
  };

  const getObjectIcon = (type: InteractiveObject['type']) => {
    const icons = {
      model3d: '🎲',
      hologram: '✨',
      portal: '🌀',
      tool: '🔧',
      document: '📄',
    };
    return icons[type] || '❓';
  };

  const renderEnvironmentBackground = () => {
    const backgroundGradient = getEnvironmentGradient(environment.type);
    
    return (
      <Animated.View
        style={[
          styles.environmentBackground,
          {
            opacity: immersionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1],
            }),
          },
        ]}
      >
        <View style={[styles.gradient, { backgroundColor: backgroundGradient.primary }]}>
          <View style={[styles.gradientOverlay, { backgroundColor: backgroundGradient.secondary }]} />
        </View>
        {renderEnvironmentEffects()}
      </Animated.View>
    );
  };

  const getEnvironmentGradient = (type: VirtualEnvironment['type']) => {
    const gradients = {
      classroom: { primary: '#F0F8FF', secondary: '#E6F3FF' },
      laboratory: { primary: '#F5F5F5', secondary: '#E8E8E8' },
      museum: { primary: '#FFF8DC', secondary: '#F5F5DC' },
      space: { primary: '#000428', secondary: '#004e92' },
      ocean: { primary: '#006994', secondary: '#13547a' },
      forest: { primary: '#134E5E', secondary: '#71B280' },
    };
    return gradients[type] || gradients.classroom;
  };

  const renderEnvironmentEffects = () => {
    return (
      <View style={styles.effectsContainer}>
        {environment.type === 'space' && renderStarField()}
        {environment.type === 'ocean' && renderBubbles()}
        {environment.type === 'forest' && renderParticles()}
      </View>
    );
  };

  const renderStarField = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.star,
          {
            left: Math.random() * screenWidth,
            top: Math.random() * screenHeight,
            opacity: Math.random(),
          },
        ]}
      />
    ));
  };

  const renderBubbles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <Animated.View
        key={i}
        style={[
          styles.bubble,
          {
            left: Math.random() * screenWidth,
            top: screenHeight + Math.random() * 100,
          },
        ]}
      />
    ));
  };

  const renderParticles = () => {
    return Array.from({ length: 30 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.particle,
          {
            left: Math.random() * screenWidth,
            top: Math.random() * screenHeight,
          },
        ]}
      />
    ));
  };

  const renderControls = () => {
    if (!showControls || immersiveMode) return null;

    return (
      <View style={[styles.controls, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setImmersionLevel(prev => Math.min(1, prev + 0.1))}
        >
          <Text style={styles.controlIcon}>🔍</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => setImmersionLevel(prev => Math.max(0, prev - 0.1))}
        >
          <Text style={styles.controlIcon}>🔍</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => setShowControls(false)}
        >
          <Text style={styles.controlIcon}>👁️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAIGuidance = () => {
    if (!enableAIGuidance || !aiGuidanceText) return null;

    return (
      <Animated.View
        style={[
          styles.aiGuidance,
          {
            backgroundColor: theme.colors.surface,
            opacity: immersionAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [1, 0.7, 0.3],
            }),
          },
        ]}
      >
        <Text style={[styles.aiGuidanceIcon, { color: theme.colors.primary }]}>
          🤖
        </Text>
        <Text style={[styles.aiGuidanceText, { color: theme.colors.text }]}>
          {aiGuidanceText}
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderEnvironmentBackground()}
      
      <View style={styles.vrViewport} {...panResponder.panHandlers}>
        {!environmentLoaded ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading {environment.name}...
            </Text>
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            </View>
          </View>
        ) : (
          environment.interactiveObjects.map(renderInteractiveObject)
        )}
      </View>

      {renderControls()}
      {renderAIGuidance()}

      {selectedObject && (
        <View style={[styles.objectInfo, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.objectInfoTitle, { color: theme.colors.text }]}>
            {selectedObject.name}
          </Text>
          <Text style={[styles.objectInfoDescription, { color: theme.colors.textSecondary }]}>
            Type: {selectedObject.type}
          </Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setSelectedObject(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  environmentBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  effectsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  bubble: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
  },
  particle: {
    position: 'absolute',
    width: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  vrViewport: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
  },
  interactiveObject: {
    position: 'absolute',
  },
  objectButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  objectIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  objectName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    flexDirection: 'row',
    borderRadius: 25,
    padding: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  controlIcon: {
    fontSize: 20,
  },
  aiGuidance: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiGuidanceIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  aiGuidanceText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  objectInfo: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  objectInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  objectInfoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
