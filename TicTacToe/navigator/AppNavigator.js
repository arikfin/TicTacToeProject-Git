import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GameScreen from '../screens/GameScreen';
import GameModeSelectionScreen from '../screens/GameModeSelectionScreen';

const Stack = createStackNavigator();

export default function AppNavigator({ user, onLogin, fontsLoaded }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        options={{header: () => null, safeAreaInsets: {top:'never', bottom: 'never'}}}
      >
        {(props) => <LoginScreen {...props} onLogin={onLogin} fontsLoaded={fontsLoaded} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Register"
        options={{
          headerShown: false,
          unmountOnBlur: true
        }} 
      >
        {(props) => <ProfileScreen {...props} user={user} />}
      </Stack.Screen>
      <Stack.Screen
        name="GameModeSelection"
        options={{
          headerShown: false,
        }}>
          {(props) => <GameModeSelectionScreen {...props} fontsLoaded={fontsLoaded} />}
        </Stack.Screen>
      <Stack.Screen 
        name="Game"
        options={{
          headerShown: false,
        }} 
        component={GameScreen} />
    </Stack.Navigator>
  );
}
