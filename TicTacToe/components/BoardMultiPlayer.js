import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Cell from "./Cell";
import { getFirestore, doc, getDoc, onSnapshot, updateDoc, } from "firebase/firestore";
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export const checkWinner = (board, player) => {
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
    if (combination.every((index) => board[index] === player)) {
      return combination; // Return the winning combination
    }
  }
  return null; // No winner
};

export default function BoardMultiPlayer({ onGameEnd, onPlayerChange, makeMove, gameState, gameId }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const verticalLineHeight = useSharedValue(0);
  const horizontalLineWidth = useSharedValue(0);
  const [winningCombination, setWinningCombination] = useState(null);

  // Define the side effect for when the current player changes
  useEffect(() => {
    // Animate the vertical and horizontal lines
    verticalLineHeight.value = withTiming(300, { duration: 1000, easing: Easing.linear });
    horizontalLineWidth.value = withTiming(300, { duration: 1000, easing: Easing.linear });
    onPlayerChange(currentPlayer);
  }, [currentPlayer]);

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


  const handlePress = async (index) => {
    // If the cell at the given index is already filled or the game is over, return
    if (board[index] || gameOver) return;

    // Create a new board by copying the current board
    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (!gameId) {
      console.error("Invalid game ID:", gameId);
      return;
    }

    try {
      // Update the board state in Firestore
      const db = getFirestore();
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, { board: newBoard });
    } catch (error) {
      console.error("Failed to update board state in Firestore:", error);
      return;
    }

    // Check if the current player has won
    const winnerCombination = checkWinner(newBoard, currentPlayer);
    if (winnerCombination) {
      setGameOver(true);
      setWinningCombination(winnerCombination);
      onGameEnd(currentPlayer);
      return;
    }

    // Check again if the current player has won
    if (checkWinner(newBoard, currentPlayer)) {
      setGameOver(true);
      onGameEnd(currentPlayer);
      return;
    } else if (newBoard.every((cell) => cell)) {
      setGameOver(true);
      onGameEnd("Draw");
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
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

  // return (
  //   <View style={styles.container}>
  //     {gameState &&
  //       gameState.board.map((cell, index) => (
  //         <Cell key={index} value={cell} onPress={() => makeMove(index)} />
  //       ))}
  //     <GridLines />
  //     <WinningLine combination={winningCombination} />
  //   </View>
  // );
  return (
    <View style={styles.container}>
      {board.map((cell, index) => (
        <Cell key={index} value={cell} onPress={() => handlePress(index)} />
      ))}
      <GridLines />
      <WinningLine combination={winningCombination} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
