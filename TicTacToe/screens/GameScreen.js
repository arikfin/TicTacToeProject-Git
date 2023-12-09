import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { signOut } from "firebase/auth";
import { auth, firebase, getAuth } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Board from "../components/Board.js";
import avatar1 from "../assets/avatars/black-female.jpg";
import avatar2 from "../assets/avatars/black-male.jpg";
import avatar3 from "../assets/avatars/blonde-female.jpg";
import avatar4 from "../assets/avatars/blonde-male.jpg";
import avatar5 from "../assets/avatars/hipster-female.jpg";
import avatar6 from "../assets/avatars/hipster-male.jpg";
import avatar7 from "../assets/avatars/white-female.jpg";
import avatar8 from "../assets/avatars/white-male.jpg";



const avatarUrls = [
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblack-female.jpg?alt=media&token=50529a12-7172-47e9-8209-e32e446b9c69',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblack-male.jpg?alt=media&token=0e6ad8a6-6c30-48d2-aed0-87e83f532f4e',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblonde-female.jpg?alt=media&token=97218cc7-e989-4d15-a49b-0dd00b1a1246',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblonde-male.jpg?alt=media&token=ec758017-d1b7-42f0-a7fa-a67bd6e8532e',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fhipster-female.jpg?alt=media&token=e5449abe-038a-4b7f-8883-9822eba8d8f3',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fhipster-male.jpg?alt=media&token=1e683a8d-f416-4c05-b091-d61520f189b7',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fwhite-female.jpg?alt=media&token=fc7b4b18-2399-43d4-a90e-f547320965c7',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fwhite-male.jpg?alt=media&token=6ef9ad2c-dafc-4867-9905-135cb4f9bc09',
];

export default function GameScreen({ navigation }) {
  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [userAvatar, setUserAvatar] = useState(null);

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
      <View style={styles.avatarContainer}>
        {userAvatar && (
          <Image source={userAvatar} style={styles.profilePhoto} />
        )}
      </View>
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
  avatarContainer: {
    // additional styling may be required
    alignSelf: 'center', // Center the avatar horizontally
  },
  profilePhoto: {
    width: 60, // adjust size as needed
    height: 60, // adjust size as needed
    borderRadius: 25, // makes it circular
    marginBottom: 10, // space between avatar and indicators
    left: -60
  },
});
