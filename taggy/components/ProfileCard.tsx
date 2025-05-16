import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ProfileProps = {
  name: string;
  picture: string;
  age: number;
  nationality: string;
  major: string;
  hobbies: string[];
};

export default function ProfileCard({
  name,
  picture,
  age,
  nationality,
  major,
  hobbies,
}: ProfileProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            picture
              ? { uri: picture }
              : require('./avatar.png')
          }
          style={styles.avatar}
        />
        <Ionicons name="checkmark-circle" size={28} color="#34D399" style={styles.checkIcon} />
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subtitle}>{major}</Text>
      <Text style={styles.info}>{age} | {nationality}</Text>

      <Text style={styles.sectionTitle}>Hobbies</Text>
      <View style={styles.badgeContainer}>
        {hobbies.map((hobby, idx) => (
          <View
            key={idx}
            style={[
              styles.badge,
              { backgroundColor: idx % 2 === 0 ? '#FF9500' : '#E5E7EB' }
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: idx % 2 === 0 ? '#fff' : '#FF9500' }
              ]}
            >
              {hobby}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 26,
    alignItems: 'center',
    width: '92%',
    alignSelf: 'center',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
    marginTop: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 16,
    borderWidth: 5,
    borderColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    resizeMode: 'cover',
    backgroundColor: '#F2F6FC',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 2,
    elevation: 2,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9500',
    marginTop: 2,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    color: '#000000', // orange for major
    fontWeight: '700',
    marginBottom: 2,
  },
  info: {
    fontSize: 14,
    color: '#4A4E69',
    marginBottom: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
    color: '#FF9500',
    fontSize: 15,
    letterSpacing: 0.2,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2,
  },
});