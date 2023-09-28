import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import  Board  from '../components/Board.js';


export default function GameScreen({ navigation }) {
  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.navigate('Login');
      })
      .catch((error) => console.log("Error signing out:", error));
  };

  const handleGameEnd = (result) => {
    if(result === 'X' || result === 'O') {
      Alert.alert('Game Over', `${result} wins!`);
    } else if (result === 'Draw'){
      Alert.alert('Game Over', 'It\'s a draw!');
    }
    setGameResult(result);
  }

  const handleRestart = () => {
    setGameResult(null);
    setBoardKey(prevKey => prevKey + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Board key={boardKey} onGameEnd={handleGameEnd}/>
      {gameResult && <Button title='Restart Game' onPress={handleRestart}/>}
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
