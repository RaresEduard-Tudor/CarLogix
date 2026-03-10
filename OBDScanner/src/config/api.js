/* global __DEV__ */
import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator uses localhost directly
// Physical devices need the actual server IP/hostname
const PROD_API = 'https://carlogix-w2y7.onrender.com/api';

const API_BASE_URL = Platform.select({
  android: __DEV__ ? 'http://10.0.2.2:8080/api' : PROD_API,
  ios: __DEV__ ? 'http://localhost:8080/api' : PROD_API,
  default: PROD_API,
});

export default API_BASE_URL;
