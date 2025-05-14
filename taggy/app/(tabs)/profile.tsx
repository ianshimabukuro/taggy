import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase'; // make sure `db` is exported
import ProfileCard from '@/components/ProfileCard';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setProfileData(userSnap.data());
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View>
        <Text>User profile not found.</Text>
      </View>
    );
  }

  return (
    <ProfileCard
      name={profileData.name}
      nationality={profileData.nationality}
      age={profileData.age}
      major={profileData.major}
      picture={profileData.profilePicture || './avatar.png'} // Dynamically load profile picture
      languages={profileData.languages || []} // Add languages if available
      hobbies={profileData.hobbies || []}
    />
  );
}

