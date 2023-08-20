import { auth } from 'firebase/auth';
import { database } from 'firebase/database';
import androidConfig from './google-services.json';
import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';


const iosConfig = {
    clientId: '120604308516-635dfv489ni1c13trj71d983eeh79jvh.apps.googleusercontent.com',
    reversedClientId: 'com.googleusercontent.apps.120604308516-635dfv489ni1c13trj71d983eeh79jvh',
    apiKey: 'AIzaSyAnpDYcES1Of4Li4s-0Rme4dqaaMYWX50g',
    gcmSenderId: '120604308516',
    plistVersion: '1',
    bundleId: 'com.arik.tictactoe',
    projectId: 'tictactoeapp-b558d',
    storageBucket: 'tictactoeapp-b558d.appspot.com',
    isAdsEnabled : false,
    isAnalyticsEnabled : false,
    isAppinviteEnabled: true,
    isGcmEnabled : true,
    isSignIn : true,
    googleAppId: '1:120604308516:ios:6f0e77adb9cce7952ad4b1'
  }
  
const config = Platform.OS === 'ios' ? iosConfig : androidConfig;


const app = initializeApp(config);


export {auth, database };















