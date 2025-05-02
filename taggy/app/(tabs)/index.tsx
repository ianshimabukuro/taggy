import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Modal, Button, Text,TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { mockUsers } from '../../constants/mockUsers';
import { mockGroups } from '../../constants/mockGroups';
import { currentUser } from '../../constants/currentUser';
import type { LocationObjectCoords } from 'expo-location';

type MockUser = {
  id: string;
  name: string;
  age: number;
  nationality: string;
  major: string;
  hobbies: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  activeActivityId: string | null;
  joinedGroupId: string | null;
  radius: number;
};

export default function ExploreScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [joinedGroupId, setJoinedGroupId] = useState(currentUser.joinedGroupId);
  const [groups, setGroups] = useState(mockGroups);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupLimit, setNewGroupLimit] = useState('3');

  // Determine if user is in a group
  const currentGroup = mockGroups.find((g) => g.id === joinedGroupId);

  useEffect(() => {
    setLocation({
      latitude: 33.64637343340951,
      longitude: -117.84285188835815,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    });
  }, []);

  // 🔁 If user is in a group, show group screen instead of map
  if (currentGroup) {
    const host = mockUsers.find((u) => u.id === currentGroup.hostUserId);
    const participants = currentGroup.participantIds
      .map((id) => mockUsers.find((u) => u.id === id))
      .filter((u) => u !== undefined) as MockUser[];
  
    const isHost = host?.id === currentUser.id;
  
    return (
      <View style={styles.groupContainer}>
        <Text style={styles.groupTitle}>{currentGroup.title}</Text>
        <Text>Host: {host?.name}</Text>
  
        {isHost && (
          <Text style={styles.hostBadge}>You're hosting this activity</Text>
        )}
  
        <Text style={{ marginTop: 10 }}>Participants:</Text>
        {participants.map((u) => (
          <Text key={u.id}>• {u.name} ({u.major})</Text>
        ))}
  
        <View style={{ marginTop: 20 }}>
          {isHost ? (
            <Button
              title="End Activity"
              onPress={() => {
                currentUser.activeActivityId = null;
                currentUser.joinedGroupId = null;
                setJoinedGroupId(null);
                setGroups(groups.filter((g) => g.id !== currentGroup.id)); // remove group if ended
              }}
            />
          ) : (
            <Button
              title="Leave Group"
              onPress={() => {
                currentUser.joinedGroupId = null;
                setJoinedGroupId(null);
                // You could also update participant list in `groups` if needed
              }}
            />
          )}
        </View>
      </View>
    );
  }
  

  // 🗺️ Otherwise, show map + markers
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        region={{
          latitude: location?.latitude || 33.641,
          longitude: location?.longitude || -117.918,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
        {location && (
          <Circle
            center={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            radius={20}
            strokeColor="rgba(0, 122, 255, 0.6)"
            fillColor="rgba(0, 122, 255, 0.3)"
          />
        )}

        {mockUsers.map((user: MockUser) => (
          <Marker
            key={user.id}
            coordinate={user.location}
            title={user.name}
            description={user.major}
            pinColor={user.activeActivityId ? 'green' : 'blue'}
            onPress={() => setSelectedUser(user)}
          />
        ))}
      </MapView>
      {currentUser.activeActivityId && (() => {
        const hostedGroup = groups.find(g => g.id === currentUser.activeActivityId);
        if (!hostedGroup || hostedGroup.hostUserId !== currentUser.id) return null;

        return (
            <View style={styles.activityBadge}>
            <Text style={styles.activityTitle}>{hostedGroup.title}</Text>
            <TouchableOpacity
                style={styles.activityClose}
                onPress={() => {
                currentUser.activeActivityId = null;
                currentUser.joinedGroupId = null;
                setGroups(groups.filter((g) => g.id !== hostedGroup.id));
                setJoinedGroupId(null);
                }}
            >
                <Text style={styles.activityCloseText}>✖</Text>
            </TouchableOpacity>
            </View>
        );
        })()}

      {!currentUser.activeActivityId && (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => {
            setShowCreateModal(true);
            }}
        >
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCreateModal}
        onRequestClose={() => setShowCreateModal(false)}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Activity</Text>

            <Text>Title:</Text>
            <TextInput
                style={styles.input}
                value={newGroupTitle}
                onChangeText={setNewGroupTitle}
                placeholder="e.g., Study at Aldrich"
            />

            <Text style={{ marginTop: 10 }}>Participant Limit:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={newGroupLimit}
                onChangeText={setNewGroupLimit}
                placeholder="e.g., 4"
            />

            <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
                <Button title="Cancel" onPress={() => setShowCreateModal(false)} />
                <Button
                title="Start"
                onPress={() => {
                    const newGroupId = `g${groups.length + 1}`;
                    const newGroup = {
                    id: newGroupId,
                    title: newGroupTitle,
                    hostUserId: currentUser.id,
                    participantIds: [currentUser.id],
                    limit: parseInt(newGroupLimit),
                    timeout: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
                    meetingPoint: {
                        latitude: location?.latitude ?? 0,
                        longitude: location?.longitude ?? 0,
                    },
                    };
                    (currentUser as any).activeActivityId = newGroupId;
                    (currentUser as any).joinedGroupId = newGroupId;
                    setGroups([...groups, newGroup]);
                    setJoinedGroupId(newGroupId);
                    setShowCreateModal(false);
                }}
                />
            </View>
            </View>
        </View>
        </Modal>
      </View>

      {selectedUser && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => setSelectedUser(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedUser.name}</Text>
              <Text>Major: {selectedUser.major}</Text>
              <Text>Nationality: {selectedUser.nationality}</Text>
              <Text>Hobbies: {selectedUser.hobbies.join(', ')}</Text>
              <View style={{ marginTop: 16 }}>
                <Button title="Close" onPress={() => setSelectedUser(null)} />
                {selectedUser.activeActivityId && selectedUser.id !== currentUser.id && (
                  <View style={{ marginTop: 10 }}>
                    <Button
                      title="Join Activity"
                      onPress={() => {
                        if (joinedGroupId || currentUser.activeActivityId) {
                            alert("You're already in a group!");
                            return;
                        }

                        const groupId = selectedUser.activeActivityId!;
                        setJoinedGroupId(groupId); // trigger re-render
                        console.log(`Joined activity ${groupId}`);
                        alert(`Joined activity: ${groupId}`);
                        setSelectedUser(null);
                        }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
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
  groupContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    justifyContent: 'center',
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    width: '100%',
    marginTop: 4,
  },
  activityBadge: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  activityClose: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityCloseText: {
    fontSize: 16,
    color: '#333',
  }
  
  
});
