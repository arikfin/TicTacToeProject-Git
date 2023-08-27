import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Svg, Text } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NUM_ELEMENTS = 20; // Number of falling X's and O's

export default function AnimatedBackground() {
    const animatedValues = [];

    // Initialize animated values for each X or O
    for (let i = 0; i < NUM_ELEMENTS; i++) {
        animatedValues.push({
            translateY: new Animated.Value(-50), // Start above the screen
            rotate: new Animated.Value(0),
        });
    }

    const renderShapes = () => {
        let shapes = [];
        for (let i = 0; i < NUM_ELEMENTS; i++) {
            const isX = Math.random() > 0.5;
            const xOffset = Math.random() * SCREEN_WIDTH;
            const translateY = animatedValues[i].translateY;
            const rotate = animatedValues[i].rotate;
            shapes.push(
                renderShape(isX, xOffset, i, translateY, rotate)
            );
        }
        return shapes;
    };
    
    const renderShape = (isX, xOffset, key, translateY, rotate) => {
        return (
            <Animated.View key={key} style={{
                    ...styles.svgElement,
                    left: xOffset,
                    transform: [
                        { translateY: translateY },
                        { rotate: rotate.interpolate({
                            inputRange: [0, 360],
                            outputRange: ['0deg', '360deg'],
                          }) }
                    ]
                }}>
                <Icon name={isX ? "times" : "circle-o"} size={50} color="#E8F0FF" />
            </Animated.View>
        );
    };

    useEffect(() => {
        const fallingAnimations = animatedValues.map((value) => {
            return Animated.loop(
                Animated.timing(value.translateY, {
                    toValue: SCREEN_HEIGHT + 50, // End below the screen
                    duration: Math.random() * 5000 + 5000,
                    useNativeDriver: true
                })
            );
        });

        const rotationAnimations = animatedValues.map((value) => {
            return Animated.loop(
                Animated.timing(value.rotate, {
                    toValue: 360,
                    duration: 2000,
                    useNativeDriver: true
                })
            );
        });

        Animated.stagger(500, fallingAnimations).start();
        Animated.parallel(rotationAnimations).start(); // Start rotation animations in parallel

    }, []);

    return (
        <View style={styles.container}>
            {renderShapes()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0496FF',
    },
    svgElement: {
        position: 'absolute',
        zIndex: 1,
    },
});
