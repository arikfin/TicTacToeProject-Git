import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Cell from './Cell';

export default function Board({ onGameEnd }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameOver, setGameOver] = useState(false);

    const handlePress = (index) => {
        if (board[index] || gameOver) return;

        const newBoard = board.slice();
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        if(checkWinner(newBoard, currentPlayer)) {
            setGameOver(true);
            onGameEnd(currentPlayer);
            return;
        } else if (newBoard.every(cell => cell)) {
            setGameOver(true);
            onGameEnd('Draw');
            return;
        }

        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    };

    const checkWinner = (board, player) => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]  // diagonals
        ];

        return winningCombinations.some(combinations =>{
            return combinations.every(index => board[index] === player);
        });
    };

    return (
        <View style={styles.container}>
            {board.map((cell, index) => (
                <Cell key={index} value={cell} onPress={() => handlePress(index)} />
            ))}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    }
});