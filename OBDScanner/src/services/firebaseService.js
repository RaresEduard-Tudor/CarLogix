// Firebase service for OBDScanner
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Authentication
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Car Management
export const getUserCars = async (userId) => {
  try {
    const carsRef = collection(db, 'cars');
    const q = query(carsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const cars = [];
    querySnapshot.forEach((doc) => {
      cars.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, cars };
  } catch (error) {
    console.error('Get cars error:', error);
    return { success: false, error: error.message, cars: [] };
  }
};

// Error Code Management
export const saveErrorCodes = async (userId, carId, carName, codes, mileage = null) => {
  try {
    const errorCodesRef = collection(db, 'errorCodeScans');
    
    const scanData = {
      userId,
      carId,
      carName,
      timestamp: serverTimestamp(),
      codes: codes.map(code => ({
        code: code.code || code,
        description: code.description || getErrorCodeDescription(code.code || code),
        type: getErrorCodeType(code.code || code)
      })),
      mileage,
      status: 'active',
      resolvedAt: null,
      notes: ''
    };
    
    const docRef = await addDoc(errorCodesRef, scanData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Save error codes error:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get error code description
const getErrorCodeDescription = (code) => {
  const descriptions = {
    'P0171': 'System Too Lean (Bank 1)',
    'P0174': 'System Too Lean (Bank 2)',
    'P0420': 'Catalyst System Efficiency Below Threshold (Bank 1)',
    'P0430': 'Catalyst System Efficiency Below Threshold (Bank 2)',
    'P0300': 'Random/Multiple Cylinder Misfire Detected',
    'P0301': 'Cylinder 1 Misfire Detected',
    'P0302': 'Cylinder 2 Misfire Detected',
    'P0303': 'Cylinder 3 Misfire Detected',
    'P0304': 'Cylinder 4 Misfire Detected',
    'P0442': 'Evaporative Emission Control System Leak Detected (Small Leak)',
    'P0455': 'Evaporative Emission Control System Leak Detected (Large Leak)',
    'P0128': 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)',
    'P0401': 'Exhaust Gas Recirculation Flow Insufficient Detected',
  };
  
  return descriptions[code] || 'Unknown Error Code';
};

// Helper function to get error code type
const getErrorCodeType = (code) => {
  if (!code) return 'Unknown';
  
  const firstChar = code.charAt(0);
  const types = {
    'P': 'Powertrain',
    'C': 'Chassis',
    'B': 'Body',
    'U': 'Network'
  };
  
  return types[firstChar] || 'Unknown';
};
