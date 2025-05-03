import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { Group, MockUser } from '../types/models';

type Props = {
  group: Group;
  currentUser: MockUser;
  users: MockUser[];
  onLeave: () => void;
  onEnd: (groupId: string) => void;
  onCloseView: () => void; // 🆕
};

export default function GroupView({ group, currentUser, users, onLeave, onEnd, onCloseView }: Props) {
  const host = users.find((u) => u.id === group.hostUserId);
  const participants = group.participantIds
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is MockUser => u !== undefined);

  const isHost = host?.id === currentUser.id;

  const timeLeftMinutes = Math.max(
    0,
    Math.floor((new Date(group.timeout).getTime() - Date.now()) / 60000)
  );

  return (
    <View style={styles.groupContainer}>
      <Text style={styles.groupTitle}>{group.title}</Text>
      <Text style={styles.label}>Host: <Text style={styles.value}>{host?.name}</Text></Text>

      {isHost && <Text style={styles.hostBadge}>You're hosting this activity</Text>}

      <Text style={styles.label}>Participants ({participants.length}/{group.limit}):</Text>
      {participants.map((u) => (
        <Text key={u.id} style={styles.participant}>• {u.name} ({u.major})</Text>
      ))}

      <Text style={styles.label}>Time left: <Text style={styles.value}>{timeLeftMinutes} minutes</Text></Text>

      <Text style={styles.label}>
        Meeting point:{" "}
        <Text style={styles.value}>
          {group.meetingPoint.latitude.toFixed(5)}, {group.meetingPoint.longitude.toFixed(5)}
        </Text>
      </Text>

      <View style={styles.buttonGroup}>
        {isHost ? (
          <Button title="End Activity" onPress={() => onEnd(group.id)} />
        ) : (
          <Button title="Leave Group" onPress={onLeave} />
        )}
        <View style={{ marginTop: 10 }}>
          <Button title="Close View" onPress={onCloseView} color="#999" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontWeight: 'normal',
  },
  hostBadge: {
    color: '#007AFF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  participant: {
    marginLeft: 10,
    marginTop: 2,
  },
  buttonGroup: {
    marginTop: 20,
  },
});
