import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { auth } from '../firebaseConfig';
import AnimatedBackground from '../components/AnimatedBackground.js';

export default function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = () => {
        firebase
        .auth()
        .signInWithAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            onLogin(user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(errorMessage);
        })
    };

    const handleRegister = () => {
        firebase
        .auth()
        .signInWithAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            onLogin(user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            Alert.alert(errorMessage);
        })
    };

    return(
        <View style={styles.container}>
            <AnimatedBackground/>
            <Text style ={styles.header}>Tic Tac Toe</Text>
            <Text style ={styles.header}>Game</Text>
            <View style ={styles.frame}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'white'
    },
    header:{
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20
    },
    frame:{
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        width : "80%",
        alignItems: 'center',
    },
    input:{
        width: "100%",
        padding: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius:5
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',  
        backgroundColor: '#4CAF50',  
    },
    buttonText: {
        color: 'white',  
        fontWeight: 'bold'
    }
});