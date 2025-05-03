import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { mockUsers } from '../../constants/mockUsers';
import { mockGroups } from '../../constants/mockGroups';
import { currentUser } from '../../constants/currentUser';
import type { LocationObjectCoords } from 'expo-location';
import type { Group, MockUser } from '../../types/models';

// 🧩 Imported components
import GroupView from '../../components/GroupView';
import UserMarker from '../../components/UserMarker';
import SelectedUserModal from '../../components/SelectedUserModal';
import ActiveActivityBadge from '../../components/ActiveActivityBadge';
import CreateGroupModal from '../../components/CreateGroupModal';

export default function ExploreScreen() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [joinedGroupId, setJoinedGroupId] = useState(currentUser.joinedGroupId);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const currentGroup = groups.find((g) => g.id === joinedGroupId);

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

  // 🎭 If user is in a group, show GroupView
  if (currentGroup) {
    return (
      <GroupView
        group={currentGroup}
        currentUser={currentUser}
        users={[...mockUsers, currentUser]}
        onLeave={() => {
          currentUser.joinedGroupId = null;
          setJoinedGroupId(null);
        }}
        onEnd={(groupId) => {
          currentUser.activeActivityId = null;
          currentUser.joinedGroupId = null;
          setGroups(groups.filter((g) => g.id !== groupId)); // 🔧 remove group
          setJoinedGroupId(null);                            // 🔧 exit view
        }}
        onCloseView={() => {
          setJoinedGroupId(null); // 👈 just closes view but keeps group
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
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
            center={location}
            radius={20}
            strokeColor="rgba(0, 122, 255, 0.6)"
            fillColor="rgba(0, 122, 255, 0.3)"
          />
        )}

        {mockUsers.map((user) => (
          <UserMarker key={user.id} user={user} onPress={() => setSelectedUser(user)} />
        ))}
      </MapView>

      {/* 🏷️ Active Activity Badge */}
      {currentUser.activeActivityId && (() => {
        const hostedGroup = groups.find(g => g.id === currentUser.activeActivityId);
        if (!hostedGroup || hostedGroup.hostUserId !== currentUser.id) return null;

        return (
          <ActiveActivityBadge
            group={hostedGroup}
            onClose={() => {
              currentUser.activeActivityId = null;
              currentUser.joinedGroupId = null;
              setGroups(groups.filter((g) => g.id !== hostedGroup.id));
              setJoinedGroupId(null);
            }}
            onDetails={() => {
              setJoinedGroupId(hostedGroup.id); // this will render <GroupView /> since user is in group
            }}
          />
        );
      })()}

      {/* ➕ FAB */}
      {!currentUser.activeActivityId && (
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
        onCreate={(newGroup) => {
          setGroups([...groups, newGroup]);
          setJoinedGroupId(newGroup.id);
          setShowCreateModal(false);
        }}
      />

      {/* 👤 Selected User Modal */}
      {selectedUser && (
        <SelectedUserModal
          user={selectedUser}
          currentUser={currentUser}
          visible={true}
          onClose={() => setSelectedUser(null)}
          onJoin={(groupId) => {
            if (joinedGroupId || currentUser.activeActivityId) {
              alert("You're already in a group!");
              return;
            }
            currentUser.joinedGroupId = groupId;
            setJoinedGroupId(groupId);
            alert(`Joined activity: ${groupId}`);
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
