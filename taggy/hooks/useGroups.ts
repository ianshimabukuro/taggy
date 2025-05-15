import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Group } from '@/types/models';

export default function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'groups'), (snap) => {
      const groupList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Group[];
      setGroups(groupList);
    });

    return unsub;
  }, []);

  return groups;
}