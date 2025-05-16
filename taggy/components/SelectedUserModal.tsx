import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
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
          <Text style={styles.infoText}>Major: <Text style={styles.infoValue}>{user.major}</Text></Text>
          <Text style={styles.infoText}>Nationality: <Text style={styles.infoValue}>{user.nationality}</Text></Text>
          <Text style={styles.infoText}>Hobbies:</Text>
          <View style={styles.badgeContainer}>
            {user.hobbies.map((hobby, idx) => (
              <View key={idx} style={styles.badge}>
                <Text style={styles.badgeText}>{hobby}</Text>
              </View>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {canJoin && (
              <TouchableOpacity style={styles.joinButton} onPress={() => onJoin(user.activeActivityId!)}>
                <Text style={styles.joinButtonText}>Join Activity</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(34,34,59,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 28,
    paddingHorizontal: 26,
    borderRadius: 20,
    width: '88%',
    shadowColor: '#22223B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22223B',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 16,
    color: '#4A4E69',
    marginBottom: 2,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  infoValue: {
    color: '#2563EB',
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#34D399',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 16,
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#E0E1DD',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  closeButtonText: {
    color: '#22223B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
