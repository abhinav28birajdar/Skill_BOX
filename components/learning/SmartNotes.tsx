import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  tags: string[];
  highlighted: boolean;
  lessonId?: string;
  courseId?: string;
}

interface SmartNotesProps {
  lessonId?: string;
  courseId?: string;
}

export function SmartNotes({ lessonId, courseId }: SmartNotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Key Concepts',
      content: 'Variables store data values. Use const for constants, let for variables.',
      timestamp: new Date(Date.now() - 3600000),
      tags: ['basics', 'variables'],
      highlighted: true,
      lessonId,
      courseId,
    },
    {
      id: '2',
      title: 'Important Point',
      content: 'Remember: Arrow functions have lexical this binding.',
      timestamp: new Date(Date.now() - 7200000),
      tags: ['functions', 'arrow-functions'],
      highlighted: false,
      lessonId,
      courseId,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
  });

  const colorSchemes = [
    { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-700', icon: '#F59E0B' },
    { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700', icon: '#3B82F6' },
    { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700', icon: '#10B981' },
    { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-700', icon: '#A855F7' },
  ];

  const saveNote = () => {
    if (!currentNote.title?.trim() || !currentNote.content?.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: currentNote.title,
      content: currentNote.content,
      timestamp: new Date(),
      tags: currentNote.tags || [],
      highlighted: false,
      lessonId,
      courseId,
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote({ title: '', content: '', tags: [] });
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setNotes(prev => prev.filter(note => note.id !== id)),
        },
      ]
    );
  };

  const toggleHighlight = (id: string) => {
    setNotes(prev =>
      prev.map(note => (note.id === id ? { ...note, highlighted: !note.highlighted } : note))
    );
  };

  const generateAISummary = () => {
    Alert.alert(
      'AI Summary',
      'The AI has analyzed your notes:\n\n' +
      '📌 Main Topics:\n' +
      '• JavaScript fundamentals\n' +
      '• Function types and usage\n\n' +
      '💡 Key Takeaways:\n' +
      '• Variables and data types\n' +
      '• Arrow function syntax\n\n' +
      '✨ Suggested Review:\n' +
      '• Practice arrow functions\n' +
      '• Review const vs let'
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            My Notes
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={generateAISummary}
              className="bg-purple-500 rounded-full p-2 mr-2"
            >
              <Ionicons name="sparkles" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className="bg-blue-500 rounded-full p-2"
            >
              <Ionicons name={isEditing ? 'close' : 'add'} size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center">
            <Ionicons name="document-text-outline" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {notes.length} notes
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="star-outline" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {notes.filter(n => n.highlighted).length} highlighted
            </Text>
          </View>
        </View>
      </View>

      {/* Note Editor */}
      {isEditing && (
        <View className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <TextInput
            value={currentNote.title}
            onChangeText={text => setCurrentNote({ ...currentNote, title: text })}
            placeholder="Note title..."
            placeholderTextColor="#9CA3AF"
            className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-semibold mb-3"
          />
          <TextInput
            value={currentNote.content}
            onChangeText={text => setCurrentNote({ ...currentNote, content: text })}
            placeholder="Write your notes here..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={6}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white mb-3"
            style={{ minHeight: 120 }}
          />
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={saveNote}
              className="flex-1 bg-blue-500 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Save Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCurrentNote({ title: '', content: '', tags: [] });
                setIsEditing(false);
              }}
              className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-3 items-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notes List */}
      <ScrollView className="flex-1 p-4">
        {notes.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              No notes yet{'\n'}Start taking notes to remember key concepts!
            </Text>
          </View>
        ) : (
          notes.map((note, index) => {
            const colorScheme = colorSchemes[index % colorSchemes.length];
            return (
              <View
                key={note.id}
                className={`mb-3 rounded-xl border-2 ${colorScheme.bg} ${colorScheme.border} p-4`}
              >
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                      {note.title}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {note.timestamp.toLocaleDateString()} at {note.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => toggleHighlight(note.id)}
                      className="ml-2"
                    >
                      <Ionicons
                        name={note.highlighted ? 'star' : 'star-outline'}
                        size={20}
                        color={note.highlighted ? '#F59E0B' : colorScheme.icon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteNote(note.id)}
                      className="ml-2"
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text className="text-gray-700 dark:text-gray-300 mb-3">
                  {note.content}
                </Text>

                {note.tags.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {note.tags.map((tag, tagIndex) => (
                      <View
                        key={tagIndex}
                        className="bg-white/50 dark:bg-gray-800/50 rounded-full px-3 py-1 mr-2 mb-2"
                      >
                        <Text className="text-xs text-gray-700 dark:text-gray-300">
                          #{tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Quick Actions Footer */}
      <View className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row justify-around">
          <TouchableOpacity className="items-center">
            <Ionicons name="search-outline" size={24} color="#6B7280" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">Search</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="pricetag-outline" size={24} color="#6B7280" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">Tags</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="download-outline" size={24} color="#6B7280" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">Export</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="share-outline" size={24} color="#6B7280" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
