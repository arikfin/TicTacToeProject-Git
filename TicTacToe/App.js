import React, { useState } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useFonts, Righteous_400Regular } from '@expo-google-fonts/righteous';
import LoginScreen from './screens/LoginScreen';
import GameScreen from './screens/GameScreen';
import { initializeApp } from 'firebase/app';
import { app, firebaseConfig  } from './firebase.js';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigator/AppNavigator';

export default function App() {
  const [user, setUser] = useState(null);



  let [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <NavigationContainer>
      <AppNavigator user={user} onLogin={setUser} fontsLoaded={fontsLoaded} />
    </NavigationContainer>
  );
}
