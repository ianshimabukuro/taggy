import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '@/config/firebase';

export default function useLiveLocations() {
  const [liveLocations, setLiveLocations] = useState<{ [uid: string]: { latitude: number; longitude: number } }>({});

  useEffect(() => {
    const locationsRef = ref(realtimeDb, 'locations');
    const unsubscribe = onValue(locationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setLiveLocations(data);
    });

    return () => unsubscribe();
  }, []);

  return liveLocations;
}