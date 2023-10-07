import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Cell({value, onPress}){
    return(
        <TouchableOpacity style={styles.cell} onPress={onPress}>
            <Text style={styles.text}>{value}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cell: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});