import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Group, MockUser } from '../types/models';

type Props = {
  group: Group;
  currentUser: MockUser;
  users: MockUser[];
  onLeave: () => Promise<void>;
  onEnd: (groupId: string) => Promise<void>;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function GroupView({ group, currentUser, users, onLeave, onEnd }: Props) {
  const host = users.find((u) => u.id === group.hostUserId);
  const participants = group.participantIds
    .map((id) => users.find((u) => u.id === id))
    .filter((u): u is MockUser => u !== undefined);

  const isHost = host?.id === currentUser.id;

  // State to track remaining time
  const [remainingTime, setRemainingTime] = useState<number>(
    Math.max(0, Math.floor((group.timeout.toDate().getTime() - Date.now()) / 1000))
  );

  // Update the remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((group.timeout.toDate().getTime() - Date.now()) / 1000));
      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [group.timeout]);

  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {isHost && (
            <TouchableOpacity onPress={() => onEnd(group.id)} style={styles.endActivityButton}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Host */}
        <View style={styles.hostRow}>
          <View style={styles.avatarHost}>
            <Text style={styles.avatarText}>{host ? getInitials(host.name) : '?'}</Text>
          </View>
          <View>
            <Text style={styles.label}>Host</Text>
            <Text style={styles.value}>{host?.name}</Text>
            {isHost && <Text style={styles.hostBadge}>You're hosting this activity</Text>}
          </View>
        </View>

        {/* Participants */}
        <Text style={[styles.label, { marginTop: 18 }]}>
          Participants <Text style={styles.participantCount}>({participants.length}/{group.limit})</Text>
        </Text>
        <View style={styles.participantList}>
          {participants
            .filter((u) => u.id !== host?.id)
            .map((u) => (
              <View key={u.id} style={styles.participantRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(u.name)}</Text>
                </View>
                <View>
                  <Text style={styles.participantName}>{u.name}</Text>
                  <Text style={styles.participantMajor}>{u.major}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Meeting Point */}
        <View style={styles.meetingPointRow}>
          <Ionicons name="location-sharp" size={18} color="#007AFF" style={{ marginRight: 6 }} />
          <Text style={styles.label}>Meeting point:</Text>
          <Text style={styles.value}>
            {" "}
            {group.meetingPoint.latitude.toFixed(5)}, {group.meetingPoint.longitude.toFixed(5)}
          </Text>
        </View>

        {/* Countdown Timer */}
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
        </View>

        {/* Leave Button for Non-Hosts */}
        {!isHost && (
          <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
            <Ionicons name="exit-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.leaveButtonText}>Leave Group</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F2F6FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF9500', // orange border
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  groupTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF9500', // orange title
    flexShrink: 1,
  },
  endActivityButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarHost: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#FF9500', // orange border for host avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff', // changed from #A0C4FF to white
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#FF9500', // orange border for participant avatars
  },
  avatarText: {
    color: '#FF9500', // orange initials
    fontWeight: 'bold',
    fontSize: 18,
  },
  label: {
    fontWeight: '600',
    color: '#22223B',
    fontSize: 15,
  },
  value: {
    fontWeight: '400',
    color: '#4A4E69',
    fontSize: 15,
  },
  hostBadge: {
    color: '#007AFF',
    marginTop: 2,
    fontStyle: 'italic',
    fontSize: 13,
  },
  participantCount: {
    color: '#FF9500', // orange participant count
    fontWeight: 'bold',
  },
  participantList: {
    marginTop: 6,
    marginBottom: 10,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 4,
  },
  participantName: {
    fontSize: 15,
    color: '#22223B',
    fontWeight: '500',
  },
  participantMajor: {
    fontSize: 13,
    color: '#4A4E69',
    fontStyle: 'italic',
  },
  meetingPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 18,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FF9500', // orange timer background
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginBottom: 18,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  timerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  leaveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});
