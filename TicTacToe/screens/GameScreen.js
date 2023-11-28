import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Board from "../components/Board.js";

export default function GameScreen({ navigation }) {
  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigation.navigate("Login");
      })
      .catch((error) => console.log("Error signing out:", error));
  };

  const handleGameEnd = (result) => {
    if (result === "X") {
      setXWins(xWins + 1);
      Alert.alert("Game Over", "X wins!");
    } else if (result === "O") {
      setOWins(oWins + 1);
      Alert.alert("Game Over", "O wins!");
    } else if (result === "Draw") {
      setDraws(draws + 1);
      Alert.alert("Game Over", "It's a draw!");
    }
    setGameResult(result);
  };

  const handleRestart = () => {
    setGameResult(null);
    setBoardKey((prevKey) => prevKey + 1);
  };

  const handlePlayerChange = (player) => {
    setCurrentPlayer(player);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

      <View style={styles.turnIndicators}>
        <View
          style={[
            styles.turnIndicator,
            currentPlayer === "X" ? styles.activeIndicator : {},
          ]}
        >
          <Text style={styles.turnText}>X's Turn</Text>
        </View>
        <View
          style={[
            styles.turnIndicator,
            currentPlayer === "O" ? styles.activeIndicator : {},
          ]}
        >
          <Text style={styles.turnText}>O's Turn</Text>
        </View>
      </View>

      <Board
        key={boardKey}
        onGameEnd={handleGameEnd}
        onPlayerChange={handlePlayerChange}
      />

      <View style={styles.scoreBoard}>
        <Text style={styles.scoreText}>X Wins: {xWins}</Text>
        <Text style={styles.scoreText}>O Wins: {oWins}</Text>
        <Text style={styles.scoreText}>Draws: {draws}</Text>
      </View>

      <View style={styles.restartButtonContainer}>
        {gameResult && (
          <TouchableOpacity
            style={styles.restartButton}
            onPress={handleRestart}
          >
            <Text style={styles.buttonText}>Restart Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007BFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
  },
  signOutButton: {
    position: "absolute",
    top: 80,
    left: 10,
    padding: 10,
    backgroundColor: "#FF6347", // Tomato color
    borderRadius: 5,
  },
  restartButtonContainer: {
    height: 50, // Reserve space for the button
    justifyContent: "center",
    alignItems: "center",
    width: "100%", // Ensure it spans the full width
    bottom: -50,
  },
  restartButton: {
    padding: 10,
    width: 150,
    backgroundColor: "#32CD32",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  turnIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  turnIndicator: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF",
    backgroundColor: "#007BFF",
  },
  activeIndicator: {
    backgroundColor: "#32CD32", // Light green background for the active player
  },
  turnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  scoreBoard: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FFF", // You can choose a color that fits your design
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  scoreText: {
    fontSize: 18,
    color: "#007BFF", // Text color, can be adjusted
    padding: 10,
    borderWidth: 1,
    borderColor: "#007BFF", // Border color
    borderRadius: 5,
    minWidth: 80, // Ensures that the frame has a minimum width
    textAlign: "center", // Centers the text
  },
});
