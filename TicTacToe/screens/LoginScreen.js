import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import AnimatedBackground from "../components/AnimatedBackground.js";
import {
  app,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  User,
  signOut,
  onAuthStateChanged,
  auth,
  sendPasswordResetEmail,
} from "../firebase.js";

export default function LoginScreen({
  onLogin,
  fontsLoaded,
  navigation,
  user,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState(user ? user.uid : null);

  // Getting the auth object from Firebase
  const auth = getAuth();

  // useEffect hook to handle user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in");
        setUserID(user.uid);
        navigation.navigate("GameModeSelection");
      }
    });
    return unsubscribe;
  }, []);

  // Function to handle login
  const handleLogin = () => {
    // If email or password is empty, show an alert
    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    // Attempt to sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user ID:", user.uid);
        navigation.navigate("GameModeSelection");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
          case "auth/wrong-password":
            Alert.alert(
              "Error",
              "Invalid email or password. Please try again."
            );
            break;
          default:
            Alert.alert("Error", "An error occurred. Please try again.");
            break;
        }
      });
  };

  // Function to handle forgot password
  const handleForgotPassword = () => {
    if (email === "") {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Success",
          "Password reset email sent. Please check your inbox."
        );
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
            Alert.alert("Error", "Invalid email. Please try again.");
            break;
          default:
            Alert.alert("Error", "An error occurred. Please try again.");
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      {fontsLoaded && (
        <View style={styles.headerBackground}>
          <Text style={styles.header}>Tic Tac Toe</Text>
          <Text style={styles.header}>Game</Text>
        </View>
      )}
      <View style={styles.frame}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  headerBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 40,
    marginBottom: 20,
    fontFamily: "Righteous_400Regular",
    color: "#FFBC42",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  frame: {
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 10,
    backgroundColor: "white",
    padding: 16,
    width: "80%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    marginTop: 15,
  },
});
