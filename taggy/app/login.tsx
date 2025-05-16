//Login Screen 

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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
    <View style={styles.outer}>
      <View style={styles.card}>
        <Text style={styles.header}>Login to Taggy</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#A0A4B8"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A0A4B8"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.replace('/signup')}
          activeOpacity={0.7}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={{ color: '#FF9500', fontWeight: 'bold' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#F2F6FC',
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 28,
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#A0C4FF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F2F6FC',
    marginBottom: 16,
    color: '#22223B',
  },
  loginButton: {
    backgroundColor: '#FF9500',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  signupLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  signupText: {
    color: '#4A4E69',
    fontSize: 15,
  },
});
