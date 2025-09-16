# Taggy

Our first React Native + Expo MVP app that helps students connect through quick, low-commitment activities. Instead of long planning, users can see nearby activities, join or create one, and meet others in minutes.  

---

## Features

- Authentication with email/password signup and login  
- Firestore auto-profile creation for new users  
- Profile management: name, nationality, age, major, hobbies, languages, and picture  
- Explore screen with a map showing nearby students and their activities  
- Join or create groups with meeting points and automatic timeouts  
- Realtime updates via Firestore and Firebase Realtime Database  
- Automatic cleanup of expired groups and reset of user state  
- Tab-based navigation: Explore and Profile  

---

## Tech Stack

- Framework: Expo SDK 53  
- UI: React Native 0.79, Expo Vector Icons, React Navigation  
- Routing: expo-router with `_layout.tsx` for authentication guard  
- Authentication: Firebase Authentication (Email/Password, Google Sign-In optional)  
- Database: Firestore (users and groups), Realtime Database (locations)  
- Maps: react-native-maps  
- Testing: Jest with jest-expo  
## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```
