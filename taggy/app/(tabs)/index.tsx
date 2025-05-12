import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Button } from 'react-native';
import MapView, { Circle,Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { doc, setDoc, updateDoc, onSnapshot, deleteDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import type { LocationObjectCoords } from 'expo-location';
import type { Group, MockUser } from '../../types/models';
import { startLocationTracking, stopLocationTracking } from '@/utils/locationTracker';
import { ref, onValue } from 'firebase/database'; // 👈 Realtime DB import
import { realtimeDb } from '@/config/firebase'; // 👈 Ensure this is exported from your Firebase config
import { arrayUnion } from "firebase/firestore";


// 🧩 Imported components
import GroupView from '../../components/GroupView';
import UserMarker from '../../components/UserMarker';
import SelectedUserModal from '../../components/SelectedUserModal';
import ActiveActivityBadge from '../../components/ActiveActivityBadge';
import CreateGroupModal from '../../components/CreateGroupModal';

export default function ExploreScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<MockUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [liveLocations, setLiveLocations] = useState<{ [uid: string]: { latitude: number; longitude: number } }>({});

  const joinedGroupId = currentUser?.joinedGroupId ?? null;
  const currentGroup = groups.find((g) => g.id === joinedGroupId);
  //Get curretn user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }
  
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
    })();
  }, []);
  //Get other users locatin through realtime db
  useEffect(() => {
    const locationsRef = ref(realtimeDb, 'locations');
  
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setLiveLocations(data);
    });
  
    return () => unsubscribe();
  }, []);

  // 📍 Upload your location to the Real time DB
  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, []);
  // 👤 Subscribe to current user doc
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        setCurrentUser({ id: snap.id, ...snap.data() } as MockUser);
      }
    });

    return unsub;
  }, []);

  // 👥 Get all users
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const userList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MockUser));
      setUsers(userList);
    });
    return unsub;
  }, []);

  // 🧑‍🤝‍🧑 Get all groups
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const groupList = snap.docs.map(doc => {
        console.log("📦 Group update:", doc.id, doc.data());
        return { id: doc.id, ...doc.data() } as Group;
      });
      setGroups(groupList);
    });
    return unsub;
  }, []);

  // ➕ Create a group
  const handleCreateGroup = async (newGroup: Group) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("User not logged in");

      const groupRef = doc(db, 'groups', newGroup.id);
      const groupData = {
        ...newGroup,
        hostUserId: uid,
        participantIds: [uid],
      };

      await setDoc(groupRef, groupData);

      await updateDoc(doc(db, 'users', uid), {
        activeActivityId: newGroup.id,
        joinedGroupId: newGroup.id,
      });

      setShowCreateModal(false);
      console.log('✅ Group created and user updated');
    } catch (err) {
      console.error('❌ Error creating group:', err);
      alert('Failed to create group');
    }
  };

  // 🎭 If user is in a group, show group view
  if (currentUser && currentGroup) {
    return (
      <GroupView
        group={currentGroup}
        currentUser={currentUser}
        users={users}
        onLeave={async () => {
          await updateDoc(doc(db, 'users', currentUser.id), {
            joinedGroupId: null,
          });
        }}
        onEnd={async (groupId) => {
          await updateDoc(doc(db, 'users', currentUser.id), {
            activeActivityId: null,
            joinedGroupId: null,
          });
          await deleteDoc(doc(db, 'groups', groupId));
        }}
        onCloseView={() => {
          // UI only, no Firestore update
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
    {location ? (
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >

  {users
    .filter((user) => user.id !== currentUser?.id)
    .map((user) => {
      const userLoc = liveLocations[user.id];
      if (!userLoc) return null;

      const group = groups.find(g => g.id === user.activeActivityId);

      return (
        <Marker
          key={user.id}
          coordinate={{
            latitude: userLoc.latitude,
            longitude: userLoc.longitude,
          }}
        >
          <Callout onPress={() => setSelectedUser(user)}>
            <View style={{ maxWidth: 220 }}>
              <Text style={{ fontWeight: 'bold' }}>{user.name}</Text>

              {group ? (
                <>
                  <Text style={{ marginTop: 4 }}>🎯 {group.title}</Text>
                  <Text>👥 {group.participantIds.length}/{group.limit} joined</Text>
                  <Text>
                    🕒 Timeout: {new Date(group.timeout).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>

                  {currentUser &&
                    !currentUser.joinedGroupId &&
                    !currentUser.activeActivityId &&
                    !group.participantIds.includes(currentUser.id) && (
                    <Button
                      title="Join"
                      onPress={async () => {
                        try {
                          const groupRef = doc(db, 'groups', group.id);

                          // 1. Add user to group participants
                          try {
                            const groupRef = doc(db, 'groups', group.id);
                            await updateDoc(groupRef, {
                              participantIds: arrayUnion(currentUser.id),
                            });
                            console.log('✅ Added to participantIds');
                          } catch (err) {
                            console.error('❌ Failed to add to participantIds:', err);
                          }
                            
                          // 2. Update current user to reflect joined group
                          await updateDoc(doc(db, 'users', currentUser.id), {
                            joinedGroupId: group.id,
                          });

                          alert(`✅ Joined group: ${group.title}`);
                        } catch (err) {
                          console.error('❌ Join error:', err);
                          alert('Failed to join group');
                        }
                      }}
                    />

                  )}
                </>
              ) : (
                <Text style={{ marginTop: 4, fontStyle: 'italic' }}>Not hosting</Text>
              )}
            </View>
          </Callout>
        </Marker>
      );
    })}
      </MapView>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Getting location...</Text>
      </View>
    )}


      {/* 🏷️ Active Activity Badge */}
      {currentUser?.activeActivityId && (() => {
        const hostedGroup = groups.find(g => g.id === currentUser.activeActivityId);
        if (!hostedGroup || hostedGroup.hostUserId !== currentUser.id) return null;

        return (
          <ActiveActivityBadge
            group={hostedGroup}
            onClose={async () => {
              await updateDoc(doc(db, 'users', currentUser.id), {
                activeActivityId: null,
                joinedGroupId: null,
              });
              await deleteDoc(doc(db, 'groups', hostedGroup.id));
            }}
            onDetails={() => {
              setJoinedGroupId(hostedGroup.id);
            }}
          />
        );
      })()}

      {/* ➕ FAB */}
      {!currentUser?.activeActivityId && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* 🎉 Create Group Modal */}
      <CreateGroupModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUser={currentUser}
        location={location}
        existingGroupCount={groups.length}
        onCreate={handleCreateGroup}
      />

      {/* 👤 Selected User Modal */}
      {selectedUser && (
        <SelectedUserModal
          user={selectedUser}
          currentUser={currentUser}
          visible={true}
          onClose={() => setSelectedUser(null)}
          onJoin={async (groupId) => {
            if (!currentUser) return;
            if (currentUser.joinedGroupId || currentUser.activeActivityId) {
              alert("You're already in a group!");
              return;
            }

            await updateDoc(doc(db, 'users', currentUser.id), {
              joinedGroupId: groupId,
            });

            setSelectedUser(null);
          }}
        />
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
});
