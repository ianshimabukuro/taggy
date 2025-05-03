import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Group } from '../types/models';

type Props = {
  group: Group;
  onClose: () => void;
  onDetails: () => void;
};

// ⏳ Helper to get minutes left
function getMinutesLeft(timeout: Date): number {
  const now = new Date();
  const msLeft = new Date(timeout).getTime() - now.getTime();
  return Math.max(0, Math.floor(msLeft / 60000));
}

export default function ActiveActivityBadge({ group, onClose, onDetails }: Props) {
  const minutesLeft = getMinutesLeft(group.timeout);
  const userCount = group.participantIds.length;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{group.title}</Text>
        <Text style={styles.info}>
          {userCount}/{group.limit} • {minutesLeft} min left
        </Text>
      </View>

      <TouchableOpacity style={styles.detailsButton} onPress={onDetails}>
        <Text style={styles.detailsText}>Details</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✖</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 40,
      left: 20,
      right: 20,
      backgroundColor: 'white',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    infoContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    info: {
      fontSize: 12,
      color: '#555',
      marginTop: 2,
    },
    detailsButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    },
    detailsText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    closeButton: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: '#eee',
      borderRadius: 6,
    },
    closeText: {
      fontSize: 16,
      color: '#333',
    },
  });
  