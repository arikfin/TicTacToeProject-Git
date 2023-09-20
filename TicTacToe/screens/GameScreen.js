import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function GameScreen({ navigation }) {

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        // Navigate back to the Login Screen
        navigation.navigate('Login');
      })
      .catch((error) => console.log("Error signing out:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Screen</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
