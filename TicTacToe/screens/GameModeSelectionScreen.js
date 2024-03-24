import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, Modal, } from "react-native";
import AnimatedBackground from "../components/AnimatedBackground.js";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default function GameModeSelectionScreen({ fontsLoaded, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to create a new game
  const createGame = async () => {
    const newGame = {
      board: Array(9).fill(null),
      currentTurn: "X",
      gameOver: false,
      winner: null,
      playerXId: auth.currentUser.uid,
      draw: false,
    };
    // Add the new game to the 'games' collection in Firestore
    const docRef = await addDoc(collection(db, "games"), newGame);
    return docRef.id;
  };
  // Function to handle pressing the single-player button
  const handleSinglePlayerPress = () => {
    // Navigate to the single-player game screen
    navigation.navigate("Game");
  };

  // Function to handle pressing the multiplayer button
  const handleMultiplayerPress = async () => {
    setModalVisible(true);
    const gameId = await createGame();
    setModalVisible(false);
    navigation.navigate("MultiplayerGame", { gameId });
  };

  // Function to handle signing out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.navigate("Login");
      })
      .catch((error) => console.log("Error signing out:", error));
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      {fontsLoaded && (
        <View style={styles.headerBackground}>
          <Text style={styles.header}>Choose Game Mode</Text>
        </View>
      )}
      <View style={styles.frame}>
        <TouchableOpacity onPress={handleSinglePlayerPress} style={styles.button}>
          <Text style={styles.buttonText}>On Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMultiplayerPress} style={[styles.button, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Online</Text>
        </TouchableOpacity>
        <Modal animationType="slide" transparent={true} visible={modalVisible} statusBarTranslucent={true}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text>Searching for players...</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={handleSignOut} style={[styles.signOutButton, { marginTop: 20 }]}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#292929", // Dark background color
  },
  headerBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 40,
    marginBottom: 20,
    fontFamily: "Righteous_400Regular",
    color: "#FFBC42",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    width: "70%",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signOutButton: {
    width: "50%",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6347",
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
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  frame: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 16,
    width: "80%",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});
