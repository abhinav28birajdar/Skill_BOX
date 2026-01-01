/**
 * Code Editor Screen
 * Features: Syntax-highlighted code editor with execution
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_CODE = `// Write your JavaScript code here
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
// Output: 55`;

const CODE_TEMPLATES = [
  { id: 1, name: 'Hello World', icon: 'code-slash', language: 'javascript' },
  { id: 2, name: 'Array Methods', icon: 'list', language: 'javascript' },
  { id: 3, name: 'Async/Await', icon: 'timer', language: 'javascript' },
  { id: 4, name: 'React Component', icon: 'logo-react', language: 'jsx' },
];

export default function CodeEditorScreen() {
  const router = useRouter();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const runCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      // Simulate code execution
      setOutput('55\nExecution time: 0.02ms');
      setIsRunning(false);
    }, 1000);
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Code Editor</Text>
        <TouchableOpacity onPress={clearCode}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Selector */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.languageSelector}>
          <Text style={styles.sectionLabel}>Language</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
            {['javascript', 'python', 'java', 'typescript'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageChip,
                  selectedLanguage === lang && styles.languageChipActive,
                ]}
                onPress={() => setSelectedLanguage(lang)}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    selectedLanguage === lang && styles.languageChipTextActive,
                  ]}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Templates */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionLabel}>Quick Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
            {CODE_TEMPLATES.map((template) => (
              <TouchableOpacity key={template.id} style={styles.templateCard}>
                <View style={styles.templateIcon}>
                  <Ionicons name={template.icon as any} size={24} color="#6366F1" />
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Code Editor */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.editorSection}>
          <View style={styles.editorHeader}>
            <Text style={styles.sectionLabel}>Code</Text>
            <View style={styles.editorActions}>
              <TouchableOpacity style={styles.editorAction}>
                <Ionicons name="copy-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editorAction}>
                <Ionicons name="share-outline" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.editorContainer}>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={setCode}
              multiline
              placeholder="Write your code here..."
              placeholderTextColor="#9CA3AF"
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
            />
          </View>
          <View style={styles.lineNumbers}>
            {code.split('\n').map((_, index) => (
              <Text key={index} style={styles.lineNumber}>
                {index + 1}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Output */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.outputSection}>
          <Text style={styles.sectionLabel}>Output</Text>
          <View style={styles.outputContainer}>
            {output ? (
              <Text style={styles.outputText}>{output}</Text>
            ) : (
              <Text style={styles.outputPlaceholder}>
                Run your code to see the output here
              </Text>
            )}
          </View>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.runButton, isRunning && styles.runButtonDisabled]}
          onPress={runCode}
          disabled={isRunning}
        >
          <LinearGradient colors={['#10B981', '#059669']} style={styles.runButtonGradient}>
            {isRunning ? (
              <>
                <Ionicons name="hourglass-outline" size={20} color="#fff" />
                <Text style={styles.runButtonText}>Running...</Text>
              </>
            ) : (
              <>
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.runButtonText}>Run Code</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  content: { flex: 1 },
  section: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  languageSelector: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12 },
  languageScroll: { flexDirection: 'row' },
  languageChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F3F4F6', borderRadius: 20, marginRight: 8 },
  languageChipActive: { backgroundColor: '#6366F1' },
  languageChipText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  languageChipTextActive: { color: '#fff' },
  templatesScroll: { flexDirection: 'row' },
  templateCard: { width: 100, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, marginRight: 12, alignItems: 'center' },
  templateIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  templateName: { fontSize: 13, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  editorSection: { padding: 20, backgroundColor: '#fff', marginBottom: 2 },
  editorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editorActions: { flexDirection: 'row', gap: 12 },
  editorAction: { padding: 4 },
  editorContainer: { backgroundColor: '#1F2937', borderRadius: 12, padding: 16, minHeight: 300 },
  codeInput: { fontFamily: 'monospace', fontSize: 14, color: '#fff', lineHeight: 22 },
  lineNumbers: { position: 'absolute', left: 20, top: 60, paddingRight: 12, borderRightWidth: 1, borderRightColor: '#374151' },
  lineNumber: { fontFamily: 'monospace', fontSize: 12, color: '#6B7280', lineHeight: 22 },
  outputSection: { padding: 20, backgroundColor: '#fff' },
  outputContainer: { backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, minHeight: 100 },
  outputText: { fontFamily: 'monospace', fontSize: 14, color: '#1F2937', lineHeight: 22 },
  outputPlaceholder: { fontSize: 14, color: '#9CA3AF', fontStyle: 'italic' },
  bottomSpacing: { height: 80 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  runButton: { borderRadius: 12, overflow: 'hidden' },
  runButtonDisabled: { opacity: 0.6 },
  runButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  runButtonText: { fontSize: 16, fontWeight: '800', color: '#fff' },
});
