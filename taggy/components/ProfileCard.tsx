import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileProps = {
  name: string;
  picture: string; // URL of the user's profile picture
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
        {/* Dynamically load the user's profile picture */}
        <Image
          source={
            picture
              ? { uri: picture } // Use the profile picture URL if available
              : require('./avatar.png') // Fallback to the default avatar
          }
          style={styles.avatar}
        />
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
    width: '98%',
    aspectRatio: 1,
    backgroundColor: 'rgb(208, 226, 253)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
    alignSelf: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 150, // Make the avatar circular
  },
  checkIcon: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#fff',
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
});