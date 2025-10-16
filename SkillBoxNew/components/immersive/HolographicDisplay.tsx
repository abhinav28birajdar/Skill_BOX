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
import Svg, {
    Circle,
    Defs,
    G,
    LinearGradient,
    Path,
    Polygon,
    Stop
} from 'react-native-svg';

interface HologramContent {
  id: string;
  type: 'text' | 'model' | 'chart' | 'formula' | 'animation';
  title: string;
  content: any;
  position: { x: number; y: number; z: number };
  scale: number;
  rotation: { x: number; y: number; z: number };
  opacity: number;
  interactive: boolean;
  metadata?: {
    complexity?: number;
    difficulty?: string;
    tags?: string[];
    duration?: number;
  };
}

interface HolographicDisplayProps {
  contents: HologramContent[];
  onContentInteract?: (content: HologramContent) => void;
  onContentUpdate?: (content: HologramContent) => void;
  enableGestures?: boolean;
  enableAI?: boolean;
  theme?: 'matrix' | 'neon' | 'plasma' | 'crystalline';
  autoRotate?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const HolographicDisplay: React.FC<HolographicDisplayProps> = ({
  contents,
  onContentInteract,
  onContentUpdate,
  enableGestures = true,
  enableAI = true,
  theme: displayTheme = 'matrix',
  autoRotate = true,
}) => {
  const { theme } = useTheme();
  const { isAIEnabled, generateContent } = useAI();
  
  const [selectedContent, setSelectedContent] = useState<HologramContent | null>(null);
  const [hologramPower, setHologramPower] = useState(0.8);
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [particleSystem, setParticleSystem] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
  }>>([]);
  
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const powerAnim = useRef(new Animated.Value(0)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const contentAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initializeHologram();
    startHologramEffects();
    if (autoRotate) {
      startAutoRotation();
    }
  }, []);

  useEffect(() => {
    contents.forEach(content => {
      if (!contentAnimations.has(content.id)) {
        contentAnimations.set(content.id, new Animated.Value(0));
      }
    });
    
    animateContentsIn();
  }, [contents]);

  const initializeHologram = () => {
    // Initialize particles
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: Math.random(),
    }));
    setParticleSystem(particles);

    // Power up animation
    Animated.timing(powerAnim, {
      toValue: hologramPower,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  };

  const startHologramEffects = () => {
    // Scanline animation
    Animated.loop(
      Animated.timing(scanlineAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();

    // Particle animation
    Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      })
    ).start();

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  };

  const startAutoRotation = () => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

  const animateContentsIn = () => {
    const animations = Array.from(contentAnimations.values()).map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    
    Animated.stagger(300, animations).start();
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => enableGestures,
    onPanResponderMove: (_, gestureState) => {
      // Handle 3D rotation gestures
      const rotationY = gestureState.dx / screenWidth * 360;
      const rotationX = gestureState.dy / screenHeight * 180;
      
      // Apply rotation to hologram
      rotationAnim.setValue(rotationY / 360);
    },
  });

  const getThemeColors = () => {
    const themes = {
      matrix: {
        primary: '#00FF41',
        secondary: '#008F11',
        background: 'rgba(0, 0, 0, 0.9)',
        glow: '#00FF41',
      },
      neon: {
        primary: '#FF006E',
        secondary: '#FB5607',
        background: 'rgba(8, 13, 37, 0.9)',
        glow: '#FF006E',
      },
      plasma: {
        primary: '#7209B7',
        secondary: '#F72585',
        background: 'rgba(13, 0, 25, 0.9)',
        glow: '#7209B7',
      },
      crystalline: {
        primary: '#4CC9F0',
        secondary: '#7209B7',
        background: 'rgba(0, 15, 25, 0.9)',
        glow: '#4CC9F0',
      },
    };
    return themes[displayTheme];
  };

  const renderHologramContent = (content: HologramContent, index: number) => {
    const themeColors = getThemeColors();
    const contentAnim = contentAnimations.get(content.id) || new Animated.Value(0);
    
    const rotationY = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const transform3D = {
      transform: [
        { perspective: 1000 },
        { rotateY: rotationY },
        { rotateX: `${content.rotation.x}deg` },
        { rotateZ: `${content.rotation.z}deg` },
        { scale: contentAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, content.scale],
        })},
        { translateX: content.position.x },
        { translateY: content.position.y },
      ],
    };

    return (
      <Animated.View
        key={content.id}
        style={[
          styles.hologramContent,
          transform3D,
          {
            opacity: contentAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, content.opacity * hologramPower],
            }),
            left: screenWidth / 2 + content.position.x,
            top: screenHeight / 2 + content.position.y,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.contentContainer,
            {
              borderColor: themeColors.primary,
              backgroundColor: `${themeColors.background}80`,
              shadowColor: themeColors.glow,
            },
          ]}
          onPress={() => handleContentPress(content)}
        >
          {renderContentByType(content, themeColors)}
          
          {/* Hologram grid overlay */}
          <View style={[styles.gridOverlay, { borderColor: themeColors.secondary }]} />
          
          {/* Glitch effect */}
          {glitchEffect && (
            <View style={[styles.glitchOverlay, { backgroundColor: themeColors.primary }]} />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderContentByType = (content: HologramContent, themeColors: any) => {
    switch (content.type) {
      case 'text':
        return renderTextContent(content, themeColors);
      case 'model':
        return renderModelContent(content, themeColors);
      case 'chart':
        return renderChartContent(content, themeColors);
      case 'formula':
        return renderFormulaContent(content, themeColors);
      case 'animation':
        return renderAnimationContent(content, themeColors);
      default:
        return renderDefaultContent(content, themeColors);
    }
  };

  const renderTextContent = (content: HologramContent, themeColors: any) => (
    <View style={styles.textContent}>
      <Text style={[styles.contentTitle, { color: themeColors.primary }]}>
        {content.title}
      </Text>
      <Text style={[styles.contentText, { color: themeColors.secondary }]}>
        {content.content}
      </Text>
    </View>
  );

  const renderModelContent = (content: HologramContent, themeColors: any) => (
    <View style={styles.modelContent}>
      <Svg width={120} height={120} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id="modelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={themeColors.secondary} stopOpacity="0.4" />
          </LinearGradient>
        </Defs>
        
        {/* 3D Wireframe representation */}
        <G>
          <Polygon
            points="20,20 100,20 110,40 30,40"
            fill="url(#modelGradient)"
            stroke={themeColors.primary}
            strokeWidth="1"
          />
          <Polygon
            points="20,20 30,40 30,100 20,80"
            fill="url(#modelGradient)"
            stroke={themeColors.primary}
            strokeWidth="1"
          />
          <Polygon
            points="100,20 110,40 110,100 100,80"
            fill="url(#modelGradient)"
            stroke={themeColors.primary}
            strokeWidth="1"
          />
        </G>
      </Svg>
      <Text style={[styles.modelLabel, { color: themeColors.primary }]}>
        {content.title}
      </Text>
    </View>
  );

  const renderChartContent = (content: HologramContent, themeColors: any) => (
    <View style={styles.chartContent}>
      <Svg width={140} height={100} viewBox="0 0 140 100">
        <Defs>
          <LinearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={themeColors.secondary} stopOpacity="0.2" />
          </LinearGradient>
        </Defs>
        
        {/* Animated chart bars */}
        {[30, 60, 45, 80, 35].map((height, i) => (
          <Animated.View key={i}>
            <Path
              d={`M${20 + i * 20},${100 - height} L${35 + i * 20},${100 - height} L${35 + i * 20},95 L${20 + i * 20},95 Z`}
              fill="url(#chartGradient)"
              stroke={themeColors.primary}
              strokeWidth="1"
            />
          </Animated.View>
        ))}
      </Svg>
      <Text style={[styles.chartLabel, { color: themeColors.primary }]}>
        {content.title}
      </Text>
    </View>
  );

  const renderFormulaContent = (content: HologramContent, themeColors: any) => (
    <View style={styles.formulaContent}>
      <Text style={[styles.formulaText, { color: themeColors.primary }]}>
        {content.content.formula || 'E = mc²'}
      </Text>
      <Text style={[styles.formulaDescription, { color: themeColors.secondary }]}>
        {content.title}
      </Text>
    </View>
  );

  const renderAnimationContent = (content: HologramContent, themeColors: any) => {
    const animValue = particleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 360],
    });

    return (
      <View style={styles.animationContent}>
        <Animated.View
          style={{
            transform: [{ rotate: `${animValue}deg` }],
          }}
        >
          <Svg width={80} height={80} viewBox="0 0 80 80">
            <Circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke={themeColors.primary}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <Circle
              cx="40"
              cy="40"
              r="20"
              fill={themeColors.secondary}
              opacity="0.3"
            />
          </Svg>
        </Animated.View>
        <Text style={[styles.animationLabel, { color: themeColors.primary }]}>
          {content.title}
        </Text>
      </View>
    );
  };

  const renderDefaultContent = (content: HologramContent, themeColors: any) => (
    <View style={styles.defaultContent}>
      <Text style={[styles.defaultIcon, { color: themeColors.primary }]}>
        🔮
      </Text>
      <Text style={[styles.defaultTitle, { color: themeColors.secondary }]}>
        {content.title}
      </Text>
    </View>
  );

  const renderScanlines = () => {
    const themeColors = getThemeColors();
    const scanlineY = scanlineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screenHeight],
    });

    return (
      <Animated.View
        style={[
          styles.scanline,
          {
            top: scanlineY,
            backgroundColor: themeColors.primary,
            opacity: powerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />
    );
  };

  const renderParticles = () => {
    const themeColors = getThemeColors();
    
    return particleSystem.map(particle => (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            left: particle.x,
            top: particle.y,
            backgroundColor: themeColors.primary,
            opacity: particle.life * hologramPower,
          },
        ]}
      />
    ));
  };

  const handleContentPress = (content: HologramContent) => {
    setSelectedContent(content);
    
    // Haptic feedback simulation
    const contentAnim = contentAnimations.get(content.id);
    if (contentAnim) {
      Animated.sequence([
        Animated.timing(contentAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    onContentInteract?.(content);
  };

  const renderPowerControls = () => {
    const themeColors = getThemeColors();
    
    return (
      <View style={[styles.powerControls, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.powerLabel, { color: themeColors.primary }]}>
          Hologram Power
        </Text>
        <View style={styles.powerSlider}>
          <TouchableOpacity
            style={[styles.powerButton, { backgroundColor: themeColors.secondary }]}
            onPress={() => setHologramPower(Math.max(0, hologramPower - 0.1))}
          >
            <Text style={styles.powerButtonText}>-</Text>
          </TouchableOpacity>
          
          <View style={styles.powerIndicator}>
            <Animated.View
              style={[
                styles.powerBar,
                {
                  width: `${hologramPower * 100}%`,
                  backgroundColor: themeColors.primary,
                },
              ]}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.powerButton, { backgroundColor: themeColors.secondary }]}
            onPress={() => setHologramPower(Math.min(1, hologramPower + 0.1))}
          >
            <Text style={styles.powerButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: getThemeColors().background }]}>
      {/* Hologram base projection */}
      <View style={styles.hologramBase} {...panResponder.panHandlers}>
        {contents.map(renderHologramContent)}
        {renderParticles()}
        {renderScanlines()}
      </View>

      {/* Power controls */}
      {renderPowerControls()}

      {/* Content details panel */}
      {selectedContent && (
        <View style={[styles.detailsPanel, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.detailsTitle, { color: theme.colors.text }]}>
            {selectedContent.title}
          </Text>
          <Text style={[styles.detailsType, { color: theme.colors.textSecondary }]}>
            Type: {selectedContent.type}
          </Text>
          {selectedContent.metadata && (
            <View style={styles.metadata}>
              <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>
                Difficulty: {selectedContent.metadata.difficulty || 'N/A'}
              </Text>
              <Text style={[styles.metadataText, { color: theme.colors.textSecondary }]}>
                Duration: {selectedContent.metadata.duration || 'N/A'} min
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.closeDetailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setSelectedContent(null)}
          >
            <Text style={styles.closeDetailsText}>Close</Text>
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
  hologramBase: {
    flex: 1,
    overflow: 'hidden',
  },
  hologramContent: {
    position: 'absolute',
  },
  contentContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 120,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.3,
  },
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  textContent: {
    alignItems: 'center',
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  contentText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  modelContent: {
    alignItems: 'center',
  },
  modelLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  chartContent: {
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  formulaContent: {
    alignItems: 'center',
  },
  formulaText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  formulaDescription: {
    fontSize: 10,
    textAlign: 'center',
  },
  animationContent: {
    alignItems: 'center',
  },
  animationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  defaultContent: {
    alignItems: 'center',
  },
  defaultIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  defaultTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  scanline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  powerControls: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  powerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  powerSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  powerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  powerIndicator: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  powerBar: {
    height: '100%',
    borderRadius: 4,
  },
  detailsPanel: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailsType: {
    fontSize: 14,
    marginBottom: 16,
  },
  metadata: {
    marginBottom: 16,
  },
  metadataText: {
    fontSize: 12,
    marginBottom: 4,
  },
  closeDetailsButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
