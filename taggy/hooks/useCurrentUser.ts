import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { MockUser } from '@/types/models';

export default function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);

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

  return currentUser;
}