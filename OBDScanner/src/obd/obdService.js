import BluetoothService from './bluetoothService';

class OBDService {
  constructor() {
    this.isInitialized = false;
    this.supportedPIDs = new Set();
  }

  /**
   * Initialize OBD connection and ELM327 adapter
   */
  async initialize(device) {
    try {
      // Connect to the device
      await BluetoothService.connectToDevice(device);
      
      // Initialize ELM327 adapter
      await this.initializeELM327();
      
      // Check supported PIDs
      await this.checkSupportedPIDs();
      
      this.isInitialized = true;
      console.log('OBD service initialized successfully');
    } catch (error) {
      console.error('Error initializing OBD service:', error);
      throw error;
    }
  }

  /**
   * Initialize ELM327 adapter with standard commands
   */
  async initializeELM327() {
    const initCommands = [
      'ATZ',      // Reset adapter
      'ATE0',     // Echo off
      'ATL0',     // Linefeeds off
      'ATS0',     // Spaces off
      'ATH1',     // Headers on
      'ATSP0',    // Set protocol to auto
    ];

    for (const command of initCommands) {
      try {
        const response = await BluetoothService.sendCommand(command + '\\r', 3000);
        console.log(`${command}: ${response}`);
        
        // Wait a bit between commands
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to send ${command}:`, error);
        // Continue initialization even if some commands fail (for mock devices)
      }
    }
  }

  /**
   * Check which PIDs are supported by the vehicle
   */
  async checkSupportedPIDs() {
    try {
      // Check PIDs 01-20 support
      const response = await this.sendOBDCommand('0100');
      if (response && response.length >= 8) {
        const supportData = response.replace(/\\s/g, '').substring(4);
        this.parseSupportedPIDs(supportData, 1);
      }
    } catch (error) {
      console.warn('Could not check supported PIDs:', error);
    }
  }

  /**
   * Parse supported PIDs from response
   */
  parseSupportedPIDs(data, baseNumber) {
    try {
      const hex = parseInt(data, 16);
      for (let i = 0; i < 32; i++) {
        if (hex & (1 << (31 - i))) {
          this.supportedPIDs.add(baseNumber + i);
        }
      }
    } catch (error) {
      console.warn('Error parsing supported PIDs:', error);
    }
  }

  /**
   * Send OBD command and get response
   */
  async sendOBDCommand(command, timeout = 5000) {
    try {
      if (!BluetoothService.isConnected()) {
        throw new Error('Not connected to OBD device');
      }

      const response = await BluetoothService.sendCommand(command + '\\r', timeout);
      return this.parseOBDResponse(response);
    } catch (error) {
      console.error(`Error sending OBD command ${command}:`, error);
      throw error;
    }
  }

  /**
   * Parse OBD response and clean it up
   */
  parseOBDResponse(response) {
    if (!response) return null;
    
    // Remove common prefixes and clean up
    let cleaned = response
      .replace(/^>/, '')           // Remove prompt
      .replace(/\\r/g, '')         // Remove carriage returns
      .replace(/\\n/g, ' ')        // Replace newlines with spaces
      .replace(/\\s+/g, ' ')       // Normalize spaces
      .trim();
    
    // Check for errors
    if (cleaned.includes('NO DATA') || 
        cleaned.includes('ERROR') || 
        cleaned.includes('UNABLE TO CONNECT')) {
      throw new Error(`OBD Error: ${cleaned}`);
    }
    
    return cleaned;
  }

  /**
   * Read diagnostic trouble codes (DTCs)
   */
  async readDTCs() {
    try {
      // Check if we're using a mock device (for Expo Go testing)
      const connectedDevice = BluetoothService.getConnectedDevice();
      if (connectedDevice && connectedDevice.isMock) {
        // Return mock DTCs for testing
        console.log('Using mock DTCs for testing');
        return [
          {
            code: 'P0420',
            description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
            severity: 'medium'
          },
          {
            code: 'P0171', 
            description: 'System Too Lean (Bank 1)',
            severity: 'high'
          }
        ];
      }

      const response = await this.sendOBDCommand('03');
      return this.parseDTCs(response);
    } catch (error) {
      console.error('Error reading DTCs:', error);
      throw error;
    }
  }

  /**
   * Parse DTC codes from response
   */
  parseDTCs(response) {
    if (!response) return [];
    
    const dtcs = [];
    const data = response.replace(/\\s/g, '');
    
    // Remove mode and count bytes (first 4 characters)
    const codes = data.substring(4);
    
    // Each DTC is 4 hex characters (2 bytes)
    for (let i = 0; i < codes.length; i += 4) {
      const codeHex = codes.substring(i, i + 4);
      if (codeHex.length === 4 && codeHex !== '0000') {
        const dtc = this.hexToDTC(codeHex);
        if (dtc) {
          dtcs.push({
            code: dtc,
            description: this.getDTCDescription(dtc),
            severity: this.getDTCSeverity(dtc)
          });
        }
      }
    }
    
    return dtcs;
  }

  /**
   * Convert hex code to DTC format (e.g., P0420)
   */
  hexToDTC(hex) {
    try {
      const code = parseInt(hex, 16);
      const firstDigit = (code >> 14) & 0x03;
      const secondDigit = (code >> 12) & 0x03;
      const thirdDigit = (code >> 8) & 0x0F;
      const fourthDigit = (code >> 4) & 0x0F;
      const fifthDigit = code & 0x0F;
      
      const prefixes = ['P', 'C', 'B', 'U'];
      const prefix = prefixes[firstDigit] || 'P';
      
      return `${prefix}${secondDigit}${thirdDigit.toString(16).toUpperCase()}${fourthDigit.toString(16).toUpperCase()}${fifthDigit.toString(16).toUpperCase()}`;
    } catch (error) {
      console.warn('Error converting hex to DTC:', error);
      return null;
    }
  }

  /**
   * Get DTC description (simplified lookup)
   */
  getDTCDescription(code) {
    const descriptions = {
      'P0420': 'Catalyst System Efficiency Below Threshold (Bank 1)',
      'P0171': 'System Too Lean (Bank 1)',
      'P0300': 'Random/Multiple Cylinder Misfire Detected',
      'P0301': 'Cylinder 1 Misfire Detected',
      'P0302': 'Cylinder 2 Misfire Detected',
      'P0303': 'Cylinder 3 Misfire Detected',
      'P0304': 'Cylinder 4 Misfire Detected',
      'P0401': 'Exhaust Gas Recirculation Flow Insufficient Detected',
      'P0442': 'Evaporative Emission Control System Leak Detected (small leak)',
      'P0456': 'Evaporative Emission Control System Leak Detected (very small leak)',
    };
    
    return descriptions[code] || 'Unknown diagnostic trouble code';
  }

  /**
   * Get DTC severity level
   */
  getDTCSeverity(code) {
    const highSeverity = ['P0300', 'P0301', 'P0302', 'P0303', 'P0304', 'P0171'];
    const mediumSeverity = ['P0420', 'P0401', 'P0442'];
    
    if (highSeverity.includes(code)) return 'high';
    if (mediumSeverity.includes(code)) return 'medium';
    return 'low';
  }

  /**
   * Clear diagnostic trouble codes
   */
  async clearDTCs() {
    try {
      const response = await this.sendOBDCommand('04');
      console.log('DTCs cleared:', response);
      return true;
    } catch (error) {
      console.error('Error clearing DTCs:', error);
      throw error;
    }
  }

  /**
   * Read vehicle speed
   */
  async getVehicleSpeed() {
    try {
      const response = await this.sendOBDCommand('010D');
      if (response && response.length >= 6) {
        const speedHex = response.substring(4, 6);
        return parseInt(speedHex, 16);
      }
      return null;
    } catch (error) {
      console.error('Error reading vehicle speed:', error);
      return null;
    }
  }

  /**
   * Read engine RPM
   */
  async getEngineRPM() {
    try {
      const response = await this.sendOBDCommand('010C');
      if (response && response.length >= 8) {
        const rpmHex = response.substring(4, 8);
        const rpmValue = parseInt(rpmHex, 16);
        return Math.round(rpmValue / 4);
      }
      return null;
    } catch (error) {
      console.error('Error reading engine RPM:', error);
      return null;
    }
  }

  /**
   * Disconnect from OBD device
   */
  async disconnect() {
    try {
      await BluetoothService.disconnect();
      this.isInitialized = false;
      console.log('Disconnected from OBD device');
    } catch (error) {
      console.error('Error disconnecting from OBD device:', error);
      throw error;
    }
  }

  /**
   * Check if OBD service is connected and initialized
   */
  isConnected() {
    return BluetoothService.isConnected() && this.isInitialized;
  }

  /**
   * Get list of supported PIDs
   */
  getSupportedPIDs() {
    return Array.from(this.supportedPIDs);
  }
}

export default new OBDService();