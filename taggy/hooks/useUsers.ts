import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { MockUser } from '@/types/models';

export default function useUsers() {
  const [users, setUsers] = useState<MockUser[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const userList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MockUser[];
      setUsers(userList);
    });

    return unsub;
  }, []);

  return users;
}