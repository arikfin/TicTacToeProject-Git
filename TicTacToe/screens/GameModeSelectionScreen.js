import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground.js';

export default function GameModeSelectionScreen({ fontsLoaded, navigation }) {
  
  const handleSinglePlayerPress = () => {
    // Navigate to the single-player game screen
    navigation.navigate('Game');
  };

  const handleMultiplayerPress = () => {
    // Navigate to the multiplayer setup or game screen
    navigation.navigate('MultiplayerGame');
  };

  

  return (
    <View style={styles.container}>
        <AnimatedBackground/>
        {fontsLoaded && (
            <View style={styles.headerBackground}>
                <Text style={styles.header}>Choose Game Mode</Text>
            </View>
        )}
        <View style = {styles.frame}>

            <TouchableOpacity 
                onPress={handleSinglePlayerPress}
                style={styles.button}>
                <Text style={styles.buttonText}>Single-Player</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleMultiplayerPress}
                style={[styles.button, {marginTop: 20}]}>
                <Text style={styles.buttonText}>Multi-Player</Text>
            </TouchableOpacity>


        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#292929',  // Dark background color
      },
      headerBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
      header: {
        fontSize: 40,
        marginBottom: 20,
        fontFamily: 'Righteous_400Regular',
        color: '#FFBC42',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
      },
      button: {
        width: '70%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor: '#4CAF50',  
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      buttonText: {
        color: 'white',  
        fontSize: 18,
        fontWeight: 'bold'
      },
      frame: {
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        width : "80%",
        alignItems: 'center',
    },
});
