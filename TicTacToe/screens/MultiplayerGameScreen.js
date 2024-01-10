import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { auth } from "../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Board from "../components/Board.js";
import { checkWinner } from "../components/Board.js";
import BoardMultiPlayer from "../components/BoardMultiPlayer.js";

export default function MultiplayerGameScreen({ navigation, route }) {
  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [userAvatar, setUserAvatar] = useState(null);
  const { gameId } = route.params;
  const [board, setBoard] = useState([]);
  const [draw, setDraw] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [gameState, setGameState] = useState(null);

  // useEffect hook to fetch the game state from Firestore when the component mounts or when gameId changes
  useEffect(() => {
    const db = getFirestore();
    const gameRef = doc(db, "games", gameId);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      setGameState(doc.data());
    });

    return unsubscribe;
  }, [gameId]);

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

  // useEffect hook to fetch the game state from Firestore when the component mounts or when gameId changes
  useEffect(() => {
    const fetchGame = async () => {
      const db = getFirestore();
      const gameRef = doc(db, "games", gameId);

      const unsubscribe = onSnapshot(gameRef, (doc) => {
        const gameData = doc.data();
        setCurrentPlayer(gameData.currentTurn);
        setBoard(gameData.board);
        setDraw(gameData.draw);
        setGameOver(gameData.gameOver);
        setWinner(gameData.winner);
      });

      // Clean up the subscription on unmount
      return () => unsubscribe();
    };

    fetchGame();
  }, [gameId]); // Re-run this effect if the gameId changes

  // Function to make a move in the game
  const makeMove = async (index) => {
    console.log(gameId);

    const db = getFirestore();
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);

    if (gameSnap.exists()) {
      const gameState = gameSnap.data();

      // If the game is over, don't make a move
      if (gameState.gameOver) {
        return;
      }

      // Make the move
      gameState.board[index] = gameState.currentTurn;

      // Check if the game has ended
      const result = checkWinner(gameState.board, gameState.currentTurn);
      if (result) {
        handleGameEnd(gameState.currentTurn);
      }

      // Switch the current player
      gameState.currentTurn = gameState.currentTurn === "X" ? "O" : "X";

      // Update the game state in Firestore
      await updateDoc(gameRef, gameState);
    } else {
      console.log("No such document!");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Function to handle the end of the game
  const handleGameEnd = async (result) => {
    const db = getFirestore();
    const gameRef = doc(db, "games", gameId);

    if (result === "X") {
      Alert.alert("Game Over", "X wins!");
    } else if (result === "O") {
      Alert.alert("Game Over", "O wins!");
    } else if (result === "Draw") {
      Alert.alert("Game Over", "It's a draw!");
    }

    // Update the game result in Firestore
    await updateDoc(gameRef, { result, gameOver: true });
  };

  // Function to handle restarting the game
  const handleRestart = async () => {
    const db = getFirestore();
    const gameRef = doc(db, "games", gameId);

    // Reset the game state in Firestore
    await updateDoc(gameRef, {
      board: Array(9).fill(null),
      currentTurn: "X",
      result: null,
      gameOver: false,
    });
  };

  // Function to handle changing the current player
  const handlePlayerChange = async (player) => {
    const db = getFirestore();
    const gameRef = doc(db, "games", gameId);

    // Update the current player in Firestore
    await updateDoc(gameRef, { currentTurn: player });
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

      <BoardMultiPlayer
        key={boardKey}
        onGameEnd={handleGameEnd}
        onPlayerChange={handlePlayerChange}
        makeMove={makeMove}
        gameState={gameState}
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
