import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc} from 'firebase/firestore';
import { storage, auth } from '../firebase';
import defaultAvatar from '../assets/ORF8060.jpg';
import { onAuthStateChanged } from 'firebase/auth';
import { createUserWithEmailAndPassword, getAuth } from '../firebase.js';

export default function ProfileScreen({navigation, user}) {
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [userID, setUserID] = useState(user ? user.uid : null);


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
      if(avatar){
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
  
  
  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
  
    if (!result.canceled) {
      const { assets } = result;
      const uri = assets[0].uri;
      setAvatar(uri);
    }
  };

  


  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
    <AnimatedBackground /> 
    <View style={styles.frame}>  
      <TouchableOpacity onPress={chooseImage}>
        <Image
          source={avatar ? { uri: avatar } : defaultAvatar} // Replace './default-avatar.jpg' with your default avatar image
          style={styles.avatar}
        />
      </TouchableOpacity>
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
    width : "80%",
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
    width: 100,
    height: 100,
    borderRadius: 50,
  }

});
