import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import type { LocationObjectCoords } from 'expo-location';
import type { Group, MockUser } from '../types/models';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (newGroup: Group) => void;
  currentUser: MockUser;
  location: LocationObjectCoords | null;
  existingGroupCount: number;
};

export default function CreateGroupModal({
  visible,
  onClose,
  onCreate,
  currentUser,
  location,
  existingGroupCount,
}: Props) {
  const [title, setTitle] = useState('');
  const [limit, setLimit] = useState('3');
  const [duration, setDuration] = useState('20');

  const handleCreate = () => {
    if (!title || isNaN(parseInt(limit)) || isNaN(parseInt(duration))) {
      alert('Please fill in all fields with valid numbers.');
      return;
    }

    const minutes = parseInt(duration);
    const timeoutDate = new Date(Date.now() + minutes * 60 * 1000);

    const newGroup: Group = {
      id: `g${existingGroupCount + 1}`,
      title,
      hostUserId: currentUser.id,
      participantIds: [currentUser.id],
      limit: parseInt(limit),
      timeout: timeoutDate,
      meetingPoint: {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
      },
    };

    currentUser.activeActivityId = newGroup.id;
    currentUser.joinedGroupId = newGroup.id;
    onCreate(newGroup);

    setTitle('');
    setLimit('3');
    setDuration('20');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Create Activity</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Study at Aldrich"
            placeholderTextColor="#A0A4B8"
          />

          <Text style={styles.label}>Participant Limit</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
            placeholder="e.g., 4"
            placeholderTextColor="#A0A4B8"
          />

          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g., 20"
            placeholderTextColor="#A0A4B8"
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
              <Text style={styles.createButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 59, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 26,
    borderRadius: 20,
    width: '88%',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 18,
    alignSelf: 'center',
    letterSpacing: 0.5,
  },
  label: {
    fontWeight: '600',
    color: '#FF9500', // orange label
    fontSize: 15,
    marginTop: 10,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#FF9500', // orange border
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#F2F6FC',
    marginBottom: 2,
    color: '#22223B',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff', // white background
    borderWidth: 2,
    borderColor: '#FF9500', // orange border
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FF9500', // orange text
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#FF9500',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
