import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PinchGestureHandler,
    PinchGestureHandlerGestureEvent,
    State,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Stop,
    Text as SvgText,
} from 'react-native-svg';

interface SkillNode {
  id: string;
  name: string;
  level: number; // 0-100
  x: number;
  y: number;
  category: string;
  prerequisites: string[];
  connections: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  estimatedHours: number;
}

interface NeuralSkillMapProps {
  skills: SkillNode[];
  onSkillPress?: (skill: SkillNode) => void;
  onPathHighlight?: (path: string[]) => void;
  currentSkill?: string;
  showConnections?: boolean;
  animated?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function NeuralSkillMap({
  skills,
  onSkillPress,
  onPathHighlight,
  currentSkill,
  showConnections = true,
  animated = true,
}: NeuralSkillMapProps) {
  const { theme } = useTheme();
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  
  const panRef = useRef<PanGestureHandler>(null);
  const pinchRef = useRef<PinchGestureHandler>(null);
  const animatedValues = useRef(new Map<string, Animated.Value>()).current;

  useEffect(() => {
    // Initialize animated values for each skill
    skills.forEach(skill => {
      if (!animatedValues.has(skill.id)) {
        animatedValues.set(skill.id, new Animated.Value(0));
      }
    });

    if (animated) {
      // Animate skill nodes appearance
      skills.forEach((skill, index) => {
        const animValue = animatedValues.get(skill.id);
        if (animValue) {
          Animated.timing(animValue, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
          }).start();
        }
      });
    }
  }, [skills, animated]);

  const handlePanGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: 0, translationY: 0 } }],
    { useNativeDriver: false }
  );

  const handlePanStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      setTranslateX(prev => prev + event.nativeEvent.translationX);
      setTranslateY(prev => prev + event.nativeEvent.translationY);
    }
  };

  const handlePinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: 1 } }],
    { useNativeDriver: false }
  );

  const handlePinchStateChange = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const newScale = Math.max(0.5, Math.min(3, scale * event.nativeEvent.scale));
      setScale(newScale);
    }
  };

  const getSkillColor = (skill: SkillNode) => {
    if (skill.id === currentSkill) return theme.colors.accent;
    if (skill.isCompleted) return theme.colors.success;
    if (skill.isUnlocked) return theme.colors.primary;
    return theme.colors.textTertiary;
  };

  const getSkillOpacity = (skill: SkillNode) => {
    if (highlightedSkill && selectedPath.length > 0) {
      return selectedPath.includes(skill.id) ? 1 : 0.3;
    }
    return skill.isUnlocked ? 1 : 0.5;
  };

  const handleSkillPress = (skill: SkillNode) => {
    setHighlightedSkill(skill.id);
    
    // Find learning path
    const path = findLearningPath(skill.id);
    setSelectedPath(path);
    onPathHighlight?.(path);
    onSkillPress?.(skill);
  };

  const findLearningPath = (skillId: string): string[] => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return [];

    const path: string[] = [];
    const visited = new Set<string>();

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      
      const node = skills.find(s => s.id === nodeId);
      if (!node) return;

      // Add prerequisites first
      node.prerequisites.forEach(prereqId => {
        dfs(prereqId);
      });

      path.push(nodeId);
    };

    dfs(skillId);
    return path;
  };

  const resetView = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setSelectedPath([]);
    setHighlightedSkill(null);
  };

  const renderConnections = () => {
    if (!showConnections) return null;

    return skills.map(skill => 
      skill.connections.map(connectionId => {
        const connectedSkill = skills.find(s => s.id === connectionId);
        if (!connectedSkill) return null;

        const isHighlighted = selectedPath.includes(skill.id) && selectedPath.includes(connectionId);
        const strokeColor = isHighlighted ? theme.colors.accent : theme.colors.border;
        const strokeWidth = isHighlighted ? 3 : 1;
        const opacity = highlightedSkill && !isHighlighted ? 0.3 : 1;

        return (
          <Line
            key={`${skill.id}-${connectionId}`}
            x1={skill.x}
            y1={skill.y}
            x2={connectedSkill.x}
            y2={connectedSkill.y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeDasharray={skill.isUnlocked && connectedSkill.isUnlocked ? "0" : "5,5"}
          />
        );
      })
    ).flat();
  };

  const renderSkillNodes = () => {
    return skills.map(skill => {
      const animValue = animatedValues.get(skill.id);
      const color = getSkillColor(skill);
      const opacity = getSkillOpacity(skill);
      const radius = skill.id === currentSkill ? 35 : 25;
      const isLarge = skill.level > 70;

      return (
        <G key={skill.id}>
          {/* Skill circle */}
          <Circle
            cx={skill.x}
            cy={skill.y}
            r={radius}
            fill={color}
            opacity={opacity}
            stroke={theme.colors.background}
            strokeWidth={3}
            onPress={() => handleSkillPress(skill)}
          />
          
          {/* Progress ring */}
          <Circle
            cx={skill.x}
            cy={skill.y}
            r={radius + 5}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray={`${(skill.level / 100) * 2 * Math.PI * (radius + 5)} ${2 * Math.PI * (radius + 5)}`}
            opacity={opacity * 0.7}
          />
          
          {/* Skill name */}
          <SvgText
            x={skill.x}
            y={skill.y + radius + 15}
            textAnchor="middle"
            fontSize={12}
            fill={theme.colors.text}
            opacity={opacity}
            fontWeight={skill.id === currentSkill ? 'bold' : 'normal'}
          >
            {skill.name}
          </SvgText>
          
          {/* Level indicator */}
          <SvgText
            x={skill.x}
            y={skill.y + 4}
            textAnchor="middle"
            fontSize={10}
            fill={theme.colors.background}
            fontWeight="bold"
          >
            {Math.round(skill.level)}%
          </SvgText>
          
          {/* Completion indicator */}
          {skill.isCompleted && (
            <SvgText
              x={skill.x + radius - 8}
              y={skill.y - radius + 12}
              textAnchor="middle"
              fontSize={16}
              fill={theme.colors.success}
            >
              ✓
            </SvgText>
          )}
          
          {/* Current skill indicator */}
          {skill.id === currentSkill && (
            <Circle
              cx={skill.x}
              cy={skill.y}
              r={radius + 10}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={3}
              strokeDasharray="5,5"
              opacity={0.8}
            />
          )}
        </G>
      );
    });
  };

  const renderLearningPath = () => {
    if (selectedPath.length <= 1) return null;

    const pathData = selectedPath.map((skillId, index) => {
      const skill = skills.find(s => s.id === skillId);
      if (!skill) return '';
      
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${skill.x} ${skill.y}`;
    }).join(' ');

    return (
      <Path
        d={pathData}
        fill="none"
        stroke={theme.colors.accent}
        strokeWidth={4}
        strokeDasharray="10,5"
        opacity={0.8}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={handlePinchGestureEvent}
        onHandlerStateChange={handlePinchStateChange}
        simultaneousHandlers={[panRef]}
      >
        <Animated.View style={styles.gestureContainer}>
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={handlePanGestureEvent}
            onHandlerStateChange={handlePanStateChange}
            simultaneousHandlers={[pinchRef]}
          >
            <Animated.View style={styles.svgContainer}>
              <Svg
                width={screenWidth * 2}
                height={screenHeight * 2}
                style={{
                  transform: [
                    { scale },
                    { translateX },
                    { translateY },
                  ],
                }}
              >
                <Defs>
                  <LinearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="1" />
                    <Stop offset="100%" stopColor={theme.colors.secondary} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                
                {renderConnections()}
                {renderLearningPath()}
                {renderSkillNodes()}
              </Svg>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
          onPress={resetView}
        >
          <Text style={styles.controlButtonText}>Reset View</Text>
        </TouchableOpacity>
        
        <View style={styles.info}>
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Pinch to zoom • Drag to pan • Tap skills to see paths
          </Text>
          {selectedPath.length > 0 && (
            <Text style={[styles.pathInfo, { color: theme.colors.accent }]}>
              Learning Path: {selectedPath.length} skills
            </Text>
          )}
        </View>
      </View>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.textTertiary }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Locked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.accent }]} />
          <Text style={[styles.legendText, { color: theme.colors.text }]}>Current</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  svgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  info: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  pathInfo: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
  legend: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});
