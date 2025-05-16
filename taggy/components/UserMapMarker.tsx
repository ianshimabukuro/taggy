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
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 2,
          borderColor: '#FF9500', // orange
          backgroundColor: '#E0E1DD'
        }}
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
    backgroundColor: '#F2F6FC',
    borderRadius: 14,
    padding: 14,
    minWidth: 200,
    maxWidth: 300,
    alignItems: 'flex-start',
    shadowColor: '#22223B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
    color: '#22223B',
    letterSpacing: 0.2,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
    color: '#007AFF',
    marginBottom: 2,
  },
  groupDetails: {
    fontSize: 13,
    marginTop: 2,
    color: '#4A4E69',
    fontWeight: '500',
  },
  notHosting: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 6,
    color: '#A0A4B8',
  },
});