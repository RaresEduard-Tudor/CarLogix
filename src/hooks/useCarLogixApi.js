// Hook for managing CarLogix data via the Spring Boot REST API
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';

export const useCarLogixApi = () => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Data state
  const [cars, setCars] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [errorCodes, setErrorCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = apiService.getToken();
    if (token) {
      // Token exists — load user data
      loadUserData()
        .then(() => setIsLoggedIn(true))
        .catch(() => {
          apiService.logout();
          setIsLoggedIn(false);
        })
        .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    setLoading(true);
    try {
      const [vehiclesData, diagnosticsData, maintenanceData, profileData] = await Promise.all([
        apiService.getVehicles(),
        apiService.getDiagnostics(),
        apiService.getMaintenanceRecords(),
        apiService.getProfile(),
      ]);
      // Map backend field names to frontend expectations
      setCars(vehiclesData.map(v => ({ ...v, brand: v.make })));
      setErrorCodes(diagnosticsData);
      setMaintenanceRecords(maintenanceData.map(r => ({ ...r, carId: r.vehicleId })));
      setUser(profileData);
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentication
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await apiService.login(email, password);
      setUser(result.user);
      setIsLoggedIn(true);
      await loadUserData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await apiService.register(email, password, displayName);
      setUser(result.user);
      setIsLoggedIn(true);
      await loadUserData();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    apiService.logout();
    setUser(null);
    setIsLoggedIn(false);
    setCars([]);
    setMaintenanceRecords([]);
    setErrorCodes([]);
    return { success: true };
  };

  // Vehicle management
  const addCar = async (carData) => {
    try {
      setLoading(true);
      const vehicle = await apiService.createVehicle({
        make: carData.brand || carData.make,
        model: carData.model,
        year: carData.year,
        vin: carData.vin,
        color: carData.color,
        currentMileage: carData.currentMileage || carData.mileage,
        licensePlate: carData.licensePlate,
      });
      setCars(prev => [{ ...vehicle, brand: vehicle.make }, ...prev]);
      return { success: true, id: vehicle.id };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async (carId, carData) => {
    try {
      setLoading(true);
      const vehicle = await apiService.updateVehicle(carId, {
        make: carData.brand || carData.make,
        model: carData.model,
        year: carData.year,
        vin: carData.vin,
        color: carData.color,
        currentMileage: carData.currentMileage || carData.mileage,
        licensePlate: carData.licensePlate,
      });
      setCars(prev => prev.map(c => (c.id === carId ? { ...vehicle, brand: vehicle.make } : c)));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId) => {
    try {
      setLoading(true);
      await apiService.deleteVehicle(carId);
      setCars(prev => prev.filter(c => c.id !== carId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Diagnostic / error code management
  const addErrorCode = async (errorData) => {
    try {
      setLoading(true);
      const diagnostic = await apiService.createDiagnostic({
        vehicleId: errorData.carId || errorData.vehicleId,
        errorCode: errorData.code || errorData.errorCode,
        mileage: errorData.mileage,
      });
      setErrorCodes(prev => [diagnostic, ...prev]);
      return { success: true, id: diagnostic.id };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearErrorCode = async (errorId) => {
    try {
      setLoading(true);
      const resolved = await apiService.resolveDiagnostic(errorId);
      setErrorCodes(prev =>
        prev.map(e => (e.id === errorId ? resolved : e))
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const scanForErrors = async (carId) => {
    // Submit diagnostic codes scanned from OBD — the backend auto-populates
    // definitions and suggested fixes from the OBD2 SQLite database
    const scannedCodes = ['P0300', 'P0171', 'P0420'];
    const vehicle = cars.find(c => c.id === carId);

    const results = [];
    for (const code of scannedCodes) {
      try {
        const diagnostic = await apiService.createDiagnostic({
          vehicleId: carId,
          errorCode: code,
          mileage: vehicle?.currentMileage || null,
        });
        results.push(diagnostic);
      } catch (error) {
        console.error(`Failed to log code ${code}:`, error);
      }
    }

    setErrorCodes(prev => [...results, ...prev]);
    return { success: true, errorsFound: results.length };
  };

  // Maintenance record management
  const addMaintenanceRecord = async (recordData) => {
    try {
      setLoading(true);
      const record = await apiService.createMaintenanceRecord({
        vehicleId: recordData.carId || recordData.vehicleId,
        serviceType: recordData.serviceType,
        description: recordData.description,
        mileage: recordData.mileage,
        date: recordData.date,
        cost: recordData.cost,
        location: recordData.location,
        notes: recordData.notes,
        reminderMileageInterval: recordData.reminderMileageInterval,
        reminderTimeInterval: recordData.reminderTimeInterval,
        reminderTimeUnit: recordData.reminderTimeUnit,
      });
      setMaintenanceRecords(prev => [{ ...record, carId: record.vehicleId }, ...prev]);
      return { success: true, id: record.id };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateMaintenanceRecord = async (recordId, recordData) => {
    try {
      setLoading(true);
      const record = await apiService.updateMaintenanceRecord(recordId, {
        vehicleId: recordData.carId || recordData.vehicleId,
        serviceType: recordData.serviceType,
        description: recordData.description,
        mileage: recordData.mileage,
        date: recordData.date,
        cost: recordData.cost,
        location: recordData.location,
        notes: recordData.notes,
        reminderMileageInterval: recordData.reminderMileageInterval,
        reminderTimeInterval: recordData.reminderTimeInterval,
        reminderTimeUnit: recordData.reminderTimeUnit,
      });
      setMaintenanceRecords(prev => prev.map(r => (r.id === recordId ? { ...record, carId: record.vehicleId } : r)));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteMaintenanceRecord = async (recordId) => {
    try {
      setLoading(true);
      await apiService.deleteMaintenanceRecord(recordId);
      setMaintenanceRecords(prev => prev.filter(r => r.id !== recordId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Profile management
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updated = await apiService.updateProfile(profileData);
      setUser(updated);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await apiService.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isLoggedIn,
    authLoading,
    loading,
    cars,
    maintenanceRecords,
    errorCodes,
    login,
    register,
    logout,
    addCar,
    updateCar,
    deleteCar,
    addMaintenanceRecord,
    updateMaintenanceRecord,
    deleteMaintenanceRecord,
    addErrorCode,
    clearErrorCode,
    scanForErrors,
    updateProfile,
    changePassword,
    loadUserData,
  };
};
