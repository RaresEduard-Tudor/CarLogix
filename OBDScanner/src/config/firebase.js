// Firebase configuration for OBDScanner Mobile App
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  initializeAuth,
  getReactNativePersistence 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual Firebase config from the web app .env file
// Get these values from: /home/rares/projects/CarLogix/.env
const firebaseConfig = {
  apiKey: "AIzaSyCaUP9n0X1C1xmXVbtk-UuT3hp4EptTKak",
  authDomain: "carlogix-530d3.firebaseapp.com",
  projectId: "carlogix-530d3",
  storageBucket: "carlogix-530d3.firebasestorage.app",
  messagingSenderId: "435902041045",
  appId: "1:435902041045:web:e050746923ff6b86624b5c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;
