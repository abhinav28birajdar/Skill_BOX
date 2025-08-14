import { useTheme } from '@/context/ThemeContext';
import {
    Canvas,
    useFrame,
    useLoader,
} from '@react-three/fiber/native';
import { useRef, useState } from 'react';
import {
    Animated,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
    State,
    StyleSheet, Text, TouchableOpacity,
    View
} from 'react-native';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ArModelRendererProps {
  modelUrl?: string;
  onInteraction?: (type: string, data: any) => void;
  enablePhysics?: boolean;
  showControls?: boolean;
}

function Model({ url, scale = 1, position = [0, 0, 0] }: { url: string; scale?: number; position?: [number, number, number] }) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef<any>();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      scale={[scale, scale, scale]}
      position={position}
    />
  );
}

export function ArModelRenderer({
  modelUrl = '/assets/3d-models/default-cube.gltf',
  onInteraction,
  enablePhysics = false,
  showControls = true,
}: ArModelRendererProps) {
  const { theme } = useTheme();
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panRef = useRef<PanGestureHandler>(null);
  const pinchRef = useRef<PinchGestureHandler>(null);

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: 0, translationY: 0 } }],
    { useNativeDriver: false }
  );

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: 1 } }],
    { useNativeDriver: false }
  );

  const handlePanStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      setRotation(prev => ({
        x: prev.x + translationY * 0.01,
        y: prev.y + translationX * 0.01,
      }));
      
      onInteraction?.('rotate', { x: translationY * 0.01, y: translationX * 0.01 });
    }
  };

  const handlePinchStateChange = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const newScale = Math.max(0.5, Math.min(3, scale * event.nativeEvent.scale));
      setScale(newScale);
      onInteraction?.('scale', { scale: newScale });
    }
  };

  const resetView = () => {
    setScale(1);
    setRotation({ x: 0, y: 0 });
    onInteraction?.('reset', {});
  };

  const captureSnapshot = () => {
    // Implementation for taking AR snapshot
    onInteraction?.('snapshot', { timestamp: Date.now() });
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Failed to load 3D model: {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setError(null)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={handlePinchStateChange}
        simultaneousHandlers={[panRef]}
      >
        <Animated.View style={styles.gestureContainer}>
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={onPanGestureEvent}
            onHandlerStateChange={handlePanStateChange}
            simultaneousHandlers={[pinchRef]}
          >
            <Animated.View style={styles.canvasContainer}>
              <Canvas style={styles.canvas}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Model 
                  url={modelUrl} 
                  scale={scale}
                  position={[0, 0, 0]}
                />
              </Canvas>
              
              {!modelLoaded && (
                <View style={styles.loadingOverlay}>
                  <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                    Loading 3D Model...
                  </Text>
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {showControls && (
        <View style={[styles.controls, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
            onPress={resetView}
          >
            <Text style={styles.controlButtonText}>Reset View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.secondary }]}
            onPress={captureSnapshot}
          >
            <Text style={styles.controlButtonText}>📸 Capture</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.info, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Pinch to zoom • Drag to rotate
        </Text>
        <Text style={[styles.scaleText, { color: theme.colors.textTertiary }]}>
          Scale: {scale.toFixed(1)}x
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gestureContainer: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  scaleText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
