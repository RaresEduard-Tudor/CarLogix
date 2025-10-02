import { useState, useEffect } from 'react';
import { 
  mockUser, 
  mockCar, 
  mockMaintenanceRecords, 
  mockErrorCodes,
  sampleErrorCodes 
} from '../data/mockData';

// Custom hook for managing CarLogix data
export const useCarLogix = () => {
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [errorCodes, setErrorCodes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    // Load mock data - in future this would come from API/Firebase
    setUser(mockUser);
    setCars([mockCar]);
    setMaintenanceRecords(mockMaintenanceRecords);
    setErrorCodes(mockErrorCodes);
  }, []);

  // Mock login function
  const login = () => {
    // In MVP 1, we just accept any credentials
    setIsLoggedIn(true);
    return Promise.resolve({ success: true });
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Car management functions
  const addCar = (carData) => {
    const newCar = {
      ...carData,
      id: `car-${Date.now()}`,
      addedDate: new Date().toISOString().split('T')[0],
      owners: [user.id]
    };
    setCars(prev => [...prev, newCar]);
    return newCar;
  };

  const updateCar = (carId, updates) => {
    setCars(prev => prev.map(car => 
      car.id === carId ? { ...car, ...updates } : car
    ));
  };

  // Maintenance record functions
  const addMaintenanceRecord = (recordData) => {
    const newRecord = {
      ...recordData,
      id: `maint-${Date.now()}`,
      date: recordData.date || new Date().toISOString().split('T')[0]
    };
    setMaintenanceRecords(prev => [...prev, newRecord]);
    return newRecord;
  };

  const getMaintenanceRecords = (carId) => {
    return maintenanceRecords.filter(record => record.carId === carId);
  };

  // Error code functions
  const addErrorCode = (errorData) => {
    const newError = {
      ...errorData,
      id: `error-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    setErrorCodes(prev => [...prev, newError]);
    return newError;
  };

  const getErrorCodes = (carId) => {
    return errorCodes.filter(error => error.carId === carId);
  };

  const clearErrorCode = (errorId) => {
    setErrorCodes(prev => prev.map(error => 
      error.id === errorId ? { ...error, status: 'cleared' } : error
    ));
  };

  // Mock OBD-II scanner function
  const scanForErrors = (carId) => {
    return new Promise((resolve) => {
      // Simulate scanning delay
      setTimeout(() => {
        // Randomly return 0-2 error codes
        const numErrors = Math.floor(Math.random() * 3);
        const foundErrors = [];
        
        for (let i = 0; i < numErrors; i++) {
          const randomError = sampleErrorCodes[Math.floor(Math.random() * sampleErrorCodes.length)];
          const errorData = {
            carId,
            code: randomError.code,
            description: randomError.description,
            severity: randomError.severity,
            mileage: cars.find(car => car.id === carId)?.mileage || 0
          };
          const newError = addErrorCode(errorData);
          foundErrors.push(newError);
        }
        
        resolve(foundErrors);
      }, 2000); // 2 second delay to simulate scanning
    });
  };

  return {
    // State
    user,
    cars,
    maintenanceRecords,
    errorCodes,
    isLoggedIn,
    
    // Auth functions
    login,
    logout,
    
    // Car functions
    addCar,
    updateCar,
    
    // Maintenance functions
    addMaintenanceRecord,
    getMaintenanceRecords,
    
    // Error code functions
    addErrorCode,
    getErrorCodes,
    clearErrorCode,
    scanForErrors
  };
};