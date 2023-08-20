import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet,Dimensions ,Easing  } from 'react-native';
import { Svg, Text } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NUM_ROWS = 5;
const NUM_COLUMNS = 5;
const CELL_WIDTH = SCREEN_WIDTH / NUM_COLUMNS;
const CELL_HEIGHT = SCREEN_HEIGHT / (NUM_ROWS + 1); // +1 to account for the entire screen height



export default function AnimatedBackground() {
    const fadeAnim = useRef(new Animated.Value(0)).current;


    const animatedValues = [];

    // Initialize animated values for each X or O
    for (let i = 0; i < NUM_ROWS * NUM_COLUMNS; i++) {
        animatedValues.push({
            translateY: new Animated.Value(0),
            translateX: new Animated.Value(0)
        });
    }


    const renderShapes = () => {
        let shapes = [];
        for(let row = 0; row < NUM_ROWS; row++) {
            for(let col = 0; col < NUM_COLUMNS; col++) {
                const xOffset = col * CELL_WIDTH - CELL_WIDTH; // Start off-screen to the left
                const yOffset = row * CELL_HEIGHT;
                const index = row * NUM_COLUMNS + col;
                const isX = Math.random() > 0.5;
                // Original set
                shapes.push(renderShape(isX, xOffset, yOffset, `${row}-${col}-original`, animatedValues[index].translateX));
                // Duplicated set (off-screen to the left)
                shapes.push(renderShape(isX, xOffset - SCREEN_WIDTH, yOffset, `${row}-${col}-duplicate`, animatedValues[index].translateX));
            }
        }
        return shapes;
    };

    const renderShape = (isX, xOffset, yOffset, key, translateX) => {
        return (
            <Animated.View key={key} style={{
                    ...styles.svgElement,
                    top: yOffset,
                    left: xOffset,
                    transform:[
                        {translateX: translateX}
                    ] 
                }}
                    >
    
                <Svg height="50" width="50">
                    <Text
                        fill='white'
                        stroke='none'
                        fontSize='24'
                        x='25'
                        y='25'
                        textAnchor='middle'
                        dy='.3em'
                    >
                        {isX ? 'X' : 'O'}
                    </Text>
                </Svg>
            </Animated.View>
        );
    };


    useEffect(() => {
        const animations = animatedValues.map((value) => {
            return Animated.loop(
                Animated.timing(value.translateX, {
                    toValue: SCREEN_WIDTH,
                    duration: 5000,
                    easing: Easing.linear, // Constant speed
                    useNativeDriver: true
                })
            );
        });
    
        Animated.parallel(animations).start();
    }, []);
    


    return (
        <View style={styles.container}>
            {renderShapes()}
            <Animated.View style={{ ...styles.overlay, opacity: fadeAnim }} />
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
        backgroundColor: '#66D7D1', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    svgElement: {
        position: 'absolute',
        zIndex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 0,
        backgroundColor: 'blue',
    },
});


