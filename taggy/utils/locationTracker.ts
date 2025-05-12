// utils/locationTracker.ts
import * as Location from 'expo-location';
import { ref, set } from 'firebase/database';
import { realtimeDb, auth } from '@/config/firebase';

let watchId: Location.LocationSubscription | null = null;

export const startLocationTracking = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.warn('📵 Location permission not granted');
    return;
  }

  watchId = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000,
      distanceInterval: 5,
    },
    async (loc) => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      // Push to Realtime Database
      await set(ref(realtimeDb, `locations/${uid}`), {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: Date.now(),
      });
    }
  );
};

export const stopLocationTracking = () => {
  if (watchId) {
    watchId.remove();
    watchId = null;
  }
};
