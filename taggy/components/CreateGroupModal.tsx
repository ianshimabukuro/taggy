import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
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

    // Log both UTC and local times
    console.log('🕒 Timeout details:');
    console.log('- Current time (local):', new Date().toLocaleString());
    console.log('- Current time (UTC):', new Date().toISOString());
    console.log('- Timeout (local):', timeoutDate.toLocaleString());
    console.log('- Timeout (UTC):', timeoutDate.toISOString());

    const newGroup: Group = {
      id: `g${existingGroupCount + 1}`,
      title,
      hostUserId: currentUser.id,
      participantIds: [currentUser.id],
      limit: parseInt(limit),
      timeout: timeoutDate, // This is a future Date object
      meetingPoint: {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
      },
    };

    currentUser.activeActivityId = newGroup.id;
    currentUser.joinedGroupId = newGroup.id;
    onCreate(newGroup);

    // Clear form after creation
    setTitle('');
    setLimit('3');
    setDuration('20');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create Activity</Text>

          <Text>Title:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Study at Aldrich"
          />

          <Text style={{ marginTop: 10 }}>Participant Limit:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
            placeholder="e.g., 4"
          />

          <Text style={{ marginTop: 10 }}>Duration (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            placeholder="e.g., 20"
          />

          <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Start" onPress={handleCreate} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    width: '100%',
    marginTop: 4,
  },
});
