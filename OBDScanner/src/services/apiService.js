// REST API service for OBDScanner mobile app
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/api';

const TOKEN_KEY = 'carlogix_token';
const USER_KEY = 'carlogix_user';

const request = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  }

  return data;
};

// Authentication
export const login = async (email, password) => {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  await AsyncStorage.setItem(TOKEN_KEY, data.token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data.user;
};

export const logout = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};

export const getStoredUser = async () => {
  const [token, userJson] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  if (token[1] && userJson[1]) {
    return JSON.parse(userJson[1]);
  }
  return null;
};

// Vehicles
export const getUserCars = async () => {
  const vehicles = await request('/vehicles');
  return vehicles.map((v) => ({
    ...v,
    brand: v.make, // backend uses "make", mobile app expects "brand"
  }));
};

// Diagnostics
export const saveDiagnostic = async (vehicleId, errorCode, mileage = null) => {
  return request('/diagnostics', {
    method: 'POST',
    body: JSON.stringify({ vehicleId, errorCode, mileage }),
  });
};
