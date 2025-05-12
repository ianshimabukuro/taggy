// app/profile/setup.tsx
import { useState } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useRouter } from 'expo-router';

export default function SetupProfile() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [major, setMajor] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        name,
        age,
        nationality,
        major,
        hobbies: hobbies.split(',').map(h => h.trim()), // turn comma list into array
      });

      Alert.alert('Success', 'Profile updated!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Complete Your Profile</Text>

      <Text>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="e.g. Ian" style={styles.input} />

      <Text>Age</Text>
      <TextInput value={age} onChangeText={setAge} placeholder="e.g. 24" style={styles.input} />

      <Text>Nationality</Text>
      <TextInput value={nationality} onChangeText={setNationality} placeholder="e.g. Brazilian" style={styles.input} />

      <Text>Major</Text>
      <TextInput value={major} onChangeText={setMajor} placeholder="e.g. Biotechnology" style={styles.input} />

      <Text>Hobbies (comma-separated)</Text>
      <TextInput value={hobbies} onChangeText={setHobbies} placeholder="e.g. soccer, coding, boba" style={styles.input} />

      <View style={{ marginTop: 20 }}>
        <Button title="Save and Continue" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
};
