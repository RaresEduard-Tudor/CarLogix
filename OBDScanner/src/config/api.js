/* global __DEV__ */
import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator uses localhost directly
// Physical devices need the actual server IP/hostname
const API_BASE_URL = Platform.select({
  android: __DEV__ ? 'http://10.0.2.2:8080/api' : 'https://your-production-server.com/api',
  ios: __DEV__ ? 'http://localhost:8080/api' : 'https://your-production-server.com/api',
  default: 'http://localhost:8080/api',
});

export default API_BASE_URL;
