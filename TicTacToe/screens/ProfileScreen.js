import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc} from 'firebase/firestore';
import { storage, auth } from '../firebase';
import defaultAvatar from '../assets/ORF8060.jpg';
import { onAuthStateChanged } from 'firebase/auth';

export default function ProfileScreen({navigation, user}) {
  console.log("ProfileScreen rendered");
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [userID, setUserID] = useState(user ? user.uid : null);


  const db = getFirestore();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed");
      if (user) {
        console.log("User is signed in:", user);
        await setUserID(user.uid);
        console.log("UserID set in useEffect:", user.uid);
      } else {
        console.log("No user is signed in.");
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleSaveProfile = async () => {
    console.log("UserID in handleSaveProfile:", userID); 
    if (userID) {  // Check if userID is not null
      const userDoc = doc(db, 'users', userID);
      await setDoc(userDoc, {
        nickname,
        location,
        avatar
      });
    } else {
      // Handle the case where userID is null
      console.log("User ID is null. Cannot save profile.");
    }
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
  
      // Check if user is signed in before uploading image
      if (userID) {
        //Upload to Firebase Storage
        const storageRef = ref(storage, `avatars/${userID}.jpg`);
        const response = await fetch(uri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);
  
        // Get download URL and store in Firestore
        const url = await getDownloadURL(storageRef);
        setAvatar(url);
  
        console.log("New avatar URL:", avatar);
      } else {
        console.log("User is not signed in. Cannot upload image.");
      }
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
      <Button title="Set Test UserID" onPress={() => setUserID("testUserID")} />
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
