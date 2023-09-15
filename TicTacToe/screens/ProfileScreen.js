import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import AnimatedBackground from '../components/AnimatedBackground';
import ImagePicker from 'react-native-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc} from 'firebase/firestore';
import { storage } from '../firebase';

export default function ProfileScreen({navigation}) {
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const storage = getStorage();
  const db = getFirestore();

  

  useEffect(() => {
    // Fetch user data from Firestore
  }, []);

  const handleSaveProfile = async () => {
    // Save updated profile data to Firestore
    const userDoc = doc(db, 'users', email); // Replace 'email' with the user's unique ID
    await setDoc(userDoc, {
      nickname,
      location,
      avatar
    });
  };

  const chooseImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async (response) => {
      if(response.didCancel){
        console.log('User cancelled image picker');
      } else if(response.error){
        console.log('ImagePicker error: ' , response.error);
      } else {
        const source = {uri: response.uri};
        setAvatar(source);

        // Upload to Firebase Storage
        const storageRef = ref(storage, `avatars/${email}.jpg`); // Replace 'email' with the user's unique ID
        await uploadBytes(storageRef, response.data);

        // Get download URL and store in Firestore
        const url = await getDownloadURL(storageRef);
        setAvatar({ uri: url });
      }
    });
  }


  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
    <AnimatedBackground /> 
    <View style={styles.frame}>  
      <TouchableOpacity onPress={chooseImage}>
        <Image
          source={avatar || require('./default-avatar.jpg')} // Replace './default-avatar.jpg' with your default avatar image
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
