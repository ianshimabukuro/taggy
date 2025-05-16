import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Image } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: 'Taggy',
        headerStyle: {
          backgroundColor: '#fff', // White header
        },
        headerTitleStyle: {
          color: '#FF9500', // Orange text
          fontWeight: 'bold',
          fontSize: 22,
          letterSpacing: 1,
        },
        headerTintColor: '#FF9500',
        headerLeft: () => (
          <Image
            source={require('../../assets/default-icon.png')}
            style={{
              width: 34,
              height: 34,
              marginLeft: 16,
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
            resizeMode="contain"
          />
        ),
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#FF9500',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 82 : 62,
          paddingBottom: Platform.OS === 'ios' ? 22 : 12,
          paddingTop: 12,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          shadowColor: '#22223B',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.2,
          color: '#fff',
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
