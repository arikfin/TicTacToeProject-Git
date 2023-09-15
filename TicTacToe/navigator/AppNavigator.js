import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GameScreen from '../screens/GameScreen';


const Stack = createStackNavigator();

export default function AppNavigator({ user, onLogin, fontsLoaded }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      {user ? (
        <Stack.Screen name="Game" component={GameScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" options={{header: () => null , safeAreaInsets: {top:'never' , bottom: 'never'}}}>
            {(props) => <LoginScreen {...props} onLogin={onLogin} fontsLoaded={fontsLoaded} />}
          </Stack.Screen>
          <Stack.Screen 
            name="Register"
            component={ProfileScreen}
            options={{headerShown: false}} 
            />
        </>
      )}
    </Stack.Navigator>
  );
}
