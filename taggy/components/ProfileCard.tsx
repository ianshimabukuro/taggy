import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileProps = {
  name: string;
  picture: string;
  age: number;
  nationality: string;
  major: string;
  languages: string[];
  hobbies: string[];
};

export default function ProfileCard({
  name,
  picture,
  age,
  nationality,
  major,
  languages,
  hobbies,
}: ProfileProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image source={require('./avatar.png')}style={styles.avatar} />
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" style={styles.checkIcon} />
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>{major}</Text>
      <Text style={styles.info}>{age} | {nationality}</Text>

      <Text style={styles.sectionTitle}>Languages</Text>
      <View style={styles.badgeContainer}>
        {languages.map((lang, idx) => (
          <Text key={idx} style={styles.badge}>{lang}</Text>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Hobbies</Text>
      <View style={styles.badgeContainer}>
        {hobbies.map((hobby, idx) => (
          <Text key={idx} style={styles.badge}>{hobby}</Text>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#60A5FA',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarContainer: {
    width: '98%',               // make it responsive
    aspectRatio: 1,             // maintain a square shape
    backgroundColor:'rgb(208, 226, 253)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
    alignSelf: 'center',        // center within parent
    overflow: 'hidden',
    padding: 10,                // optional: inner spacing around avatar
  },
  
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 0, // makes it circular
  },
  
  checkIcon: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#fff', // optional: adds contrast behind icon
    borderRadius: 12,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#007AFF',
  },
  info: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'flex-start',
    color: '#444',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    margin: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
