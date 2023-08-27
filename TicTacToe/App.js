import React, { useState } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import LoginScreen from './screens/LoginScreen';
import GameScreen from './screens/GameScreen';
import { auth, database } from './firebaseConfig';

export default function App() {
  const [user, setUser] = useState(null);
  let [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  if (user) {
    return <GameScreen />;
  } else {
    return <LoginScreen onLogin={setUser} fontsLoaded={fontsLoaded} />;
  }
}
