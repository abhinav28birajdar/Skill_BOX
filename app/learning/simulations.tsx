/**
 * Interactive Simulations Screen
 * Features: Hands-on learning, step-by-step simulations
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SIMULATION_CATEGORIES = ['All', 'Coding', 'Design', 'Science', 'Business'];

const SIMULATIONS = [
  {
    id: 1,
    title: 'Build a REST API',
    description: 'Step-by-step guide to creating a REST API with Node.js',
    category: 'Coding',
    icon: 'code-slash',
    color: '#6366F1',
    duration: '45 min',
    steps: 8,
    completed: false,
    difficulty: 'Intermediate',
  },
  {
    id: 2,
    title: 'Design a Mobile App',
    description: 'Learn UI/UX principles by designing a complete app',
    category: 'Design',
    icon: 'color-palette',
    color: '#EC4899',
    duration: '60 min',
    steps: 12,
    completed: false,
    difficulty: 'Beginner',
  },
  {
    id: 3,
    title: 'Database Optimization',
    description: 'Optimize SQL queries and improve performance',
    category: 'Coding',
    icon: 'server',
    color: '#10B981',
    duration: '30 min',
    steps: 6,
    completed: true,
    difficulty: 'Advanced',
  },
  {
    id: 4,
    title: 'React Component Lifecycle',
    description: 'Interactive exploration of React component lifecycle',
    category: 'Coding',
    icon: 'git-network',
    color: '#3B82F6',
    duration: '25 min',
    steps: 5,
    completed: false,
    difficulty: 'Intermediate',
  },
];

const SIMULATION_STEPS = [
  { id: 1, title: 'Setup Project', description: 'Initialize a new Node.js project', completed: true },
  { id: 2, title: 'Install Dependencies', description: 'Install Express and other required packages', completed: true },
  { id: 3, title: 'Create Server', description: 'Set up the Express server', completed: true },
  { id: 4, title: 'Define Routes', description: 'Create API endpoints', completed: false, current: true },
  { id: 5, title: 'Add Middleware', description: 'Implement error handling and logging', completed: false },
  { id: 6, title: 'Database Connection', description: 'Connect to MongoDB', completed: false },
  { id: 7, title: 'Test API', description: 'Use Postman to test endpoints', completed: false },
  { id: 8, title: 'Deploy', description: 'Deploy to production', completed: false },
];

export default function SimulationsScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSimulation, setActiveSimulation] = useState<number | null>(null);

  const filteredSimulations = SIMULATIONS.filter((sim) =>
    selectedCategory === 'All' || sim.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (activeSimulation) {
    const simulation = SIMULATIONS.find((s) => s.id === activeSimulation);
    const currentStep = SIMULATION_STEPS.find((s) => s.current);
    const completedSteps = SIMULATION_STEPS.filter((s) => s.completed).length;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <LinearGradient colors={[simulation?.color || '#6366F1', '#8B5CF6']} style={styles.header}>
          <TouchableOpacity onPress={() => setActiveSimulation(null)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{simulation?.title}</Text>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progress Card */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressValue}>
                {completedSteps}/{SIMULATION_STEPS.length}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(completedSteps / SIMULATION_STEPS.length) * 100}%`, backgroundColor: simulation?.color },
                ]}
              />
            </View>
          </Animated.View>

          {/* Current Step */}
          {currentStep && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.currentStepCard}>
              <View style={styles.currentStepBadge}>
                <Text style={styles.currentStepBadgeText}>CURRENT STEP</Text>
              </View>
              <Text style={styles.currentStepTitle}>{currentStep.title}</Text>
              <Text style={styles.currentStepDescription}>{currentStep.description}</Text>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>
                  {`// Example code for ${currentStep.title}\napp.get('/api/users', (req, res) => {\n  // Your code here\n  res.json({ users: [] });\n});`}
                </Text>
              </View>
              <TouchableOpacity style={styles.completeButton}>
                <LinearGradient
                  colors={[simulation?.color || '#6366F1', '#8B5CF6']}
                  style={styles.completeButtonGradient}
                >
                  <Text style={styles.completeButtonText}>Mark as Complete</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Steps List */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>All Steps</Text>
            {SIMULATION_STEPS.map((step, index) => (
              <Animated.View
                key={step.id}
                entering={FadeInDown.delay(300 + index * 50)}
                style={[
                  styles.stepCard,
                  step.current && styles.stepCardActive,
                ]}
              >
                <View
                  style={[
                    styles.stepNumber,
                    {
                      backgroundColor: step.completed
                        ? '#10B981'
                        : step.current
                        ? simulation?.color
                        : '#E5E7EB',
                    },
                  ]}
                >
                  {step.completed ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumberText,
                        { color: step.current ? '#fff' : '#6B7280' },
                      ]}
                    >
                      {step.id}
                    </Text>
                  )}
                </View>
                <View style={styles.stepInfo}>
                  <Text
                    style={[
                      styles.stepTitle,
                      (step.completed || step.current) && styles.stepTitleActive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
                {step.current && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interactive Simulations</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="flask" size={24} color="#6366F1" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Hands-On Learning</Text>
            <Text style={styles.infoText}>
              Learn by doing with interactive step-by-step simulations
            </Text>
          </View>
        </Animated.View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SIMULATION_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Simulations List */}
        <View style={styles.simulationsList}>
          {filteredSimulations.map((simulation, index) => (
            <Animated.View
              key={simulation.id}
              entering={FadeInDown.delay(200 + index * 100)}
            >
              <TouchableOpacity
                style={styles.simulationCard}
                onPress={() => setActiveSimulation(simulation.id)}
              >
                <View
                  style={[
                    styles.simulationIcon,
                    { backgroundColor: `${simulation.color}20` },
                  ]}
                >
                  <Ionicons
                    name={simulation.icon as any}
                    size={32}
                    color={simulation.color}
                  />
                </View>

                <View style={styles.simulationContent}>
                  <View style={styles.simulationHeader}>
                    <Text style={styles.simulationTitle}>{simulation.title}</Text>
                    {simulation.completed && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      </View>
                    )}
                  </View>

                  <Text style={styles.simulationDescription} numberOfLines={2}>
                    {simulation.description}
                  </Text>

                  <View style={styles.simulationMeta}>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: `${getDifficultyColor(simulation.difficulty)}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(simulation.difficulty) },
                        ]}
                      >
                        {simulation.difficulty}
                      </Text>
                    </View>
                    <View style={styles.simulationMetaDot} />
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.simulationMetaText}>{simulation.duration}</Text>
                    <View style={styles.simulationMetaDot} />
                    <Ionicons name="list" size={14} color="#6B7280" />
                    <Text style={styles.simulationMetaText}>{simulation.steps} steps</Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  infoCard: { flexDirection: 'row', margin: 20, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 16, gap: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: '#4338CA', marginBottom: 4 },
  infoText: { fontSize: 13, color: '#6366F1', lineHeight: 18 },
  categoriesContainer: { paddingHorizontal: 20, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 20, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#6366F1' },
  categoryText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  categoryTextActive: { color: '#fff' },
  simulationsList: { paddingHorizontal: 20, gap: 12 },
  simulationCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, gap: 12 },
  simulationIcon: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  simulationContent: { flex: 1 },
  simulationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  simulationTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: '#1F2937' },
  completedBadge: {},
  simulationDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  simulationMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  difficultyText: { fontSize: 11, fontWeight: '800' },
  simulationMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D1D5DB' },
  simulationMetaText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  progressCard: { margin: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressLabel: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  progressValue: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  progressBar: { height: 10, backgroundColor: '#E5E7EB', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  currentStepCard: { marginHorizontal: 20, padding: 20, backgroundColor: '#fff', borderRadius: 16, marginBottom: 20 },
  currentStepBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#FEF3C7', borderRadius: 8, marginBottom: 12 },
  currentStepBadgeText: { fontSize: 11, fontWeight: '800', color: '#F59E0B' },
  currentStepTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  currentStepDescription: { fontSize: 15, color: '#6B7280', lineHeight: 22, marginBottom: 16 },
  codeBlock: { padding: 16, backgroundColor: '#1F2937', borderRadius: 12, marginBottom: 16 },
  codeText: { fontFamily: 'monospace', fontSize: 13, color: '#10B981', lineHeight: 20 },
  completeButton: { borderRadius: 12, overflow: 'hidden' },
  completeButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  completeButtonText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  stepsSection: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 16 },
  stepCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, gap: 12 },
  stepCardActive: { borderWidth: 2, borderColor: '#6366F1' },
  stepNumber: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '800' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: '#6B7280', marginBottom: 4 },
  stepTitleActive: { color: '#1F2937', fontWeight: '800' },
  stepDescription: { fontSize: 13, color: '#9CA3AF', lineHeight: 18 },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EEF2FF', borderRadius: 8 },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: '#6366F1' },
  bottomSpacing: { height: 20 },
});
