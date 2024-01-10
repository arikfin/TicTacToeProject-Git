import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useFonts, Righteous_400Regular } from "@expo-google-fonts/righteous";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigator/AppNavigator";

export default function App() {
  const [user, setUser] = useState(null); // State for storing user data

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
