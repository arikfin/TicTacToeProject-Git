import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Cell from "./Cell";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

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

export default function Board({ onGameEnd, onPlayerChange, makeMove, gameState }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [gameOver, setGameOver] = useState(false);
  const verticalLineHeight = useSharedValue(0);
  const horizontalLineWidth = useSharedValue(0);
  const [winningCombination, setWinningCombination] = useState(null);

  useEffect(() => {
    verticalLineHeight.value = withTiming(300, {
      duration: 1000,
      easing: Easing.linear,
    });
    horizontalLineWidth.value = withTiming(300, {
      duration: 1000,
      easing: Easing.linear,
    });
    onPlayerChange(currentPlayer);
  }, [currentPlayer]);

  const verticalAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: verticalLineHeight.value,
      top: 300 - verticalLineHeight.value,
    };
  });

  const horizontalAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: horizontalLineWidth.value,
      left: 0,
    };
  });

  const GridLines = () => {
    return (
      <>
        <Animated.View
          style={[
            styles.line,
            { width: 2, height: 300, left: 100 },
            verticalAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            { width: 2, height: 300, left: 200 },
            verticalAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            { width: 300, height: 2, top: 100 },
            horizontalAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.line,
            { width: 300, height: 2, top: 200 },
            horizontalAnimatedStyle,
          ]}
        />
      </>
    );
  };

  const handlePress = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winnerCombination = checkWinner(newBoard, currentPlayer);
    if (winnerCombination) {
      setGameOver(true);
      setWinningCombination(winnerCombination);
      onGameEnd(currentPlayer);
      return;
    }

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

    let lineStyle = {
      position: "absolute",
      backgroundColor: "red",
      height: 2,
    };

    // Horizontal Lines
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
    // Vertical Lines
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
    // Diagonal Lines
    else if (
      combination.includes(0) &&
      combination.includes(4) &&
      combination.includes(8)
    ) {
      lineStyle = {
        ...lineStyle,
        width: 2,
        height: 416,
        top: -58,
        left: 149,
        transform: [{ rotate: "-45deg" }],
      };
    } else if (
      combination.includes(2) &&
      combination.includes(4) &&
      combination.includes(6)
    ) {
      lineStyle = {
        ...lineStyle,
        width: 2,
        height: 416,
        top: -58,
        left: 149,
        transform: [{ rotate: "45deg" }],
      };
    }

    return <View style={lineStyle} />;
  };

  return (
    <View style={styles.container}>
      {gameState && gameState.board.map((cell, index) => (
        <Cell key={index} value={cell} onPress={() => makeMove(index)} />
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