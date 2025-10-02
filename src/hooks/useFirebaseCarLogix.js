// Firebase-integrated hook for managing CarLogix data
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { authService } from '../services/authService';
import { firebaseService } from '../services/firebaseService';

export const useFirebaseCarLogix = () => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Data state
  const [cars, setCars] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [errorCodes, setErrorCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        });
        setIsLoggedIn(true);
        
        // Load user data from Firestore
        await loadUserData(firebaseUser.uid);
      } else {
        // User is signed out
        setUser(null);
        setIsLoggedIn(false);
        setCars([]);
        setMaintenanceRecords([]);
        setErrorCodes([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load all user data from Firestore
  const loadUserData = async (userId) => {
    setLoading(true);
    try {
      // Load cars
      const carsResult = await firebaseService.getUserCars(userId);
      if (carsResult.success) {
        setCars(carsResult.data);
      }

      // Load maintenance records
      const maintenanceResult = await firebaseService.getMaintenanceRecords(userId);
      if (maintenanceResult.success) {
        setMaintenanceRecords(maintenanceResult.data);
      }

      // Load error codes
      const errorCodesResult = await firebaseService.getErrorCodes(userId);
      if (errorCodesResult.success) {
        setErrorCodes(errorCodesResult.data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Authentication functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await authService.signIn(email, password);
      if (result.success) {
        // User data will be loaded automatically by the auth state listener
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await authService.signUp(email, password, displayName);
      if (result.success) {
        // User data will be loaded automatically by the auth state listener
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      // State will be cleared automatically by the auth state listener
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  // Car management functions
  const addCar = async (carData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.createCar(carData, user.uid);
      if (result.success) {
        // Reload cars to get the updated list
        const carsResult = await firebaseService.getUserCars(user.uid);
        if (carsResult.success) {
          setCars(carsResult.data);
        }
        return { success: true, id: result.id };
      }
      return result;
    } catch (error) {
      console.error('Error adding car:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (carId, carData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.updateCar(carId, carData);
      if (result.success) {
        // Update the car in local state
        setCars(prevCars => 
          prevCars.map(car => 
            car.id === carId ? { ...car, ...carData } : car
          )
        );
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('Error updating car:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.deleteCar(carId);
      if (result.success) {
        // Remove the car from local state
        setCars(prevCars => prevCars.filter(car => car.id !== carId));
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('Error deleting car:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Maintenance record functions
  const addMaintenanceRecord = async (recordData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.createMaintenanceRecord(recordData, user.uid);
      if (result.success) {
        // Reload maintenance records
        const maintenanceResult = await firebaseService.getMaintenanceRecords(user.uid);
        if (maintenanceResult.success) {
          setMaintenanceRecords(maintenanceResult.data);
        }
        return { success: true, id: result.id };
      }
      return result;
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceRecord = async (recordId, recordData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.updateMaintenanceRecord(recordId, recordData);
      if (result.success) {
        // Update the record in local state
        setMaintenanceRecords(prevRecords => 
          prevRecords.map(record => 
            record.id === recordId ? { ...record, ...recordData } : record
          )
        );
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Error code functions
  const addErrorCode = async (errorData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.createErrorCode(errorData, user.uid);
      if (result.success) {
        // Reload error codes
        const errorCodesResult = await firebaseService.getErrorCodes(user.uid);
        if (errorCodesResult.success) {
          setErrorCodes(errorCodesResult.data);
        }
        return { success: true, id: result.id };
      }
      return result;
    } catch (error) {
      console.error('Error adding error code:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearErrorCode = async (errorId) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      const result = await firebaseService.updateErrorCode(errorId, { status: 'cleared' });
      if (result.success) {
        // Update the error code in local state
        setErrorCodes(prevErrors => 
          prevErrors.map(error => 
            error.id === errorId ? { ...error, status: 'cleared' } : error
          )
        );
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('Error clearing error code:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Mock function for scanning errors (for demo purposes)
  const scanForErrors = async (carId) => {
    // This is still a mock function for the demo
    // In a real app, this would connect to an OBD-II adapter
    const mockErrorCodes = [
      { code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected', severity: 'high' },
      { code: 'P0171', description: 'System Too Lean (Bank 1)', severity: 'moderate' },
      { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold (Bank 1)', severity: 'moderate' }
    ];

    const randomErrors = mockErrorCodes
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    const promises = randomErrors.map(error => 
      addErrorCode({
        carId,
        code: error.code,
        description: error.description,
        severity: error.severity,
        status: 'active',
        timestamp: new Date(),
        mileage: cars.find(car => car.id === carId)?.mileage || null
      })
    );

    await Promise.all(promises);
    return { success: true, errorsFound: randomErrors.length };
  };

  return {
    // Authentication state
    user,
    isLoggedIn,
    authLoading,
    loading,

    // Data
    cars,
    maintenanceRecords,
    errorCodes,

    // Authentication functions
    login,
    register,
    logout,

    // Car management
    addCar,
    updateCar,
    deleteCar,

    // Maintenance management
    addMaintenanceRecord,
    updateMaintenanceRecord,

    // Error code management
    addErrorCode,
    clearErrorCode,
    scanForErrors,

    // Utility functions
    loadUserData
  };
};