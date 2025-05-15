import { useEffect } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Group, MockUser } from '@/types/models';

export default function useGroupTimeouts(groups: Group[], currentUser: MockUser | null) {
  useEffect(() => {
    const interval = setInterval(async () => {
      const now = new Date();

      groups.forEach(async (group) => {
        //console.log('Retrieved timeout from Firestore (Timestamp):', group.timeout);

        // Convert Firestore Timestamp to Date
        const timeoutDate = group.timeout.toDate();

        //console.log('Timeout:', timeoutDate);
        //console.log('Current time:', now);

        if (timeoutDate <= now) {
          try {
            await deleteDoc(doc(db, 'groups', group.id));
            console.log(`✅ Group ${group.id} deleted due to timeout`);

            if (
              currentUser?.joinedGroupId === group.id ||
              currentUser?.activeActivityId === group.id
            ) {
              await updateDoc(doc(db, 'users', currentUser.id), {
                activeActivityId: null,
                joinedGroupId: null,
              });
              console.log(`✅ Cleared group references for user ${currentUser.id}`);
            }
          } catch (err) {
            console.error(`❌ Error deleting group ${group.id}:`, err);
          }
        }
      });
    }, 2 * 1000);

    return () => clearInterval(interval);
  }, [groups, currentUser]);

  return {};
}