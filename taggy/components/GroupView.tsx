import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For the "X" icon
import { doc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Group, MockUser } from '../types/models';

type Props = {
  group: Group;
  currentUser: MockUser;
  users: MockUser[];
  onLeave: () => Promise<void>;
  onEnd: (groupId: string) => Promise<void>;
};

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

  // State for checked-out participants
  const [checkedOut, setCheckedOut] = useState<Record<string, boolean>>(group.checkedOut || {});
  const [inputCode, setInputCode] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  // Real-time listener for checkedOut updates
  useEffect(() => {
    const groupRef = doc(db, 'groups', group.id);
    const unsubscribe = onSnapshot(groupRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data?.checkedOut) {
        setCheckedOut(data.checkedOut);

        // Check if all participants (excluding the host) are checked out
        const allCheckedOut = participants
          .filter((p) => p.id !== host?.id) // Exclude the host
          .every((p) => data.checkedOut[p.id]);

        if (allCheckedOut) {
          try {
            // Delete the group
            await deleteDoc(groupRef);
            console.log(`✅ Group ${group.id} deleted because all participants checked out.`);

            // Clear the host's group references
            if (host) {
              const hostRef = doc(db, 'users', host.id);
              await updateDoc(hostRef, {
                activeActivityId: null,
                joinedGroupId: null,
              });
              console.log(`✅ Cleared group references for host ${host.id}`);
            }
          } catch (err) {
            console.error('❌ Error deleting group or clearing host references:', err);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [group.id, participants, host?.id]);

  // Validate and mark participant as checked out
  const handleCheckOut = async () => {
    if (!selectedParticipant || !inputCode.trim()) return;

    const participantId = selectedParticipant;
    const expectedCode = participantId.slice(0, 4);

    if (inputCode === expectedCode) {
      const groupRef = doc(db, 'groups', group.id);
      await updateDoc(groupRef, {
        [`checkedOut.${participantId}`]: true,
      });

      setInputCode(''); // Clear the input field
      setSelectedParticipant(null); // Clear the selected participant
    } else {
      alert('Invalid code. Please try again.');
    }
  };

  // Update the remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((group.timeout.toDate().getTime() - Date.now()) / 1000));
      setRemainingTime(timeLeft);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [group.timeout]);

  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.groupContainer}>
      {/* Title and "End Activity" Icon */}
      <View style={styles.header}>
        <Text style={styles.groupTitle}>{group.title}</Text>
        {isHost && (
          <TouchableOpacity onPress={() => onEnd(group.id)} style={styles.endActivityButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Host and Participants */}
      <Text style={styles.label}>Host: <Text style={styles.value}>{host?.name}</Text></Text>
      {isHost && <Text style={styles.hostBadge}>You're hosting this activity</Text>}

      <Text style={styles.label}>Participants ({participants.length}/{group.limit}):</Text>
      {participants.map((u) => {
        if (u.id === host?.id) return null; // Skip the host
        return (
          <Text key={u.id} style={styles.participant}>
            • {u.name} ({u.major}) - {checkedOut[u.id] ? 'Checked Out' : 'Not Checked Out'}
          </Text>
        );
      })}

      {/* Meeting Point */}
      <Text style={styles.label}>
        Meeting point:{" "}
        <Text style={styles.value}>
          {group.meetingPoint.latitude.toFixed(5)}, {group.meetingPoint.longitude.toFixed(5)}
        </Text>
      </Text>

      {/* Centralized Countdown Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
      </View>

      {/* Check Out Participants */}
      {isHost && (
        <View style={styles.checkOutContainer}>
          <Text style={styles.label}>Check Out Participants:</Text>
          <FlatList
            data={participants.filter((p) => p.id !== host?.id && !checkedOut[p.id])} // Exclude host
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Button
                title={`Select ${item.name}`}
                onPress={() => setSelectedParticipant(item.id)}
              />
            )}
          />
          {selectedParticipant && (
            <View style={styles.inputContainer}>
              <Text>Enter Code for {selectedParticipant}:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter code"
                value={inputCode}
                onChangeText={setInputCode}
              />
              <Button title="Check Out" onPress={handleCheckOut} />
            </View>
          )}
        </View>
      )}

      {/* Leave Button for Non-Hosts */}
      {!isHost && (
        <View style={styles.leaveButtonContainer}>
          <Button title="Leave Group" onPress={onLeave} color="#FF3B30" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  endActivityButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -100 }], // Center horizontally
    width: 200,
    height: 80,
    backgroundColor: '#007AFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  leaveButtonContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  checkOutContainer: {
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
