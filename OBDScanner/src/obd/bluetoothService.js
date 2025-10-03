import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { Platform, PermissionsAndroid } from 'react-native';

class BluetoothService {
  constructor() {
    this.connectedDevice = null;
    this.isScanning = false;
  }

  /**
   * Request Bluetooth permissions for Android
   */
  async requestPermissions() {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];

    const results = await PermissionsAndroid.requestMultiple(permissions);
    
    return Object.values(results).every(result => result === 'granted');
  }

  /**
   * Check if Bluetooth is enabled
   */
  async isBluetoothEnabled() {
    try {
      return await RNBluetoothClassic.isBluetoothEnabled();
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      // Return false if native module not available (running in Expo Go)
      return false;
    }
  }

  /**
   * Scan for available Bluetooth devices
   */
  async scanForDevices(timeout = 10000) {
    try {
      this.isScanning = true;
      
      // Request permissions first
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error('Bluetooth permissions not granted');
      }

      // Check if Bluetooth is enabled
      const isEnabled = await this.isBluetoothEnabled();
      if (!isEnabled) {
        // If native module not available (Expo Go), return mock devices for testing
        console.warn('Native Bluetooth not available - returning mock devices for testing');
        return [
          {
            id: 'mock-1',
            name: 'ELM327 OBD-II (Mock)',
            address: '00:11:22:33:44:55',
            isMock: true
          },
          {
            id: 'mock-2', 
            name: 'OBDLink MX (Mock)',
            address: 'AA:BB:CC:DD:EE:FF',
            isMock: true
          }
        ];
      }

      // Get bonded devices first
      const bondedDevices = await RNBluetoothClassic.getBondedDevices();
      
      // Start discovery for new devices
      const discoveredDevices = await RNBluetoothClassic.startDiscovery();
      
      // Combine and filter unique devices
      const allDevices = [...bondedDevices, ...discoveredDevices];
      const uniqueDevices = allDevices.filter((device, index, self) => 
        index === self.findIndex(d => d.address === device.address)
      );

      return uniqueDevices;
    } catch (error) {
      console.error('Error scanning for devices:', error);
      throw error;
    } finally {
      this.isScanning = false;
    }
  }

  /**
   * Connect to a Bluetooth device
   */
  async connectToDevice(device) {
    try {
      if (this.connectedDevice) {
        await this.disconnect();
      }

      console.log(`Connecting to device: ${device.name} (${device.address})`);
      
      // Handle mock devices for testing in Expo Go
      if (device.isMock) {
        console.log('Mock device connection - simulating successful connection');
        this.connectedDevice = {
          ...device,
          isConnected: true,
          write: async (data) => console.log(`Mock write: ${data}`),
          read: async () => 'MOCK_RESPONSE',
          disconnect: async () => console.log('Mock disconnect')
        };
        return this.connectedDevice;
      }
      
      const connection = await RNBluetoothClassic.connectToDevice(device.address);
      this.connectedDevice = connection;
      
      console.log('Connected successfully');
      return connection;
    } catch (error) {
      console.error('Error connecting to device:', error);
      throw error;
    }
  }

  /**
   * Disconnect from current device
   */
  async disconnect() {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.disconnect();
        this.connectedDevice = null;
        console.log('Disconnected from device');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      throw error;
    }
  }

  /**
   * Send data to connected device
   */
  async sendData(data) {
    try {
      if (!this.connectedDevice) {
        throw new Error('No device connected');
      }

      console.log(`Sending: ${data}`);
      const result = await this.connectedDevice.write(data);
      return result;
    } catch (error) {
      console.error('Error sending data:', error);
      throw error;
    }
  }

  /**
   * Read data from connected device
   */
  async readData(timeout = 5000) {
    try {
      if (!this.connectedDevice) {
        throw new Error('No device connected');
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Read timeout'));
        }, timeout);

        this.connectedDevice.read().then(data => {
          clearTimeout(timeoutId);
          console.log(`Received: ${data}`);
          resolve(data);
        }).catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error reading data:', error);
      throw error;
    }
  }

  /**
   * Send command and wait for response
   */
  async sendCommand(command, timeout = 5000) {
    try {
      await this.sendData(command);
      return await this.readData(timeout);
    } catch (error) {
      console.error('Error sending command:', error);
      throw error;
    }
  }

  /**
   * Check if device is connected
   */
  isConnected() {
    return this.connectedDevice !== null;
  }

  /**
   * Get connected device info
   */
  getConnectedDevice() {
    return this.connectedDevice;
  }
}

export default new BluetoothService();