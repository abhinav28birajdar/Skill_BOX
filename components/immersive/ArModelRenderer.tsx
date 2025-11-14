import { useTheme } from '@/context/ThemeContext';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
} from 'react-native-gesture-handler';

interface ArModelRendererProps {
  modelUrl?: string;
  onModelLoad?: () => void;
  onModelError?: (error: string) => void;
  enableGestures?: boolean;
  autoRotate?: boolean;
  initialScale?: number;
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ArModelRenderer: React.FC<ArModelRendererProps> = ({
  modelUrl = 'default_model',
  onModelLoad,
  onModelError,
  enableGestures = true,
  autoRotate = false,
  initialScale = 1,
  style,
}) => {
  const { theme } = useTheme();
  
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;
  const positionAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  React.useEffect(() => {
    // Simulate model loading
    const loadTimer = setTimeout(() => {
      setModelLoaded(true);
      setLoading(false);
      onModelLoad?.();
    }, 2000);

    if (autoRotate) {
      startAutoRotation();
    }

    return () => clearTimeout(loadTimer);
  }, [autoRotate]);

  const startAutoRotation = () => {
    Animated.loop(
      Animated.timing(rotationAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handlePanGesture = (event: any) => {
    positionAnim.setValue({
      x: event.nativeEvent.translationX,
      y: event.nativeEvent.translationY,
    });
  };

  const handlePinchGesture = (event: any) => {
    scaleAnim.setValue(event.nativeEvent.scale);
  };

  const onPinchEnd = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const newScale = Math.max(0.5, Math.min(3, scale * event.nativeEvent.scale));
      setScale(newScale);
    }
  };

  const onPanEnd = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      setPosition({
        x: position.x + event.nativeEvent.translationX,
        y: position.y + event.nativeEvent.translationY,
      });
    }
  };

  const resetModel = () => {
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
    setRotation({ x: 0, y: 0, z: 0 });
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: initialScale,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(positionAnim, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const takeSnapshot = () => {
    // Simulate snapshot functionality
    console.log('AR Model snapshot taken');
  };

  const render3DPlaceholder = () => {
    const rotationValue = rotationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          styles.modelPlaceholder,
          {
            backgroundColor: theme.colors.primary,
            transform: [
              { scale: scaleAnim },
              { translateX: positionAnim.x },
              { translateY: positionAnim.y },
              { rotateY: rotationValue },
            ],
          },
        ]}
      >
        <Text style={[styles.placeholderText, { color: theme.colors.background }]}>
          3D Model
        </Text>
        <Text style={[styles.placeholderSubtext, { color: theme.colors.background }]}>
          {modelUrl}
        </Text>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, style, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading AR Model...
          </Text>
          <View style={[styles.loadingBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.loadingProgress,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          </View>
        </View>
      </View>
    );
  }

  const content = (
    <View style={[styles.container, style, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.arViewport}>
        {render3DPlaceholder()}
      </View>
      
      <View style={[styles.controls, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
          onPress={resetModel}
        >
          <Text style={styles.controlButtonText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.secondary }]}
          onPress={takeSnapshot}
        >
          <Text style={styles.controlButtonText}>📷</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.accent }]}
          onPress={() => setRotation(prev => ({ ...prev, y: prev.y + 45 }))}
        >
          <Text style={styles.controlButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.info, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          Scale: {scale.toFixed(2)}x
        </Text>
        <Text style={[styles.infoText, { color: theme.colors.text }]}>
          Position: ({position.x.toFixed(0)}, {position.y.toFixed(0)})
        </Text>
      </View>
    </View>
  );

  if (!enableGestures) {
    return content;
  }

  return (
    <PanGestureHandler onGestureEvent={handlePanGesture} onHandlerStateChange={onPanEnd}>
      <Animated.View style={{ flex: 1 }}>
        <PinchGestureHandler onGestureEvent={handlePinchGesture} onHandlerStateChange={onPinchEnd}>
          <Animated.View style={{ flex: 1 }}>
            {content}
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  loadingBar: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    width: '100%',
  },
  arViewport: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 12,
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 2,
  },
});
