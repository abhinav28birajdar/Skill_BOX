import { useAI } from '@/context/AIModelContext';
import { useTheme } from '@/context/ThemeContext';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import { GLView } from 'expo-gl';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface ImmersiveContent {
  type: '3d' | 'ar' | 'hologram';
  modelUri?: string;
  arAnchors?: any[];
  hapticPattern?: string;
  spatialAudio?: {
    uri: string;
    position: { x: number; y: number; z: number };
  };
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'concept' | 'quiz' | '3d' | 'ar' | 'hologram';
  metadata?: any;
  immersiveContent?: ImmersiveContent;
  emotionalContext?: {
    sentiment: string;
    confidence: number;
    suggestedResponse?: string;
  };
}

interface BiometricState {
  attentionLevel: number;
  emotionalState: string;
  cognitiveLoad: number;
  eyeTrackingData?: {
    gazePosition: { x: number; y: number };
    pupilDilation: number;
  };
}

interface AITutorChatProps {
  contentContext?: string;
  onClose?: () => void;
  minimized?: boolean;
  onToggleMinimize?: () => void;
  enableBiometrics?: boolean;
  enableImmersive?: boolean;
  hapticFeedback?: boolean;
  spatialAudio?: boolean;
}

export function AITutorChat({
  contentContext,
  onClose,
  minimized = false,
  onToggleMinimize,
  enableBiometrics = false,
  enableImmersive = false,
  hapticFeedback = false,
  spatialAudio = false,
}: AITutorChatProps) {
  const { theme } = useTheme();
  const { 
    isAIEnabled, 
    generateContent, 
    analyzeEngagement,
    updateBiometricData,
    getCognitiveState,
    generateHapticPattern,
    generateImmersiveContent
  } = useAI();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [biometricState, setBiometricState] = useState<BiometricState>({
    attentionLevel: 1,
    emotionalState: 'neutral',
    cognitiveLoad: 0.5
  });
  
  const flatListRef = useRef<FlatList>(null);
  const cameraRef = useRef<Camera>(null);
  const glViewRef = useRef<GLView>(null);
  const animatedHeight = useRef(new Animated.Value(minimized ? 60 : 400)).current;
  
  // Biometric monitoring interval
  useEffect(() => {
    if (!enableBiometrics) return;
    
    const biometricInterval = setInterval(async () => {
      if (cameraRef.current) {
        const faces = await detectFaces();
        if (faces.length > 0) {
          const face = faces[0];
          const newBiometricState = {
            attentionLevel: calculateAttention(face),
            emotionalState: detectEmotion(face),
            cognitiveLoad: estimateCognitiveLoad(face),
            eyeTrackingData: {
              gazePosition: { x: face.leftEyePosition.x, y: face.leftEyePosition.y },
              pupilDilation: face.leftEyeOpenProbability || 0.5
            }
          };
          
          setBiometricState(newBiometricState);
          updateBiometricData({
            facialExpressions: {
              attention: newBiometricState.attentionLevel,
              emotion: newBiometricState.emotionalState,
              microExpressions: []
            },
            eyeTracking: {
              gazePosition: newBiometricState.eyeTrackingData.gazePosition,
              pupilDilation: newBiometricState.eyeTrackingData.pupilDilation
            }
          });
        }
      }
    }, 1000);

    return () => clearInterval(biometricInterval);
  }, [enableBiometrics]);

  useEffect(() => {
    if (isAIEnabled && contentContext) {
      initializeChat();
    }
  }, [isAIEnabled, contentContext]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: minimized ? 60 : 400,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [minimized]);

  const initializeChat = useCallback(async () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: `Hi! I'm your AI tutor. I'm here to help you understand ${contentContext || 'this topic'} better. Feel free to ask me any questions!`,
      isUser: false,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([welcomeMessage]);
    
    // Generate contextual suggestions
    setSuggestions([
      'Explain this concept simply',
      'Give me an example',
      'What should I learn next?',
      'Test my understanding',
    ]);
  }, [contentContext]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !isAIEnabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiResponse = await generateContent(
        `User question: "${text}" in context of: ${contentContext}`,
        'text'
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update suggestions based on conversation context
      updateSuggestions(text);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble processing that right now. Could you try rephrasing your question?",
        isUser: false,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [isAIEnabled, contentContext, generateContent]);

  const updateSuggestions = (lastMessage: string) => {
    const lowerMessage = lastMessage.toLowerCase();
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what')) {
      setSuggestions([
        'Can you give me an example?',
        'How is this used in practice?',
        'What are the key points?',
        'Quiz me on this',
      ]);
    } else if (lowerMessage.includes('example')) {
      setSuggestions([
        'Show me more examples',
        'How would I apply this?',
        'What are common mistakes?',
        'Test my understanding',
      ]);
    } else {
      setSuggestions([
        'Explain this differently',
        'Give me practice problems',
        'What should I learn next?',
        'Summarize key points',
      ]);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage,
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: item.isUser ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}>
        <Text style={[
          styles.messageText,
          { color: item.isUser ? '#FFFFFF' : theme.colors.text }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          { color: item.isUser ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary }
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.suggestionChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={[styles.suggestionText, { color: theme.colors.textSecondary }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (!isAIEnabled) {
    return (
      <View style={[styles.disabledContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.disabledText, { color: theme.colors.textSecondary }]}>
          AI Tutor is disabled. Enable AI features in settings to use this feature.
        </Text>
      </View>
    );
  }

  // Biometric analysis functions
  const detectFaces = async () => {
    if (!cameraRef.current) return [];
    const options = {
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
      runClassifications: FaceDetector.FaceDetectorClassifications.all,
      minDetectionInterval: 100,
      tracking: true,
    };

    try {
      const faces = await cameraRef.current.detectFacesAsync(options);
      return faces;
    } catch (error) {
      console.error('Face detection error:', error);
      return [];
    }
  };

  const calculateAttention = (face: any) => {
    const eyeOpenScore = (face.leftEyeOpenProbability + face.rightEyeOpenProbability) / 2;
    const headRotation = Math.abs(face.rollAngle) + Math.abs(face.yawAngle);
    return Math.max(0, Math.min(1, (eyeOpenScore * 0.7 + (1 - headRotation / 90) * 0.3)));
  };

  const detectEmotion = (face: any) => {
    if (face.smilingProbability > 0.7) return 'happy';
    if (face.smilingProbability < 0.2) return 'serious';
    return 'neutral';
  };

  const estimateCognitiveLoad = (face: any) => {
    const blinkRate = face.leftEyeOpenProbability < 0.2 ? 1 : 0;
    const headMovement = Math.abs(face.rollAngle) + Math.abs(face.yawAngle);
    return Math.min(1, (blinkRate * 0.4 + headMovement / 90 * 0.6));
  };

  // Haptic feedback based on message content
  const provideFeedback = async (message: Message) => {
    if (!hapticFeedback) return;
    
    const emotion = message.emotionalContext?.sentiment || 'neutral';
    const intensity = message.emotionalContext?.confidence || 0.5;
    const pattern = await generateHapticPattern(emotion, intensity);
    
    switch (pattern) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderImmersiveContent = (content: ImmersiveContent) => {
    if (!enableImmersive) return null;

    switch (content.type) {
      case '3d':
        return (
          <GLView
            ref={glViewRef}
            style={{ width: '100%', height: 200 }}
            onContextCreate={async (gl) => {
              // Initialize THREE.js scene here
              const modelData = await generateImmersiveContent('3d', {
                modelUri: content.modelUri,
                context: contentContext
              });
              // Render 3D model
            }}
          />
        );
      
      case 'ar':
        return (
          <Camera
            ref={cameraRef}
            style={{ width: '100%', height: 200 }}
            type={Camera.Constants.Type.back}
          >
            {/* AR content overlay */}
          </Camera>
        );
      
      case 'hologram':
        return (
          <View style={{ width: '100%', height: 200, backgroundColor: 'black' }}>
            {/* Holographic effect implementation */}
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderBiometricOverlay = () => {
    if (!enableBiometrics) return null;

    return (
      <View style={styles.biometricOverlay}>
        <Text style={[styles.biometricText, { color: theme.colors.textSecondary }]}>
          Attention: {Math.round(biometricState.attentionLevel * 100)}%
        </Text>
        <Text style={[styles.biometricText, { color: theme.colors.textSecondary }]}>
          Emotion: {biometricState.emotionalState}
        </Text>
        <Text style={[styles.biometricText, { color: theme.colors.textSecondary }]}>
          Cognitive Load: {Math.round(biometricState.cognitiveLoad * 100)}%
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        height: animatedHeight,
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      }
    ]}>
      {enableBiometrics && (
        <Camera
          ref={cameraRef}
          style={styles.biometricCamera}
          type={Camera.Constants.Type.front}
          onFacesDetected={({ faces }) => {
            if (faces.length > 0) {
              const face = faces[0];
              setBiometricState({
                attentionLevel: calculateAttention(face),
                emotionalState: detectEmotion(face),
                cognitiveLoad: estimateCognitiveLoad(face)
              });
            }
          }}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            minDetectionInterval: 100,
            tracking: true,
          }}
        />
      )}
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.aiIndicator, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>AI Tutor</Text>
        </View>
        <View style={styles.headerRight}>
          {onToggleMinimize && (
            <TouchableOpacity onPress={onToggleMinimize} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>{minimized ? '▲' : '▼'}</Text>
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {renderBiometricOverlay()}

      {!minimized && (
        <>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            showsVerticalScrollIndicator={false}
          />

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.typingContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
                <View style={[styles.typingDot, { backgroundColor: theme.colors.textTertiary }]} />
              </View>
              <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                AI is thinking...
              </Text>
            </View>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                horizontal
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={renderSuggestion}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContent}
              />
            </View>
          )}

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}
          >
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask me anything..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(inputText)}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border,
                }
              ]}
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  biometricCamera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0,
  },
  biometricOverlay: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  biometricText: {
    fontSize: 12,
    marginBottom: 4,
  },
  immersiveContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  disabledContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  disabledText: {
    textAlign: 'center',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 4,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#666',
  },
  messagesList: {
    flex: 1,
    maxHeight: 200,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  typingDots: {
    flexDirection: 'row',
    marginRight: 8,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  suggestionsContent: {
    padding: 12,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
    fontSize: 14,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
