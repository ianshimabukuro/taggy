import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import type { Group, MockUser } from '../types/models';

interface UserMapMarkerProps {
  user: MockUser;
  location: {
    latitude: number;
    longitude: number;
  };
  group?: Group;
  onSelect: (user: MockUser) => void;
  calculateRemainingTime: (timeout: any) => string;
}

export default function UserMapMarker({
  user,
  location,
  group,
  onSelect,
  calculateRemainingTime
}: UserMapMarkerProps) {
  return (
    <Marker
      key={user.id}
      coordinate={{
        latitude: location.latitude,
        longitude: location.longitude,
      }}
    >
      <Image
        source={
          user.profilePicture
            ? { uri: user.profilePicture }
            : require('../assets/default-icon.png')
        }
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />

      <Callout onPress={() => onSelect(user)}>
        <View style={styles.calloutContainer}>
          <Text style={styles.userName}>{user.name}</Text>

          {group ? (
            <>
              <Text style={styles.groupTitle}>🎯 {group.title}</Text>
              <Text style={styles.groupDetails}>
                👥 {group.participantIds.length}/{group.limit} joined
              </Text>
              <Text style={styles.groupDetails}>
                🕒 Timeout: {calculateRemainingTime(group.timeout)}
              </Text>
            </>
          ) : (
            <Text style={styles.notHosting}>Not hosting</Text>
          )}
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  calloutContainer: {
    backgroundColor: '#ffffff', // White background
    borderRadius: 8,
    padding: 10,
    minWidth: 200, // Minimum width for the callout
    maxWidth: 300, // Maximum width for the callout
    alignItems: 'flex-start', // Align text to the left
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#000', // Black text for contrast
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#000', // Black text for contrast
  },
  groupDetails: {
    fontSize: 12,
    marginTop: 2,
    color: '#000', // Black text for contrast
  },
  notHosting: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    color: '#555', // Subtle gray for "Not hosting"
  },
});