import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import BoardSinglePlayer from "../components/BoardSinglePlayer.js";

export default function GameScreen({ navigation }) {
  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [userAvatar, setUserAvatar] = useState(null);

  // useEffect hook to fetch the user's avatar when the component mounts
  useEffect(() => {
    const fetchUserAvatar = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(getFirestore(), "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const avatarUrl = userData.avatar; // Assuming it's saved as 'avatar1', 'avatar2', etc.
          setUserAvatar({ uri: avatarUrl }); // Set the correct avatar image
        }
      }
    };

    fetchUserAvatar();
  }, []);

  // Function to handle going back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to handle the end of the game
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

  // Function to handle restarting the game
  const handleRestart = () => {
    setGameResult(null);
    setBoardKey((prevKey) => prevKey + 1);
  };

  // Function to handle changing the current player
  const handlePlayerChange = (player) => {
    setCurrentPlayer(player);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        {userAvatar && (
          <Image source={userAvatar} style={styles.profilePhoto} />
        )}
        <Image source={require("../assets/robot.jpg")} style={styles.robotPhoto} />
      </View>
      <View style={styles.turnIndicators}>
        <View style={[styles.turnIndicator, currentPlayer === "X" ? styles.activeIndicator : {},]}>
          <Text style={styles.turnText}>X's Turn</Text>
        </View>
        <View style={[styles.turnIndicator, currentPlayer === "O" ? styles.activeIndicator : {},]}>
          <Text style={styles.turnText}>O's Turn</Text>
        </View>
      </View>

      <BoardSinglePlayer key={boardKey} onGameEnd={handleGameEnd} onPlayerChange={handlePlayerChange} />

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
  goBackButton: {
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
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center", // This will ensure vertical alignment is centered
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginBottom: 10,
    marginRight: 30,
  },
  robotPhoto: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginBottom: 10,
    marginLeft: 30,
  },
});
