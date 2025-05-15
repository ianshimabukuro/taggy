import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Button, Image } from 'react-native';
import MapView, { Circle, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { doc, setDoc, updateDoc, onSnapshot, deleteDoc, collection, setLogLevel, arrayRemove, Timestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import type { LocationObjectCoords } from 'expo-location';
import type { Group, MockUser } from '../../types/models';
import { startLocationTracking, stopLocationTracking } from '@/utils/locationTracker';
import { ref, onValue } from 'firebase/database'; // 👈 Realtime DB import
import { realtimeDb } from '@/config/firebase'; // 👈 Ensure this is exported from your Firebase config
import { arrayUnion } from "firebase/firestore";
import useCurrentUser from '@/hooks/useCurrentUser';
import useGroups from '@/hooks/useGroups';
import useGroupTimeouts from '@/hooks/useGroupTimeouts';
import useLiveLocations from '@/hooks/useLiveLocations';
import useUsers from '@/hooks/useUsers';
import useCurrentLocation from '@/hooks/useCurrentLocation';
import { calculateRemainingTime } from '@/utils/timeUtils';
import { leaveGroup,handleCreateGroup } from '@/utils/groupActions';

// 🧩 Imported components
import GroupView from '../../components/GroupView';
import UserMapMarker from '../../components/UserMapMarker';
import SelectedUserModal from '../../components/SelectedUserModal';
import CreateGroupModal from '../../components/CreateGroupModal';


export default function ExploreScreen() {
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { location, error } = useCurrentLocation();
  const groups = useGroups();
  const currentUser = useCurrentUser();
  const liveLocations = useLiveLocations();
  const users = useUsers();
  useGroupTimeouts(groups, currentUser);

  const joinedGroupId = currentUser?.joinedGroupId ?? null;
  const currentGroup = groups.find((g) => g.id === joinedGroupId);

  // 📍 Upload your location to the Real time DB
  useEffect(() => {
    startLocationTracking();
    return () => stopLocationTracking();
  }, []);


  // 🎭 If user is in a group, show group view
  if (currentUser && currentGroup) {
    return (
      <GroupView
        group={currentGroup}
        currentUser={currentUser}
        users={users}
        remainingTime={calculateRemainingTime(currentGroup.timeout)} // Pass remaining time
        onLeave={async () => {
          const result = await leaveGroup(currentUser, currentGroup);
          alert(result.message);
        }}
        onEnd={async (groupId) => {
          try {
            // Remove the group reference from all participants
            const groupRef = doc(db, 'groups', groupId);
            const groupSnapshot = await getDoc(groupRef); // Use getDoc to fetch the document
            const groupData = groupSnapshot.data();

            if (groupData?.participantIds) {
              const participantIds = groupData.participantIds;

              // Update each participant's document
              await Promise.all(
                participantIds.map(async (participantId) => {
                  await updateDoc(doc(db, 'users', participantId), {
                    activeActivityId: null,
                    joinedGroupId: null,
                  });
                })
              );
            }

            // Delete the group document
            await deleteDoc(groupRef);

            alert('✅ Group ended successfully.');
          } catch (err) {
            console.error('❌ Error ending group:', err);
            alert('Failed to end the group.');
          }
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
            <UserMapMarker
              key={user.id}
              user={user}
              location={userLoc}
              group={group}
              onSelect={setSelectedUser}
              calculateRemainingTime={calculateRemainingTime}
            />
          );
        })}
      </MapView>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Getting location...</Text>
      </View>
    )}


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
            try {
              if (!currentUser) return;
              if (currentUser.joinedGroupId || currentUser.activeActivityId) {
                alert("You're already in a group!");
                return;
              }

              const groupRef = doc(db, 'groups', groupId);
              await updateDoc(groupRef, {
                participantIds: arrayUnion(currentUser.id),
              });

              await updateDoc(doc(db, 'users', currentUser.id), {
                joinedGroupId: groupId,
              });

              alert(`✅ Joined group: ${groupId}`);
              setSelectedUser(null);
            } catch (err) {
              alert('Failed to join group');
            }
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
