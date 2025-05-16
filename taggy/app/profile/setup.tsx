// app/profile/setup.tsx
import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        name,
        age,
        nationality,
        major,
        hobbies: hobbies.split(',').map(h => h.trim()),
      });

      Alert.alert('Success', 'Profile updated!');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.header}>Complete Your Profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="e.g. Ian" style={styles.input} placeholderTextColor="#A0A4B8" />

        <Text style={styles.label}>Age</Text>
        <TextInput value={age} onChangeText={setAge} placeholder="e.g. 24" style={styles.input} placeholderTextColor="#A0A4B8" keyboardType="numeric" />

        <Text style={styles.label}>Nationality</Text>
        <TextInput value={nationality} onChangeText={setNationality} placeholder="e.g. Brazilian" style={styles.input} placeholderTextColor="#A0A4B8" />

        <Text style={styles.label}>Major</Text>
        <TextInput value={major} onChangeText={setMajor} placeholder="e.g. Biotechnology" style={styles.input} placeholderTextColor="#A0A4B8" />

        <Text style={styles.label}>Hobbies (comma-separated)</Text>
        <TextInput value={hobbies} onChangeText={setHobbies} placeholder="e.g. soccer, coding, boba" style={styles.input} placeholderTextColor="#A0A4B8" />

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save and Continue'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    backgroundColor: '#F2F6FC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  card: {
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 28,
    shadowColor: '#22223B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 8,
    alignItems: 'stretch',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 28,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    color: '#4A4E69',
    fontSize: 15,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#A0C4FF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F2F6FC',
    marginBottom: 8,
    color: '#22223B',
  },
  saveButton: {
    backgroundColor: '#FF9500',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    width: '100%',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
