import React, {useEffect, useState} from "react";
import { ActivityIndicator } from "react-native";
import { useFonts, Righteous_400Regular } from "@expo-google-fonts/righteous";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigator/AppNavigator";
import {auth} from "./firebase";

export default function App() {
  const [user, setUser] = useState(null); // State for storing user data

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in:', user.uid);
        setUser(user);
      } else {
        console.log('No user signed in');
      }
    });

    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, []);

  // Loading the Righteous_400Regular font using useFonts hook
  let [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  // If the fonts are not loaded yet, show an ActivityIndicator
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  // Once the fonts are loaded, render the NavigationContainer and AppNavigator
  return (
    <NavigationContainer>
      <AppNavigator user={user} onLogin={setUser} fontsLoaded={fontsLoaded} />
    </NavigationContainer>
  );
}

