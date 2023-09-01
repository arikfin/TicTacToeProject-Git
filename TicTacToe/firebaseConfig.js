import { auth } from 'firebase/auth';
import { database } from 'firebase/database';
import androidConfig from './google-services.json';
import { initializeApp } from 'firebase/app';
import { Platform } from 'react-native';


const iosConfig = {
    CLIENT_ID: '120604308516-635dfv489ni1c13trj71d983eeh79jvh.apps.googleusercontent.com',
    REVERSED_CLIENT_ID: 'com.googleusercontent.apps.120604308516-635dfv489ni1c13trj71d983eeh79jvh',
    API_KEY: 'AIzaSyAnpDYcES1Of4Li4s-0Rme4dqaaMYWX50g',
    GCM_SENDER_ID: '120604308516',
    PLIST_VERSION: '1',
    BUNDLE_ID: 'com.arik.tictactoe',
    PROJECT_ID: 'tictactoeapp-b558d',
    STORAGE_BUCKET: 'tictactoeapp-b558d.appspot.com',
    IS_ADS_ENABLED : false,
    IS_ANALYTICS_ENABLED : false,
    IS_APPINVITE_ENABLED: true,
    IS_GCM_ENABLED : true,
    IS_SIGNIN_ENABLED : true,
    GOOGLE_APP_ID: '1:120604308516:ios:6f0e77adb9cce7952ad4b1'
  }
  
const config = Platform.OS === 'ios' ? iosConfig : androidConfig;


const app = initializeApp(config);


export {auth , database };


