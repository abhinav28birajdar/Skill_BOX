import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuthContext } from '../../context/AuthContext';
import { useAmbientLearningSuggestor } from '../../hooks/useAmbientLearningSuggestor';
import { useBioSensors } from '../../hooks/useBioSensors';
import { useCognitiveLoad } from '../../hooks/useCognitiveLoad';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface AdaptiveLearningInterfaceProps {
  onNavigateToContent: (contentId: string) => void;
  onTriggerHapticFeedback: (pattern: string) => void;
}

export function AdaptiveLearningInterface({
  onNavigateToContent,
  onTriggerHapticFeedback
}: AdaptiveLearningInterfaceProps) {
  const { user } = useAuthContext();
  const { theme } = useTheme();
  
  // Bio-cognitive hooks
  const biometricData = useBioSensors();
  const cognitiveAnalysis = useCognitiveLoad(biometricData.getCurrentBiometricData());
  const {
    cognitiveState,
    getAdaptationSuggestions
  } = cognitiveAnalysis;
  
  const cognitiveLoad = cognitiveState.cognitiveLoad;
  const focusLevel = cognitiveState.focusLevel;
  const learningReadiness = cognitiveState.learningReadiness;
  
  const {
    suggestions,
    currentOpportunity,
    acceptSuggestion,
    dismissSuggestion,
    getAdaptiveRecommendations
  } = useAmbientLearningSuggestor(user?.id || '', {
    cognitiveLoad,
    focusLevel,
    learningReadiness,
    emotionalState: cognitiveState.emotionalState,
    brainwaveStates: cognitiveState.brainwaveStates
  });

  // UI adaptation states
  const [interfaceMode, setInterfaceMode] = useState<'adaptive' | 'focus' | 'rest'>('adaptive');
  const [showBiometricPanel, setShowBiometricPanel] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  
  // Animated values for responsive UI
  const adaptiveOpacity = new Animated.Value(1);
  const focusScale = new Animated.Value(1);
  const cognitiveLoadIndicator = new Animated.Value(0);
  const attentionPulse = new Animated.Value(1);

  useEffect(() => {
    adaptInterfaceToState();
  }, [cognitiveLoad, focusLevel, learningReadiness]);

  useEffect(() => {
    animateCognitiveIndicators();
  }, [biometricData]);

  const adaptInterfaceToState = () => {
    // Determine optimal interface mode based on cognitive state
    if (cognitiveLoad > 0.8) {
      setInterfaceMode('rest');
      triggerLowCognitiveMode();
    } else if (focusLevel > 0.8 && learningReadiness > 0.7) {
      setInterfaceMode('focus');
      triggerHighFocusMode();
    } else {
      setInterfaceMode('adaptive');
      triggerAdaptiveMode();
    }
  };

  const triggerLowCognitiveMode = () => {
    // Simplify interface for cognitive overload
    Animated.parallel([
      Animated.timing(adaptiveOpacity, {
        toValue: 0.7,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(focusScale, {
        toValue: 0.9,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();

    // Suggest break or light activities
    onTriggerHapticFeedback('gentle');
  };

  const triggerHighFocusMode = () => {
    // Enhance interface for optimal learning
    Animated.parallel([
      Animated.timing(adaptiveOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(focusScale, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();

    // Provide subtle positive feedback
    onTriggerHapticFeedback('success');
  };

  const triggerAdaptiveMode = () => {
    // Normal adaptive interface
    Animated.parallel([
      Animated.timing(adaptiveOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }),
      Animated.timing(focusScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      })
    ]).start();
  };

  const animateCognitiveIndicators = () => {
    // Animate cognitive load indicator
    Animated.timing(cognitiveLoadIndicator, {
      toValue: cognitiveLoad,
      duration: 1000,
      useNativeDriver: false
    }).start();

    // Pulse attention indicator
    const currentBiometric = biometricData.getCurrentBiometricData();
    if (currentBiometric?.facialExpressions?.attention && currentBiometric.facialExpressions.attention < 0.5) {
      Animated.sequence([
        Animated.timing(attentionPulse, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(attentionPulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();
    }
  };

  const handleAcceptSuggestion = async (suggestion: any) => {
    try {
      const content = await acceptSuggestion(suggestion);
      onTriggerHapticFeedback('selection');
      
      if (content) {
        onNavigateToContent(content.id || suggestion.id);
      }
    } catch (error) {
      console.error('Error accepting suggestion:', error);
    }
  };

  const renderCognitiveStatePanel = () => (
    <View style={[styles.cognitivePanel, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
        Cognitive State
      </Text>
      
      <View style={styles.stateIndicators}>
        {/* Cognitive Load */}
        <View style={styles.indicator}>
          <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
            Cognitive Load
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: cognitiveLoadIndicator.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: cognitiveLoad > 0.7 ? '#ff6b6b' : '#4ecdc4'
                }
              ]}
            />
          </View>
        </View>

        {/* Focus Level */}
        <View style={styles.indicator}>
          <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
            Focus Level
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${(focusLevel * 100)}%`,
                  backgroundColor: '#45b7d1'
                }
              ]}
            />
          </View>
        </View>

        {/* Learning Readiness */}
        <View style={styles.indicator}>
          <Text style={[styles.indicatorLabel, { color: theme.colors.text }]}>
            Learning Readiness
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${(learningReadiness * 100)}%`,
                  backgroundColor: '#96ceb4'
                }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Biometric Indicators */}
      {(() => {
        const currentBiometric = biometricData.getCurrentBiometricData();
        return currentBiometric && (
          <View style={styles.biometricIndicators}>
            <View style={styles.biometricRow}>
              <Ionicons 
                name="heart" 
                size={16} 
                color={currentBiometric.heartRate && currentBiometric.heartRate > 100 ? '#ff6b6b' : '#4ecdc4'} 
              />
              <Text style={[styles.biometricText, { color: theme.colors.text }]}>
                {currentBiometric.heartRate?.toFixed(0) || 'N/A'} BPM
              </Text>
            </View>
            
            <Animated.View 
              style={[
                styles.biometricRow,
                { transform: [{ scale: attentionPulse }] }
              ]}
            >
              <Ionicons 
                name="eye" 
                size={16} 
                color={currentBiometric.facialExpressions?.attention && currentBiometric.facialExpressions.attention > 0.5 ? '#45b7d1' : '#feca57'} 
              />
              <Text style={[styles.biometricText, { color: theme.colors.text }]}>
                {((currentBiometric.facialExpressions?.attention || 0) * 100).toFixed(0)}% Attention
              </Text>
            </Animated.View>
          </View>
        );
      })()}
    </View>
  );

  const renderAmbientSuggestions = () => (
    <View style={[styles.suggestionsPanel, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
        Smart Suggestions
      </Text>
      
      {currentOpportunity && (
        <View style={styles.opportunityCard}>
          <Text style={[styles.opportunityText, { color: theme.colors.text }]}>
            💡 {currentOpportunity.availableTime} minutes available
          </Text>
          <Text style={[styles.opportunitySubtext, { color: theme.colors.textSecondary }]}>
            {currentOpportunity.optimalContentType} content recommended
          </Text>
        </View>
      )}

      <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={suggestion.id}
            style={[
              styles.suggestionCard,
              { 
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                marginBottom: 12
              }
            ]}
            onPress={() => handleAcceptSuggestion(suggestion)}
          >
            <View style={styles.suggestionHeader}>
              <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
                {suggestion.title}
              </Text>
              <View style={[
                styles.priorityBadge,
                { 
                  backgroundColor: suggestion.priority === 'high' ? '#ff6b6b' : 
                                  suggestion.priority === 'medium' ? '#feca57' : '#a8e6cf'
                }
              ]}>
                <Text style={styles.priorityText}>
                  {suggestion.priority}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.suggestionDescription, { color: theme.colors.textSecondary }]}>
              {suggestion.description}
            </Text>
            
            <View style={styles.suggestionFooter}>
              <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
                ⏱️ {suggestion.estimatedDuration} min
              </Text>
              
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={() => dismissSuggestion(suggestion)}
              >
                <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAdaptationRecommendations = () => {
    const recommendations = getAdaptiveRecommendations();
    
    if (recommendations.length === 0) return null;

    return (
      <View style={[styles.recommendationsPanel, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
          Adaptive Recommendations
        </Text>
        
        {recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons name="bulb" size={16} color="#feca57" />
            <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
              {recommendation}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderModeIndicator = () => (
    <View style={[styles.modeIndicator, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Ionicons
        name={
          interfaceMode === 'focus' ? 'flash' :
          interfaceMode === 'rest' ? 'leaf' : 'infinite'
        }
        size={20}
        color={
          interfaceMode === 'focus' ? '#45b7d1' :
          interfaceMode === 'rest' ? '#96ceb4' : theme.colors.primary
        }
      />
      <Text style={[styles.modeText, { color: theme.colors.text }]}>
        {interfaceMode.charAt(0).toUpperCase() + interfaceMode.slice(1)} Mode
      </Text>
    </View>
  );

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.background,
          opacity: adaptiveOpacity,
          transform: [{ scale: focusScale }]
        }
      ]}
    >
      {/* Mode Indicator */}
      {renderModeIndicator()}
      
      {/* Cognitive State Panel */}
      {renderCognitiveStatePanel()}
      
      {/* Ambient Suggestions */}
      {renderAmbientSuggestions()}
      
      {/* Adaptation Recommendations */}
      {renderAdaptationRecommendations()}
      
      {/* Biometric Detail Modal */}
      <Modal
        visible={showBiometricPanel}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBiometricPanel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Detailed Biometric Analysis
            </Text>
            
            {(() => {
              const currentBiometric = biometricData.getCurrentBiometricData();
              return currentBiometric && (
                <View style={styles.detailedBiometrics}>
                  <Text style={[styles.biometricDetail, { color: theme.colors.text }]}>
                    Heart Rate: {currentBiometric.heartRate?.toFixed(0) || 'N/A'} BPM
                  </Text>
                  <Text style={[styles.biometricDetail, { color: theme.colors.text }]}>
                    Stress Level: {((currentBiometric.eyeTracking?.pupilDilation || 0) * 100).toFixed(0)}%
                  </Text>
                  <Text style={[styles.biometricDetail, { color: theme.colors.text }]}>
                    Attention: {((currentBiometric.facialExpressions?.attention || 0) * 100).toFixed(0)}%
                  </Text>
                  {currentBiometric.facialExpressions?.emotion && (
                    <Text style={[styles.biometricDetail, { color: theme.colors.text }]}>
                      Emotion: {currentBiometric.facialExpressions.emotion}
                    </Text>
                  )}
                </View>
              );
            })()}
            
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowBiometricPanel(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.surface }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Floating Action Button for Biometric Details */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setShowBiometricPanel(true)}
      >
        <Ionicons name="analytics" size={24} color={theme.colors.surface} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  modeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  cognitivePanel: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stateIndicators: {
    marginBottom: 16,
  },
  indicator: {
    marginBottom: 12,
  },
  indicatorLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  biometricIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  biometricRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  biometricText: {
    fontSize: 12,
    marginLeft: 4,
  },
  suggestionsPanel: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  opportunityCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginBottom: 12,
  },
  opportunityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  opportunitySubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  suggestionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  suggestionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
  },
  dismissButton: {
    padding: 4,
  },
  recommendationsPanel: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailedBiometrics: {
    marginBottom: 20,
  },
  biometricDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
