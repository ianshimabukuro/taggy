import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';
import type { MockUser } from '../types/models';

type Props = {
  user: MockUser;
  onPress: () => void;
};

export default function UserMarker({ user, onPress }: Props) {
  return (
    <Marker
      coordinate={user.location}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        <Text style={styles.emoji}>
          {user.activeActivityId ? '🧲' : '🧿'}
        </Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emoji: {
    fontSize: 26,
  },
});
