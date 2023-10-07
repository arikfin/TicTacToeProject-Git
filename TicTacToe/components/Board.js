import React, { useState, useEffect  } from "react";
import { View, StyleSheet } from "react-native";
import Cell from './Cell';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";


export default function Board({ onGameEnd }) {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameOver, setGameOver] = useState(false);
    const verticalLineHeight = useSharedValue(0);
    const horizontalLineWidth = useSharedValue(0);

    useEffect(() => {
        verticalLineHeight.value = withTiming(300, { duration: 1000, easing: Easing.linear });
        horizontalLineWidth.value = withTiming(300, { duration: 1000, easing: Easing.linear });
    }, []);

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
                <Animated.View style={[styles.line, { width: 2, height: 300, left: 100 }, verticalAnimatedStyle]} />
                <Animated.View style={[styles.line, { width: 2, height: 300, left: 200 }, verticalAnimatedStyle]} />
                <Animated.View style={[styles.line, { width: 300, height: 2, top: 100 }, horizontalAnimatedStyle]} />
                <Animated.View style={[styles.line, { width: 300, height: 2, top: 200 }, horizontalAnimatedStyle]} />
            </>
        );
    }

    
    
    

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
            <GridLines />
        </View>
    );

}



const styles = StyleSheet.create({
    container: {
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,  // This is for Android
    },
    line: {
        position: "absolute",
        backgroundColor: "black",
    },
});