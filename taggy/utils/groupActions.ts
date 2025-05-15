import { doc, setDoc,updateDoc, arrayRemove, Timestamp } from 'firebase/firestore';
import { db,auth } from '@/config/firebase';
import type { Group, MockUser } from '../types/models';

export async function leaveGroup(currentUser: MockUser, currentGroup: Group) {
  try {
    // Remove the user's ID from the group's participantIds array
    const groupRef = doc(db, 'groups', currentGroup.id);
    await updateDoc(groupRef, {
      participantIds: arrayRemove(currentUser.id),
    });

    // Clear the user's joinedGroupId
    await updateDoc(doc(db, 'users', currentUser.id), {
      joinedGroupId: null,
    });

    return { success: true, message: '✅ You have left the group.' };
  } catch (err) {
    console.error('❌ Error leaving group:', err);
    return { success: false, message: 'Failed to leave the group.' };
  }
}

export async function handleCreateGroup(newGroup: Group) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("User not logged in");

    const groupRef = doc(db, 'groups', newGroup.id);
    const groupData = {
      ...newGroup,
      hostUserId: uid,
      participantIds: [uid],
      timeout: Timestamp.fromDate(newGroup.timeout), // Use the timeout from modal
    };

    await setDoc(groupRef, groupData);

    await updateDoc(doc(db, 'users', uid), {
      activeActivityId: newGroup.id,
      joinedGroupId: newGroup.id,
    });

    return { success: true, message: '✅ Group created and user updated' };
  } catch (err) {
    console.error('❌ Error creating group:', err);
    return { success: false, message: 'Failed to create group' };
  }
}