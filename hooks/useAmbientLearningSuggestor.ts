import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { CognitiveState } from '../ai/models/interfaces';
import { supabase } from '../lib/supabase';

export interface AmbientSuggestion {
  id: string;
  type: 'learning_snack' | 'review' | 'practice' | 'break' | 'challenge';
  title: string;
  description: string;
  estimatedDuration: number; // in minutes
  content: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  triggers: string[];
  contextual: boolean;
}

export interface LearningOpportunity {
  availableTime: number; // in minutes
  optimalContentType: string;
  suggestedDifficulty: number;
  environmentalFactors: {
    location: string;
    timeOfDay: string;
    distractionLevel: number;
  };
}

export function useAmbientLearningSuggestor(
  userId: string,
  cognitiveState?: CognitiveState,
  currentLocation?: string
) {
  const [suggestions, setSuggestions] = useState<AmbientSuggestion[]>([]);
  const [currentOpportunity, setCurrentOpportunity] = useState<LearningOpportunity | null>(null);
  const [isActive, setIsActive] = useState(true);

  const lastSuggestionTime = useRef<number>(0);
  const userActivityPattern = useRef<any>({});
  const contextHistory = useRef<any[]>([]);

  useEffect(() => {
    initializeAmbientTracking();
    loadUserLearningPattern();

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appStateSubscription.remove();
    };
  }, [userId]);

  useEffect(() => {
    if (cognitiveState && isActive) {
      analyzeAmbientOpportunity();
    }
  }, [cognitiveState, currentLocation]);

  const initializeAmbientTracking = () => {
    // Start tracking user's ambient context
    setInterval(() => {
      if (isActive) {
        updateContextHistory();
        // generateAmbientSuggestions(); // This will be called via analyzeAmbientOpportunity
      }
    }, 60000); // Check every minute
  };

  const loadUserLearningPattern = async () => {
    try {
      const { data: patterns } = await supabase
        .from('user_learning_patterns')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (patterns) {
        userActivityPattern.current = patterns;
      }
    } catch (error) {
      console.error('Error loading learning patterns:', error);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setIsActive(true);
      // User just opened the app - good time for a suggestion
      generateWelcomeBackSuggestion();
    } else {
      setIsActive(false);
    }
  };

  const updateContextHistory = () => {
    const currentContext = {
      timestamp: Date.now(),
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      location: currentLocation || 'unknown',
      cognitiveState: cognitiveState,
      appUsage: 'active'
    };

    contextHistory.current.push(currentContext);
    
    // Keep only last 24 hours of context
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    contextHistory.current = contextHistory.current.filter(
      ctx => ctx.timestamp > oneDayAgo
    );
  };

  const analyzeAmbientOpportunity = () => {
    if (!cognitiveState) return;

    const now = new Date();
    const timeOfDay = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Analyze current context for learning opportunity
    const opportunity: LearningOpportunity = {
      availableTime: estimateAvailableTime(timeOfDay, dayOfWeek),
      optimalContentType: selectOptimalContentType(cognitiveState),
      suggestedDifficulty: calculateOptimalDifficulty(cognitiveState),
      environmentalFactors: {
        location: currentLocation || 'unknown',
        timeOfDay: getTimeOfDayCategory(timeOfDay),
        distractionLevel: estimateDistractionLevel()
      }
    };

    setCurrentOpportunity(opportunity);

    // Generate suggestions based on opportunity
    if (shouldGenerateSuggestion(opportunity)) {
      generateContextualSuggestions(opportunity);
    }
  };

  const estimateAvailableTime = (hour: number, dayOfWeek: number): number => {
    // Estimate available time based on historical patterns and current context
    const pattern = userActivityPattern.current;
    
    if (pattern?.timePreferences) {
      const timeSlot = `${dayOfWeek}_${hour}`;
      return pattern.timePreferences[timeSlot] || 15; // Default 15 minutes
    }

    // Default estimates based on time of day
    if (hour >= 6 && hour <= 8) return 10; // Morning routine
    if (hour >= 12 && hour <= 13) return 20; // Lunch break
    if (hour >= 17 && hour <= 19) return 30; // Evening
    if (hour >= 20 && hour <= 22) return 45; // Night study time

    return 5; // Very short windows otherwise
  };

  const selectOptimalContentType = (state: CognitiveState): string => {
    if (state.cognitiveLoad > 0.8) return 'audio'; // Low cognitive demand
    if (state.focusLevel > 0.8) return 'interactive'; // High engagement
    if (state.learningReadiness > 0.8) return 'video'; // Rich content
    
    return 'text'; // Default
  };

  const calculateOptimalDifficulty = (state: CognitiveState): number => {
    let difficulty = 0.5;
    
    // Adjust based on cognitive state
    if (state.cognitiveLoad > 0.7) difficulty -= 0.2;
    if (state.learningReadiness > 0.7) difficulty += 0.2;
    if (state.focusLevel < 0.5) difficulty -= 0.1;
    
    return Math.max(0.1, Math.min(1.0, difficulty));
  };

  const getTimeOfDayCategory = (hour: number): string => {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };

  const estimateDistractionLevel = (): number => {
    // Estimate distraction level based on context
    const hour = new Date().getHours();
    
    // Higher distraction during work hours and late night
    if ((hour >= 9 && hour <= 17) || hour >= 23) return 0.8;
    if (hour >= 7 && hour <= 9) return 0.6; // Morning rush
    
    return 0.3; // Generally lower distraction
  };

  const shouldGenerateSuggestion = (opportunity: LearningOpportunity): boolean => {
    const timeSinceLastSuggestion = Date.now() - lastSuggestionTime.current;
    const minInterval = 30 * 60 * 1000; // 30 minutes minimum between suggestions
    
    if (timeSinceLastSuggestion < minInterval) return false;
    
    // Generate suggestion if there's a good opportunity
    return (
      opportunity.availableTime >= 5 && // At least 5 minutes
      opportunity.environmentalFactors.distractionLevel < 0.7 &&
      cognitiveState?.learningReadiness !== undefined && cognitiveState.learningReadiness > 0.4
    );
  };

  const generateContextualSuggestions = async (opportunity: LearningOpportunity) => {
    try {
      // Get user's current learning goals and progress
      const { data: progress } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(5);

      const progressData = progress || [];
      const newSuggestions: AmbientSuggestion[] = [];

      // Generate different types of suggestions based on context
      if (opportunity.availableTime <= 10) {
        // Short time window - suggest micro-learning
        newSuggestions.push(generateMicroLearningSuggestion(opportunity, progressData));
      } else if (opportunity.availableTime <= 30) {
        // Medium time window - suggest focused practice
        newSuggestions.push(generateFocusedPracticeSuggestion(opportunity, progressData));
      } else {
        // Longer time window - suggest comprehensive learning
        newSuggestions.push(generateComprehensiveLearning(opportunity, progressData));
      }

      // Add review suggestions based on spaced repetition
      const reviewSuggestion = generateSpacedRepetitionSuggestion(progressData);
      if (reviewSuggestion) {
        newSuggestions.push(reviewSuggestion);
      }

      setSuggestions(prev => [...prev, ...newSuggestions]);
      lastSuggestionTime.current = Date.now();

    } catch (error) {
      console.error('Error generating contextual suggestions:', error);
    }
  };

  const generateMicroLearningSuggestion = (
    opportunity: LearningOpportunity,
    progress: any[]
  ): AmbientSuggestion => {
    return {
      id: `micro_${Date.now()}`,
      type: 'learning_snack',
      title: 'Quick Knowledge Bite',
      description: `Perfect for your ${opportunity.availableTime}-minute window`,
      estimatedDuration: Math.min(opportunity.availableTime, 10),
      content: {
        type: opportunity.optimalContentType,
        difficulty: opportunity.suggestedDifficulty,
        format: 'micro'
      },
      priority: 'medium',
      triggers: ['short_time_window', 'ambient_opportunity'],
      contextual: true
    };
  };

  const generateFocusedPracticeSuggestion = (
    opportunity: LearningOpportunity,
    progress: any[]
  ): AmbientSuggestion => {
    return {
      id: `practice_${Date.now()}`,
      type: 'practice',
      title: 'Skill Practice Session',
      description: 'Perfect time to practice what you\'ve learned',
      estimatedDuration: Math.min(opportunity.availableTime, 25),
      content: {
        type: 'interactive',
        difficulty: opportunity.suggestedDifficulty,
        format: 'practice'
      },
      priority: 'high',
      triggers: ['medium_time_window', 'good_focus'],
      contextual: true
    };
  };

  const generateComprehensiveLearning = (
    opportunity: LearningOpportunity,
    progress: any[]
  ): AmbientSuggestion => {
    return {
      id: `comprehensive_${Date.now()}`,
      type: 'learning_snack',
      title: 'Deep Learning Session',
      description: 'Dive deep into new concepts',
      estimatedDuration: Math.min(opportunity.availableTime, 45),
      content: {
        type: 'video',
        difficulty: opportunity.suggestedDifficulty + 0.1,
        format: 'comprehensive'
      },
      priority: 'high',
      triggers: ['long_time_window', 'high_readiness'],
      contextual: true
    };
  };

  const generateSpacedRepetitionSuggestion = (progress: any[]): AmbientSuggestion | null => {
    // Find concepts that need review based on spaced repetition algorithm
    const now = Date.now();
    const itemsNeedingReview = progress?.filter(item => {
      const lastReviewed = new Date(item.last_reviewed).getTime();
      const interval = item.review_interval || 1; // days
      const nextReview = lastReviewed + (interval * 24 * 60 * 60 * 1000);
      
      return now >= nextReview;
    }) || [];

    if (itemsNeedingReview.length === 0) return null;

    return {
      id: `review_${Date.now()}`,
      type: 'review',
      title: 'Quick Review',
      description: `Review ${itemsNeedingReview.length} concepts to strengthen memory`,
      estimatedDuration: itemsNeedingReview.length * 2, // 2 minutes per concept
      content: {
        type: 'flashcard',
        items: itemsNeedingReview,
        format: 'spaced_repetition'
      },
      priority: 'high',
      triggers: ['spaced_repetition', 'memory_consolidation'],
      contextual: true
    };
  };

  const generateWelcomeBackSuggestion = () => {
    const suggestion: AmbientSuggestion = {
      id: `welcome_${Date.now()}`,
      type: 'learning_snack',
      title: 'Welcome back!',
      description: 'Continue where you left off',
      estimatedDuration: 5,
      content: {
        type: 'summary',
        format: 'continuation'
      },
      priority: 'medium',
      triggers: ['app_return'],
      contextual: true
    };

    setSuggestions(prev => [suggestion, ...prev]);
  };

  const acceptSuggestion = async (suggestion: AmbientSuggestion) => {
    try {
      // Log suggestion acceptance for learning
      await supabase
        .from('suggestion_interactions')
        .insert({
          user_id: userId,
          suggestion_id: suggestion.id,
          action: 'accepted',
          timestamp: new Date().toISOString(),
          context: {
            cognitive_state: cognitiveState,
            opportunity: currentOpportunity
          }
        });

      // Remove suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      
      return suggestion.content;
    } catch (error) {
      console.error('Error accepting suggestion:', error);
    }
  };

  const dismissSuggestion = async (suggestion: AmbientSuggestion, reason?: string) => {
    try {
      // Log suggestion dismissal for learning
      await supabase
        .from('suggestion_interactions')
        .insert({
          user_id: userId,
          suggestion_id: suggestion.id,
          action: 'dismissed',
          reason,
          timestamp: new Date().toISOString(),
          context: {
            cognitive_state: cognitiveState,
            opportunity: currentOpportunity
          }
        });

      // Remove suggestion from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    } catch (error) {
      console.error('Error dismissing suggestion:', error);
    }
  };

  const snoozeAllSuggestions = () => {
    setSuggestions([]);
    lastSuggestionTime.current = Date.now() + (60 * 60 * 1000); // Snooze for 1 hour
  };

  const getAdaptiveRecommendations = () => {
    if (!cognitiveState || !currentOpportunity) return [];

    const recommendations: string[] = [];

    if (cognitiveState.focusLevel < 0.4) {
      recommendations.push('Consider taking a break before learning');
    }

    if (currentOpportunity.environmentalFactors.distractionLevel > 0.7) {
      recommendations.push('Find a quieter environment for better focus');
    }

    if (cognitiveState.learningReadiness > 0.8) {
      recommendations.push('Great time to tackle challenging material');
    }

    return recommendations;
  };

  return {
    suggestions,
    currentOpportunity,
    acceptSuggestion,
    dismissSuggestion,
    snoozeAllSuggestions,
    getAdaptiveRecommendations,
    isActive,
    setIsActive
  };
}
