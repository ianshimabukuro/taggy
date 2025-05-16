import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create an initial Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        name: '',
        age: null,
        nationality: '',
        major: '',
        hobbies: [],
        location: { latitude: 0, longitude: 0 },
        activeActivityId: null,
        joinedGroupId: null,
        radius: 500,
        createdAt: Date.now(),
      });

      Alert.alert('Success', 'Account created! Please complete your profile.');
      router.replace('/profile/setup');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outer} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.header}>Sign Up for Taggy</Text>

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

        <View style={{ width: '100%', marginBottom: 10 }}>
          <Text style={{ fontSize: 13, color: '#4A4E69', textAlign: 'center' }}>
            By signing up, you agree to our{' '}
            <Text style={{ color: '#FF9500', fontWeight: 'bold' }}>Terms of Service</Text> and{' '}
            <Text style={{ color: '#FF9500', fontWeight: 'bold' }}>Privacy Policy</Text>.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.signupButton, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.signupButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.replace('/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={{ color: '#FF9500', fontWeight: 'bold' }}>Log In</Text>
          </Text>
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
  signupButton: {
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
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginText: {
    color: '#4A4E69',
    fontSize: 15,
  },
});