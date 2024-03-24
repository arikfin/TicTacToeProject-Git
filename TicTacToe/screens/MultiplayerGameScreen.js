import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Cell from "../components/Cell";
import { auth, firestore } from "../firebase";
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function MultiPlayerGameScreen({ navigation, onPlayerChange, user }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const verticalLineHeight = useSharedValue(0);
  const horizontalLineWidth = useSharedValue(0);
  const [winningCombination, setWinningCombination] = useState(null);

  const [gameResult, setGameResult] = useState(null);
  const [boardKey, setBoardKey] = useState(0);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [userAvatar, setUserAvatar] = useState(null);
  const [gameDocRef, setGameDocRef] = useState(null);


  const startNewGame = async (playerId) => {
    // Get a reference to the games collection
    const gamesRef = firestore.collection('games');

    // Create a new game document with the initial game state
    const docRef = await gamesRef.add({
      board: Array(9).fill(null),
      currentTurn: "X",
      draw: false,
      gameOver: false,
      playerId: playerId,
      winner: null
    });

    console.log("New game created with ID: ", docRef.id);

    // Save the game document reference
    setGameDocRef(docRef);
    console.log("After setGameDocRef: ", gameDocRef);

    // Set up the listener for changes to the game document
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        // Update the game state with the data from Firestore
        const data = doc.data();
        setBoard(data.board);
        setCurrentPlayer(data.currentTurn);
        setGameOver(data.gameOver);
        // ... update other state variables as needed
      } else {
        console.log("No such document!");
      }
    });

    // Return a cleanup function to unsubscribe from the listener
    return unsubscribe;
  };


  useEffect(() => {
    let unsubscribe = () => { };

    if (gameDocRef && user && user.uid) {
      unsubscribe = startNewGame(user.uid);
    }

    return unsubscribe; // Clean up the listener when the component unmounts or gameDocRef/user changes
  }, [gameDocRef, user]);



  // useEffect(() => {
  //   if (user && user.uid) {
  //     startNewGame(user.uid).then((docRef) => {
  //       setGameDocRef(docRef);
  //     });
  //   }
  // }, [user]);


  const initializeGameDocRef = async () => {
    console.log('initializeGameDocRef called');
    if (user && user.uid) {
      console.log('user.uid:', user.uid);
      const docRef = await startNewGame(user.uid);
      setGameDocRef(docRef);
      console.log('gameDocRef set:', gameDocRef);
    } else {
      console.log('user or user.uid is not available');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User signed in:', user);
        setUser(user);
        initializeGameDocRef();
      } else {
        console.log('No user signed in');
      }
    });

    return unsubscribe; // Unsubscribe from the listener when the component unmounts
  }, []);




  // useEffect(() => {
  //   console.log('Component mounted, user:', user);
  //   initializeGameDocRef();
  // }, []);



  // Fetch the game ID from Firestore when the component mounts
  useEffect(() => {
    const fetchGameId = async () => {
      // Replace with your actual Firestore query
      const db = getFirestore();
      const gameRef = doc(db, "games");
      const gameDoc = await getDoc(gameRef);
      setGameId(gameDoc.id);
    };

    fetchGameId();
  }, []);


  // Use the useEffect hook to animate the lines and call the onPlayerChange function when the current player changes
  useEffect(() => {
    verticalLineHeight.value = withTiming(300, { duration: 1000, easing: Easing.linear });
    horizontalLineWidth.value = withTiming(300, { duration: 1000, easing: Easing.linear });
  }, [currentPlayer]);


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
    setBoard(Array(9).fill(null)); // Reset the game board
    setCurrentPlayer("X"); // Reset the current player to "X"
    setGameOver(false); // Reset the game over state
    setWinningCombination(null); // Reset the winning combination
    setGameResult(null); // Reset the game result
    setBoardKey((prevKey) => prevKey + 1); // Increment the board key to force a re-render of the board
  };

  // Function to handle changing the current player
  const handlePlayerChange = (player) => {
    setCurrentPlayer(player);
  };


  // Define the animated style for the vertical lines
  const verticalAnimatedStyle = useAnimatedStyle(() => {
    return { height: verticalLineHeight.value, top: 300 - verticalLineHeight.value };
  });

  // Define the animated style for the horizontal lines
  const horizontalAnimatedStyle = useAnimatedStyle(() => {
    return { width: horizontalLineWidth.value, left: 0 };
  });

  // Define the GridLines component
  const GridLines = () => {
    return (
      <>
        <Animated.View style={[styles.line, { width: 2, height: 300, left: 100 }, verticalAnimatedStyle]} />
        <Animated.View style={[styles.line, { width: 2, height: 300, left: 200 }, verticalAnimatedStyle]} />
        <Animated.View style={[styles.line, { width: 300, height: 2, top: 100 }, horizontalAnimatedStyle]} />
        <Animated.View style={[styles.line, { width: 300, height: 2, top: 200 }, horizontalAnimatedStyle]} />
      </>
    );
  };

  // Define the handlePress function
  const handlePress = async (index) => {
    console.log('handlePress called');

    while (!gameDocRef) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (!gameDocRef) {
      console.log("Game document reference not available. Cannot handle press.");
      return; // Exit the function early if gameDocRef is not available
    }


    if (board[index] || gameOver) return; // If the cell is already filled or the game is over, do nothing

    const newBoard = board.slice(); // Copy the game board
    newBoard[index] = currentPlayer; // Set the current cell to the current player
    console.log('newBoard:', newBoard); // Log the newBoard value
    setBoard(newBoard); // Update the game board

    const winnerCombination = checkWinner(newBoard, currentPlayer); // Check if the current player has won
    let newGameOver = gameOver;
    let newCurrentPlayer = currentPlayer;

    if (winnerCombination) {
      newGameOver = true; // Set the game to be over
      setGameOver(true);
      setWinningCombination(winnerCombination); // Set the winning combination
      handleGameEnd(currentPlayer); // Call the onGameEnd function with the current player
    } else if (newBoard.every((cell) => cell)) {
      newGameOver = true;
      setGameOver(true);
      handleGameEnd("Draw");
    } else {
      newCurrentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch to the other player
      setCurrentPlayer(newCurrentPlayer);
    }



    // Update the game document in Firestore
    await updateDoc(gameDocRef, {
      board: newBoard,
      currentTurn: newCurrentPlayer,
      gameOver: newGameOver,
      winner: winnerCombination ? currentPlayer : null,
    });

  };


  // Define the checkWinner function
  const checkWinner = (board, player) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    for (let combination of winningCombinations) {
      // If all cells in the combination are filled by the player, return the winning combination
      if (combination.every((index) => board[index] === player)) {
        return combination; // Return the winning combination
      }
    }
    return null; // No winner
  };

  const WinningLine = ({ combination }) => {
    if (!combination) return null;

    // Define the initial style for the winning line
    let lineStyle = {
      position: "absolute",
      backgroundColor: "red",
      height: 2,
    };

    // If the winning combination is a row, adjust the style to draw a horizontal line
    if (
      combination.includes(0) &&
      combination.includes(1) &&
      combination.includes(2)
    ) {
      lineStyle = { ...lineStyle, width: 300, top: 50, left: 0 };
    } else if (
      combination.includes(3) &&
      combination.includes(4) &&
      combination.includes(5)
    ) {
      lineStyle = { ...lineStyle, width: 300, top: 150, left: 0 };
    } else if (
      combination.includes(6) &&
      combination.includes(7) &&
      combination.includes(8)
    ) {
      lineStyle = { ...lineStyle, width: 300, top: 250, left: 0 };
    }
    // If the winning combination is a column, adjust the style to draw a vertical line
    else if (
      combination.includes(0) &&
      combination.includes(3) &&
      combination.includes(6)
    ) {
      lineStyle = { ...lineStyle, width: 2, height: 300, top: 0, left: 50 };
    } else if (
      combination.includes(1) &&
      combination.includes(4) &&
      combination.includes(7)
    ) {
      lineStyle = { ...lineStyle, width: 2, height: 300, top: 0, left: 150 };
    } else if (
      combination.includes(2) &&
      combination.includes(5) &&
      combination.includes(8)
    ) {
      lineStyle = { ...lineStyle, width: 2, height: 300, top: 0, left: 250 };
    }
    // If the winning combination is a diagonal, adjust the style to draw a diagonal line
    else if (
      combination.includes(0) &&
      combination.includes(4) &&
      combination.includes(8)
    ) {
      lineStyle = { ...lineStyle, width: 2, height: 416, top: -58, left: 149, transform: [{ rotate: "-45deg" }] };
    } else if (
      combination.includes(2) &&
      combination.includes(4) &&
      combination.includes(6)
    ) {
      lineStyle = { ...lineStyle, width: 2, height: 416, top: -58, left: 149, transform: [{ rotate: "45deg" }] };
    }

    return <View style={lineStyle} />;
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


      <View style={styles.boardContainer}>
        {board.map((cell, index) => (
          <Cell key={index} value={cell} onPress={() => handlePress(index)} />
        ))}
        <GridLines />
        <WinningLine combination={winningCombination} />
      </View>




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
    justifyContent: 'center',
    alignItems: 'center',
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
  boardContainer: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  line: {
    position: "absolute",
    backgroundColor: "black",
  },
});