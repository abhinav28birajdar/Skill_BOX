import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AITutorService } from '../../ai/services/AITutorService';
import { OpenAITutor } from '../../ai/tutors/OpenAITutor';
import { useAuthContext } from '../../context/AuthContext';
import { useAmbientLearningSuggestor } from '../../hooks/useAmbientLearningSuggestor';
import { useBioSensors } from '../../hooks/useBioSensors';
import { useCognitiveLoad } from '../../hooks/useCognitiveLoad';
import { useTheme } from '../../hooks/useTheme';
import { ImmersiveARLearning } from '../immersive/ImmersiveARLearning';
import { AdaptiveLearningInterface } from './AdaptiveLearningInterface';

const { width, height } = Dimensions.get('window');

interface BioCognitiveDashboardProps {
  onStartLearningSession: (sessionType: string) => void;
  onNavigateToContent: (contentId: string) => void;
}

export function BioCognitiveDashboard({
  onStartLearningSession,
  onNavigateToContent
}: BioCognitiveDashboardProps) {
  const { user } = useAuthContext();
  const { theme } = useTheme();
  
  // Bio-cognitive system hooks
  const bioSensors = useBioSensors();
  const cognitiveAnalysis = useCognitiveLoad(bioSensors.getCurrentBiometricData());
  const ambientSuggestor = useAmbientLearningSuggestor(
    user?.id || '',
    cognitiveAnalysis.cognitiveState
  );

  // Dashboard states
  const [activeMode, setActiveMode] = useState<'dashboard' | 'adaptive' | 'ar'>('dashboard');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [aiTutor, setAiTutor] = useState<OpenAITutor | null>(null);

  // Animated values
  const pulseAnimation = new Animated.Value(1);
  const fadeInAnimation = new Animated.Value(0);

  useEffect(() => {
    initializeBioCognitiveSystem();
    startPulseAnimation();
    startFadeInAnimation();
  }, []);

  useEffect(() => {
    if (bioSensors.isInitialized) {
      generateRealTimeRecommendations();
    }
  }, [bioSensors.sensorData, cognitiveAnalysis.cognitiveState]);

  const initializeBioCognitiveSystem = async () => {
    try {
      // Initialize AI tutor
      const tutorService = new AITutorService();
      const tutor = new OpenAITutor();
      await tutor.initialize(user?.id || 'demo');
      setAiTutor(tutor);

      // Start biometric tracking
      await bioSensors.startFaceTracking();
      
    } catch (error) {
      console.error('Error initializing bio-cognitive system:', error);
      Alert.alert('Initialization Error', 'Some features may be limited.');
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startFadeInAnimation = () => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  const generateRealTimeRecommendations = () => {
    const { cognitiveState } = cognitiveAnalysis;
    
    // Auto-adjust interface based on cognitive load
    if (cognitiveState.cognitiveLoad > 0.8) {
      // High cognitive load - suggest break or simplified interface
      setTimeout(() => {
        Alert.alert(
          'High Cognitive Load Detected',
          'Consider taking a break or switching to lighter content.',
          [
            { text: 'Take Break', onPress: () => suggestBreakActivity() },
            { text: 'Simplify Interface', onPress: () => setActiveMode('adaptive') },
            { text: 'Continue', style: 'cancel' }
          ]
        );
      }, 2000);
    } else if (cognitiveState.focusLevel > 0.8 && cognitiveState.learningReadiness > 0.7) {
      // Optimal learning state - suggest challenging content
      // This could trigger automatically or wait for user confirmation
    }
  };

  const suggestBreakActivity = () => {
    // AI-generated break recommendations based on current state
    Alert.alert(
      'Recommended Break Activities',
      '🧘‍♀️ Try 5-minute meditation\n🚶‍♀️ Take a short walk\n💧 Stay hydrated\n👁️ Practice eye exercises',
      [{ text: 'OK' }]
    );
  };

  const renderSystemStatus = () => (
    <View style={[styles.statusCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <View style={styles.statusHeader}>
        <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
          <Ionicons 
            name="pulse" 
            size={24} 
            color={isSystemActive ? theme.colors.success : theme.colors.error} 
          />
        </Animated.View>
        <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
          Bio-Cognitive System
        </Text>
        <TouchableOpacity
          onPress={() => setIsSystemActive(!isSystemActive)}
          style={[styles.toggleButton, { 
            backgroundColor: isSystemActive ? theme.colors.success : theme.colors.error 
          }]}
        >
          <Ionicons 
            name={isSystemActive ? 'play' : 'pause'} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusMetrics}>
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Sensors Active
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {bioSensors.isInitialized ? '✓' : '✗'}
          </Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            AI Tutor
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {aiTutor ? '🤖' : '⏳'}
          </Text>
        </View>
        
        <View style={styles.metricItem}>
          <Text style={[styles.metricLabel, { color: theme.colors.textSecondary }]}>
            Suggestions
          </Text>
          <Text style={[styles.metricValue, { color: theme.colors.text }]}>
            {ambientSuggestor.suggestions.length}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCognitiveStateCard = () => {
    const { cognitiveState } = cognitiveAnalysis;
    
    return (
      <TouchableOpacity
        style={[styles.cognitiveCard, { backgroundColor: theme.colors.backgroundSecondary }]}
        onPress={() => setShowDetailedAnalysis(true)}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="brain" size={24} color={theme.colors.primary} />
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Cognitive State
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
        </View>
        
        <View style={styles.cognitiveMetrics}>
          <View style={styles.cognitiveMetric}>
            <View style={[styles.metricCircle, { 
              backgroundColor: getCognitiveColor(cognitiveState.cognitiveLoad) 
            }]}>
              <Text style={styles.metricPercent}>
                {(cognitiveState.cognitiveLoad * 100).toFixed(0)}%
              </Text>
            </View>
            <Text style={[styles.metricName, { color: theme.colors.textSecondary }]}>
              Cognitive Load
            </Text>
          </View>
          
          <View style={styles.cognitiveMetric}>
            <View style={[styles.metricCircle, { 
              backgroundColor: getCognitiveColor(cognitiveState.focusLevel) 
            }]}>
              <Text style={styles.metricPercent}>
                {(cognitiveState.focusLevel * 100).toFixed(0)}%
              </Text>
            </View>
            <Text style={[styles.metricName, { color: theme.colors.textSecondary }]}>
              Focus Level
            </Text>
          </View>
          
          <View style={styles.cognitiveMetric}>
            <View style={[styles.metricCircle, { 
              backgroundColor: getCognitiveColor(cognitiveState.learningReadiness) 
            }]}>
              <Text style={styles.metricPercent}>
                {(cognitiveState.learningReadiness * 100).toFixed(0)}%
              </Text>
            </View>
            <Text style={[styles.metricName, { color: theme.colors.textSecondary }]}>
              Readiness
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBiometricCard = () => {
    const biometricData = bioSensors.getCurrentBiometricData();
    
    return (
      <View style={[styles.biometricCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart" size={24} color="#ff6b6b" />
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Biometric Data
          </Text>
        </View>
        
        <View style={styles.biometricGrid}>
          <View style={styles.biometricItem}>
            <Ionicons name="heart-outline" size={20} color="#ff6b6b" />
            <Text style={[styles.biometricValue, { color: theme.colors.text }]}>
              {biometricData.heartRate?.toFixed(0) || '--'} BPM
            </Text>
          </View>
          
          <View style={styles.biometricItem}>
            <Ionicons name="eye-outline" size={20} color="#45b7d1" />
            <Text style={[styles.biometricValue, { color: theme.colors.text }]}>
              {((biometricData.attentionLevel || 0) * 100).toFixed(0)}%
            </Text>
          </View>
          
          <View style={styles.biometricItem}>
            <Ionicons name="thermometer-outline" size={20} color="#feca57" />
            <Text style={[styles.biometricValue, { color: theme.colors.text }]}>
              {((biometricData.stressLevel || 0) * 100).toFixed(0)}%
            </Text>
          </View>
          
          <View style={styles.biometricItem}>
            <Ionicons name="happy-outline" size={20} color="#96ceb4" />
            <Text style={[styles.biometricValue, { color: theme.colors.text }]}>
              {biometricData.emotionalState?.primary || 'Unknown'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLearningModes = () => (
    <View style={[styles.modesCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Learning Modes
      </Text>
      
      <View style={styles.modeButtons}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'adaptive' && styles.activeModeButton,
            { backgroundColor: theme.colors.background }
          ]}
          onPress={() => setActiveMode('adaptive')}
        >
          <Ionicons 
            name="settings" 
            size={24} 
            color={activeMode === 'adaptive' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.modeButtonText,
            { color: activeMode === 'adaptive' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>
            Adaptive UI
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'ar' && styles.activeModeButton,
            { backgroundColor: theme.colors.background }
          ]}
          onPress={() => setActiveMode('ar')}
        >
          <Ionicons 
            name="cube" 
            size={24} 
            color={activeMode === 'ar' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.modeButtonText,
            { color: activeMode === 'ar' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>
            AR Learning
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeButton,
            activeMode === 'dashboard' && styles.activeModeButton,
            { backgroundColor: theme.colors.background }
          ]}
          onPress={() => setActiveMode('dashboard')}
        >
          <Ionicons 
            name="analytics" 
            size={24} 
            color={activeMode === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.modeButtonText,
            { color: activeMode === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary }
          ]}>
            Dashboard
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSuggestionsCard = () => (
    <View style={[styles.suggestionsCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <View style={styles.cardHeader}>
        <Ionicons name="bulb" size={24} color="#feca57" />
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          AI Suggestions
        </Text>
        <Text style={[styles.suggestionCount, { color: theme.colors.textSecondary }]}>
          {ambientSuggestor.suggestions.length}
        </Text>
      </View>
      
      <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
        {ambientSuggestor.suggestions.slice(0, 3).map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[styles.suggestionItem, { borderColor: theme.colors.border }]}
            onPress={() => ambientSuggestor.acceptSuggestion(suggestion)}
          >
            <View style={styles.suggestionContent}>
              <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
                {suggestion.title}
              </Text>
              <Text style={[styles.suggestionDescription, { color: theme.colors.textSecondary }]}>
                {suggestion.description}
              </Text>
            </View>
            <View style={styles.suggestionMeta}>
              <Text style={[styles.suggestionDuration, { color: theme.colors.textSecondary }]}>
                {suggestion.estimatedDuration}m
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
        
        {ambientSuggestor.suggestions.length === 0 && (
          <Text style={[styles.noSuggestions, { color: theme.colors.textSecondary }]}>
            No suggestions available. Start learning to get personalized recommendations!
          </Text>
        )}
      </ScrollView>
    </View>
  );

  const getCognitiveColor = (value: number): string => {
    if (value > 0.8) return '#ff6b6b';
    if (value > 0.6) return '#feca57';
    if (value > 0.4) return '#48cae4';
    return '#96ceb4';
  };

  const renderActiveMode = () => {
    switch (activeMode) {
      case 'adaptive':
        return (
          <AdaptiveLearningInterface
            onNavigateToContent={onNavigateToContent}
            onTriggerHapticFeedback={(pattern) => {
              // Handle haptic feedback patterns
              console.log('Haptic feedback:', pattern);
            }}
          />
        );
      
      case 'ar':
        return (
          <ImmersiveARLearning
            lessonContent={{
              id: 'demo-lesson',
              title: 'AR Learning Demo',
              arModels: [],
              concepts: ['Concept 1', 'Concept 2'],
              interactionPoints: [
                { x: 0, y: 0, z: -1, triggerType: 'gaze', title: 'Interactive Element' }
              ]
            }}
            onProgress={(progress) => console.log('AR Progress:', progress)}
            onComplete={() => setActiveMode('dashboard')}
          />
        );
      
      default:
        return (
          <Animated.View style={[styles.dashboardContent, { opacity: fadeInAnimation }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {renderSystemStatus()}
              {renderCognitiveStateCard()}
              {renderBiometricCard()}
              {renderLearningModes()}
              {renderSuggestionsCard()}
            </ScrollView>
          </Animated.View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderActiveMode()}
      
      {/* Detailed Analysis Modal */}
      <Modal
        visible={showDetailedAnalysis}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailedAnalysis(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Detailed Cognitive Analysis
            </Text>
            <TouchableOpacity
              onPress={() => setShowDetailedAnalysis(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Detailed cognitive metrics would go here */}
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              Comprehensive cognitive analysis including trends, patterns, and personalized insights.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dashboardContent: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cognitiveCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  cognitiveMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cognitiveMetric: {
    alignItems: 'center',
  },
  metricCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  metricName: {
    fontSize: 12,
    textAlign: 'center',
  },
  biometricCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  biometricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  biometricItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  biometricValue: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  modesCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeModeButton: {
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modeButtonText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  suggestionsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: 12,
  },
  suggestionMeta: {
    alignItems: 'center',
  },
  suggestionDuration: {
    fontSize: 12,
    marginBottom: 4,
  },
  noSuggestions: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
