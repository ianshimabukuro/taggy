//Login Screen 

import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Logged in!');
  
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('No user UID found');
  
      // 👇 Check and set up user doc
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        console.log('🆕 First time login — creating user profile');
        await setDoc(userRef, {
          name: '',
          age: null,
          nationality: '',
          major: '',
          hobbies: [],
          location: {
            latitude: 0,
            longitude: 0,
          },
          activeActivityId: null,
          joinedGroupId: null,
          radius: 500,
          createdAt: Date.now(),
        });
        router.replace('/profile/setup'); // 🔁 redirect to setup
      } else {
        console.log('👋 Returning user');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
});
