import React, {useState} from 'react';
import { SafeAreaView } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import GameScreen from './screens/GameScreen';
import {auth , database} from './firebaseConfig';



export default function App(){
  const [user, setUser] = useState(null);


  if(user) {
    return <GameScreen/>
  } else {
    return <LoginScreen onLogin={setUser}/>
  }


}
