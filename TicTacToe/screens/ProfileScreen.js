import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, Image, ScrollView, Modal, FlatList } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { storage, auth, firebase } from '../firebase';
import defaultAvatar from '../assets/ORF8060.jpg';
import { onAuthStateChanged } from 'firebase/auth';
import { createUserWithEmailAndPassword, getAuth } from '../firebase.js';
import avatar1 from '../assets/avatars/black-female.jpg';
import avatar2 from '../assets/avatars/black-male.jpg';
import avatar3 from '../assets/avatars/blonde-female.jpg';
import avatar4 from '../assets/avatars/blonde-male.jpg';
import avatar5 from '../assets/avatars/hipster-female.jpg';
import avatar6 from '../assets/avatars/hipster-male.jpg';
import avatar7 from '../assets/avatars/white-female.jpg';
import avatar8 from '../assets/avatars/white-male.jpg';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8];


export default function ProfileScreen({ navigation, user }) {
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [userID, setUserID] = useState(user ? user.uid : null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getAvatarIdentifier = (index) => {
    return `avatar${index + 1}`; // This will give you 'avatar1', 'avatar2', etc.
  };

  const auth = getAuth();
  const db = getFirestore();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in");
        setUserID(user.uid);
        navigation.navigate('GameModeSelection');
      } else {
        console.log("No user is signed in.");
        setUserID(null);
      }
    });
    return unsubscribe;
  }, []);


  const handleSaveProfile = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userDoc = doc(db, 'users', user.uid);
        return setDoc(userDoc, {
          nickname,
          location,
        });
      })
      .then(async () => {
        if (avatar) {
          const storageRef = ref(storage, `avatars/${auth.currentUser.uid}.jpg`);
          const response = await fetch(selectedImageUri);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);

          const url = await getDownloadURL(storageRef);
          const userDoc = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userDoc, { avatar: url });
        }
      })
      .catch((error) => {
        console.log("Error:", error);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This email is already in use. Please use a different email.');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };


  // const chooseImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1
  //   });

  //   if (!result.canceled) {
  //     const { assets } = result;
  //     const uri = assets[0].uri;
  //     setAvatar(uri);
  //   }
  // };

  // const handleAvatarSelect = (avatar) => {
  //   setSelectedAvatar(avatar);
  //   setIsModalVisible(false);
  //   // Update avatar state and Firebase profile
  // };

  const handleAvatarSelect = (index) => {
    const avatarIdentifier = getAvatarIdentifier(index);
    setSelectedAvatar(avatars[index]); // Directly set the avatar image

    // Save avatarIdentifier to Firebase
    const user = getAuth().currentUser;
    if (user) {
      const userDocRef = doc(getFirestore(), 'users', user.uid);
      setDoc(userDocRef, { avatar: avatarIdentifier }, { merge: true });
    }

    setIsModalVisible(false);
  };



  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={styles.frame}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image
            source={selectedAvatar || defaultAvatar}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <FlatList
                data={avatars}
                renderItem={({ item, index }) => (
                  <TouchableOpacity key={index} onPress={() => handleAvatarSelect(index)}>
                    <Image source={item} style={styles.modalAvatar} />
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
          placeholder='Nick Name'
          value={nickname}
          onChangeText={setNickname}
        />
        <TextInput
          style={styles.input}
          placeholder='Location'
          value={location}
          onChangeText={setLocation}
        />
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
          onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={handleGoBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  frame: {
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 16,
    width: "80%",
    alignItems: 'center',
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
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
  },
  goBackButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF5733',  // Different color for the "Go Back" button
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 25,
    margin: 5,
  },
  avatarsList: {
    justifyContent: 'center',
    padding: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%', // Adjust as needed
    height: '60%', // Adjust as needed
    backgroundColor: '#f0f0f0', // Greyish background
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },

});
