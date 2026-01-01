/**
 * Lesson Notes Page
 * Features: Create, edit, delete notes with timestamps
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_NOTES = [
  { id: 1, text: 'Remember to use useEffect for side effects', timestamp: '05:23', date: '2 days ago' },
  { id: 2, text: 'Important: Always clean up event listeners in return function', timestamp: '12:45', date: '2 days ago' },
  { id: 3, text: 'useState returns array with current state and setter function', timestamp: '18:10', date: '2 days ago' },
];

export default function NotesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingNote, setEditingNote] = useState<number | null>(null);

  const handleAddNote = () => {
    if (newNoteText.trim()) {
      setNotes([{ id: Date.now(), text: newNoteText, timestamp: '00:00', date: 'Just now' }, ...notes]);
      setNewNoteText('');
      setShowAddNote(false);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity onPress={() => setShowAddNote(true)}>
          <Ionicons name="add-circle" size={28} color="#6366F1" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Notes Yet</Text>
            <Text style={styles.emptyText}>Add your first note while watching the lesson</Text>
          </View>
        ) : (
          <View style={styles.notesList}>
            {notes.map((note, index) => (
              <Animated.View key={note.id} entering={FadeInDown.delay(index * 100)} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.timestampBadge}>
                    <Ionicons name="time-outline" size={14} color="#6366F1" />
                    <Text style={styles.timestampText}>{note.timestamp}</Text>
                  </View>
                  <Text style={styles.dateText}>{note.date}</Text>
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
                <View style={styles.noteActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create-outline" size={18} color="#6B7280" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteNote(note.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-social-outline" size={18} color="#6B7280" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Add Note Modal */}
      <Modal visible={showAddNote} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Note</Text>
              <TouchableOpacity onPress={() => setShowAddNote(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.noteInput}
              placeholder="Write your note here..."
              placeholderTextColor="#9CA3AF"
              value={newNoteText}
              onChangeText={setNewNoteText}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddNote(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddNote}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveGradient}
                >
                  <Text style={styles.saveButtonText}>Save Note</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  content: { flex: 1 },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginTop: 16 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 },
  notesList: { padding: 20, gap: 16 },
  noteCard: { padding: 16, backgroundColor: '#fff', borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#6366F1' },
  noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  timestampBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EEF2FF', borderRadius: 6 },
  timestampText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  noteText: { fontSize: 15, color: '#1F2937', lineHeight: 22, marginBottom: 12 },
  noteActions: { flexDirection: 'row', gap: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  bottomSpacing: { height: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1F2937' },
  noteInput: { height: 120, padding: 16, backgroundColor: '#F9FAFB', borderRadius: 12, fontSize: 15, color: '#1F2937', textAlignVertical: 'top', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, paddingVertical: 14, backgroundColor: '#F3F4F6', borderRadius: 12, alignItems: 'center' },
  cancelButtonText: { fontSize: 15, fontWeight: '700', color: '#6B7280' },
  saveButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  saveGradient: { paddingVertical: 14, alignItems: 'center' },
  saveButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
