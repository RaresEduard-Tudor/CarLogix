import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import BluetoothService from '../obd/bluetoothService';
import OBDService from '../obd/obdService';
import { saveDiagnostic } from '../services/apiService';

export default function OBDScannerScreen({ selectedCar, onBackToCarSelection }) {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorCodes, setErrorCodes] = useState([]);
  const [isReadingCodes, setIsReadingCodes] = useState(false);
  const [vehicleData, setVehicleData] = useState({ speed: null, rpm: null });
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [_isSavingCodes, setIsSavingCodes] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (OBDService.isConnected()) {
        OBDService.disconnect();
      }
    };
  }, []);

  const scanForDevices = async () => {
    try {
      setIsScanning(true);
      setDevices([]);
      
      const foundDevices = await BluetoothService.scanForDevices();
      console.log('Found devices:', foundDevices);
      setDevices(foundDevices);
      
      if (foundDevices.length > 0) {
        setShowDeviceModal(true);
      } else {
        Alert.alert('No Devices', 'No Bluetooth devices found. Make sure Bluetooth is enabled and devices are discoverable.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Error', error.message);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device) => {
    try {
      setIsConnecting(true);
      setShowDeviceModal(false);
      
      await OBDService.initialize(device);
      setConnectedDevice(device);
      
      Alert.alert('Connected', `Connected to ${device.name}\\n\\nYou can now scan for error codes!`);
    } catch (error) {
      Alert.alert('Connection Error', `Failed to connect: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await OBDService.disconnect();
      setConnectedDevice(null);
      setErrorCodes([]);
      setVehicleData({ speed: null, rpm: null });
      Alert.alert('Disconnected', 'Disconnected from OBD device');
    } catch (error) {
      Alert.alert('Error', `Failed to disconnect: ${error.message}`);
    }
  };

  const readErrorCodes = async () => {
    try {
      setIsReadingCodes(true);
      setErrorCodes([]);
      
      const codes = await OBDService.readDTCs();
      setErrorCodes(codes);
      
      if (codes.length === 0) {
        Alert.alert('No Codes', 'No error codes found. Your vehicle appears to be running normally.');
      } else {
        Alert.alert(
          'Scan Complete',
          `Found ${codes.length} error code(s).\n\nSave to your CarLogix account?`,
          [
            { text: 'Skip', style: 'cancel' },
            {
              text: 'Save',
              onPress: () => handleSaveCodes(codes),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Scan Error', `Failed to read error codes: ${error.message}`);
    } finally {
      setIsReadingCodes(false);
    }
  };

  const handleSaveCodes = async (codes) => {
    try {
      setIsSavingCodes(true);
      
      const mileage = vehicleData.mileage || null;
      
      // Save each error code as a separate diagnostic entry
      await Promise.all(
        codes.map((code) =>
          saveDiagnostic(selectedCar.id, code.code || code, mileage)
        )
      );

      Alert.alert(
        'Saved!',
        'Error codes saved to your CarLogix account.\n\nView them in the web app under "Error Codes".'
      );
    } catch (error) {
      Alert.alert('Save Failed', error.message || 'Failed to save error codes');
    } finally {
      setIsSavingCodes(false);
    }
  };

  const clearErrorCodes = () => {
    Alert.alert(
      'Clear Error Codes',
      'This will clear all stored error codes. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await OBDService.clearDTCs();
              setErrorCodes([]);
              Alert.alert('Success', 'Error codes cleared successfully!');
            } catch (error) {
              Alert.alert('Error', `Failed to clear codes: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const readVehicleData = async () => {
    try {
      const [speed, rpm] = await Promise.all([
        OBDService.getVehicleSpeed(),
        OBDService.getEngineRPM()
      ]);
      
      setVehicleData({ speed, rpm });
    } catch (error) {
      console.warn('Failed to read vehicle data:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity 
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  const renderErrorCode = ({ item }) => (
    <View style={[styles.errorCodeItem, { borderLeftColor: getSeverityColor(item.severity) }]}>
      <View style={styles.errorCodeHeader}>
        <Text style={styles.errorCode}>{item.code}</Text>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
          <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.errorDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBackToCarSelection} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.carInfo}>
              {selectedCar.year} {selectedCar.brand} {selectedCar.model}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>🚗 OBD Scanner</Text>
        <Text style={styles.subtitle}>Bluetooth OBD-II Diagnostic Tool</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Connection Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Status</Text>
          {connectedDevice ? (
            <View style={styles.connectionStatus}>
              <Text style={styles.connectedText}>🟢 Connected to {connectedDevice.name}</Text>
              <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
                <Text style={styles.disconnectButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.connectionStatus}>
              <Text style={styles.disconnectedText}>🔴 Not Connected</Text>
              <TouchableOpacity 
                style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
                onPress={scanForDevices}
                disabled={isScanning}
              >
                <Text style={styles.scanButtonText}>
                  {isScanning ? '⏳ Scanning...' : '🔍 Scan for Devices'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Vehicle Data */}
        {connectedDevice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Live Data</Text>
            <View style={styles.dataContainer}>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>Speed</Text>
                <Text style={styles.dataValue}>
                  {vehicleData.speed !== null ? `${vehicleData.speed} km/h` : '--'}
                </Text>
              </View>
              <View style={styles.dataItem}>
                <Text style={styles.dataLabel}>RPM</Text>
                <Text style={styles.dataValue}>
                  {vehicleData.rpm !== null ? `${vehicleData.rpm}` : '--'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={readVehicleData}>
              <Text style={styles.refreshButtonText}>🔄 Refresh Data</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Diagnostic Scan */}
        {connectedDevice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnostic Scan</Text>
            
            <TouchableOpacity 
              style={[styles.scanButton, isReadingCodes && styles.scanButtonDisabled]}
              onPress={readErrorCodes}
              disabled={isReadingCodes}
            >
              <Text style={styles.scanButtonText}>
                {isReadingCodes ? '⏳ Reading Codes...' : '🔍 Scan for Error Codes'}
              </Text>
            </TouchableOpacity>

            {errorCodes.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearErrorCodes}>
                <Text style={styles.clearButtonText}>🗑️ Clear Error Codes</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Error Codes Results */}
        {errorCodes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Error Codes ({errorCodes.length})
            </Text>
            <FlatList
              data={errorCodes}
              renderItem={renderErrorCode}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              style={styles.errorCodesList}
              scrollEnabled={false}
            />
          </View>
        )}

        {connectedDevice && !isReadingCodes && errorCodes.length === 0 && (
          <View style={styles.noErrorsContainer}>
            <Text style={styles.noErrorsText}>✅ No error codes found</Text>
            <Text style={styles.noErrorsSubtext}>Your vehicle appears to be running normally</Text>
          </View>
        )}
      </ScrollView>

      {/* Device Selection Modal */}
      <Modal
        visible={showDeviceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDeviceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select OBD Device</Text>
            {devices.length > 0 ? (
              <FlatList
                data={devices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.address}
                style={styles.deviceList}
              />
            ) : (
              <Text style={styles.noDevicesText}>No devices found</Text>
            )}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowDeviceModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isConnecting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Connecting...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  carInfo: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  connectionStatus: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 10,
  },
  disconnectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d32f2f',
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#c8e6c9',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  dataItem: {
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorCodesList: {
    maxHeight: 300,
  },
  errorCodeItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  errorCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  noErrorsContainer: {
    alignItems: 'center',
    padding: 30,
  },
  noErrorsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    marginBottom: 8,
  },
  noErrorsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  noDevicesText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  modalCloseButton: {
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});