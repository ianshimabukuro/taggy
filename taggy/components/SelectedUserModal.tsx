import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';
import type { MockUser } from '../types/models';

type Props = {
  user: MockUser;
  currentUser: MockUser;
  visible: boolean;
  onClose: () => void;
  onJoin: (groupId: string) => void;
};

export default function SelectedUserModal({
  user,
  currentUser,
  visible,
  onClose,
  onJoin,
}: Props) {
  const canJoin =
    user.activeActivityId &&
    user.id !== currentUser.id &&
    !currentUser.joinedGroupId &&
    !currentUser.activeActivityId;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{user.name}</Text>
          <Text>Major: {user.major}</Text>
          <Text>Nationality: {user.nationality}</Text>
          <Text>Hobbies: {user.hobbies.join(', ')}</Text>

          <View style={{ marginTop: 16 }}>
            <Button title="Close" onPress={onClose} />

            {canJoin && (
              <View style={{ marginTop: 10 }}>
                <Button title="Join Activity" onPress={() => onJoin(user.activeActivityId!)} />
              </View>
            )}
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
});
