import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import type { LocationObjectCoords } from 'expo-location';

export default function useCurrentLocation() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }
    
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation(coords);
      } catch (err) {
        setError('Error getting location');
        console.error('❌ Location error:', err);
      }
    })();
  }, []);

  return { location, error };
}