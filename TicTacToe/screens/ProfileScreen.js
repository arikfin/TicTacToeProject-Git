import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  FlatList,
} from "react-native";
import AnimatedBackground from "../components/AnimatedBackground";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { storage } from "../firebase";
import defaultAvatar from "../assets/ORF8060.jpg";
import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword, getAuth } from "../firebase.js";
import avatar1 from "../assets/avatars/black-female.jpg";
import avatar2 from "../assets/avatars/black-male.jpg";
import avatar3 from "../assets/avatars/blonde-female.jpg";
import avatar4 from "../assets/avatars/blonde-male.jpg";
import avatar5 from "../assets/avatars/hipster-female.jpg";
import avatar6 from "../assets/avatars/hipster-male.jpg";
import avatar7 from "../assets/avatars/white-female.jpg";
import avatar8 from "../assets/avatars/white-male.jpg";

const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
];

const avatarUrls = [
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblack-female.jpg?alt=media&token=50529a12-7172-47e9-8209-e32e446b9c69',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblack-male.jpg?alt=media&token=0e6ad8a6-6c30-48d2-aed0-87e83f532f4e',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblonde-female.jpg?alt=media&token=97218cc7-e989-4d15-a49b-0dd00b1a1246',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fblonde-male.jpg?alt=media&token=ec758017-d1b7-42f0-a7fa-a67bd6e8532e',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fhipster-female.jpg?alt=media&token=e5449abe-038a-4b7f-8883-9822eba8d8f3',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fhipster-male.jpg?alt=media&token=1e683a8d-f416-4c05-b091-d61520f189b7',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fwhite-female.jpg?alt=media&token=fc7b4b18-2399-43d4-a90e-f547320965c7',
  'https://firebasestorage.googleapis.com/v0/b/tictactoeapp-b558d.appspot.com/o/avatars%2Fwhite-male.jpg?alt=media&token=6ef9ad2c-dafc-4867-9905-135cb4f9bc09',
]

export default function ProfileScreen({ navigation, user }) {


  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState(user ? user.uid : null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);





  const auth = getAuth();
  const db = getFirestore();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        console.log("User is signed in");
        setUserID(user.uid);
        navigation.navigate("GameModeSelection");
      } else {
        console.log("No user is signed in.");
        setUserID(null);
      }
    });
    return unsubscribe;
  }, []);




  const handleSaveProfile = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        avatar: selectedAvatar,
        email,
        location,
        nickname,
      });

      if (selectedAvatar) {
        // Save the avatar data to Firebase Storage
        const avatarRef = ref(storage, `avatars/${user.uid}.jpg`);
        const avatarIndex = avatars.indexOf(selectedAvatar); // Get index of the selected avatar
        const avatarPath = `../assets/avatars/avatar${avatarIndex + 1}.jpg`; // Construct the path
        const response = await fetch(avatarPath);
        const blob = await response.blob();
        await uploadBytes(avatarRef, blob);

        // Get the download URL and update the user's profile
        const avatarUrl = await getDownloadURL(avatarRef);
        await updateDoc(doc(db, "users", user.uid), {
          avatar: avatarUrl,
        });
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Error",
          "This email is already in use. Please use a different email."
        );
      }
    }
  };




  const handleAvatarSelect = (index) => {
    setSelectedAvatar(avatarUrls[index]); // Save the URL of the selected avatar
    setIsModalVisible(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={styles.frame}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image source={selectedAvatar ? { uri: selectedAvatar } : defaultAvatar} style={styles.avatar} />

        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={avatars}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleAvatarSelect(index)}
                  >
                    <Image source={avatars[index]} style={styles.modalAvatar} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // Two columns
              />
            </View>
          </View>
        </Modal>
        <TextInput
          style={styles.input}
          placeholder="Nick Name"
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
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
        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goBackButton} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Go Back</Text>
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
  goBackButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5733",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 25,
    margin: 5,
  },
  avatarsList: {
    justifyContent: "center",
    padding: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "60%",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
});
