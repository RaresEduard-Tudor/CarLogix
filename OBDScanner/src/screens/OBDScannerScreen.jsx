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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../config/colors';
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
      case 'high': return Colors.error;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textMuted;
    }
  };

  const getSeverityGradient = (severity) => {
    switch (severity) {
      case 'high': return Colors.gradientDanger;
      case 'medium': return [Colors.warning, '#f59e0b'];
      case 'low': return Colors.gradientSecondary;
      default: return [Colors.textMuted, Colors.textMuted];
    }
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity 
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceIconCircle}>
        <Text style={styles.deviceIcon}>📡</Text>
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
        <Text style={styles.deviceAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderErrorCode = ({ item }) => (
    <View style={styles.errorCodeItem}>
      <LinearGradient
        colors={getSeverityGradient(item.severity)}
        style={styles.severityAccent}
      />
      <View style={styles.errorCodeContent}>
        <View style={styles.errorCodeHeader}>
          <Text style={styles.errorCode}>{item.code}</Text>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) + '18' }]}>
            <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
              {item.severity.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.errorDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onBackToCarSelection} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.carBadge}>
            <Text style={styles.carBadgeText}>
              {selectedCar.year} {selectedCar.brand} {selectedCar.model}
            </Text>
          </View>
        </View>
        <Text style={styles.title}>OBD-II Scanner</Text>
        <Text style={styles.subtitle}>Bluetooth Diagnostic Tool</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connection Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connection</Text>
          {connectedDevice ? (
            <View>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.statusConnected]} />
                <Text style={styles.connectedText}>Connected to {connectedDevice.name}</Text>
              </View>
              <TouchableOpacity style={styles.dangerButton} onPress={disconnect} activeOpacity={0.8}>
                <Text style={styles.dangerButtonText}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, styles.statusDisconnected]} />
                <Text style={styles.disconnectedText}>Not Connected</Text>
              </View>
              <TouchableOpacity
                style={[styles.primaryButton, isScanning && styles.buttonDisabled]}
                onPress={scanForDevices}
                disabled={isScanning}
                activeOpacity={0.8}
              >
                <LinearGradient colors={Colors.gradientPrimary} style={styles.gradientButton}>
                  <Text style={styles.primaryButtonText}>
                    {isScanning ? 'Scanning...' : 'Scan for Devices'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Live Data */}
        {connectedDevice && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Live Data</Text>
            <View style={styles.gaugeRow}>
              <View style={styles.gauge}>
                <Text style={styles.gaugeValue}>
                  {vehicleData.speed !== null ? vehicleData.speed : '--'}
                </Text>
                <Text style={styles.gaugeUnit}>km/h</Text>
                <Text style={styles.gaugeLabel}>Speed</Text>
              </View>
              <View style={styles.gaugeDivider} />
              <View style={styles.gauge}>
                <Text style={styles.gaugeValue}>
                  {vehicleData.rpm !== null ? vehicleData.rpm : '--'}
                </Text>
                <Text style={styles.gaugeUnit}>rpm</Text>
                <Text style={styles.gaugeLabel}>Engine</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.secondaryButton} onPress={readVehicleData} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>Refresh Data</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Diagnostic Scan */}
        {connectedDevice && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Diagnostics</Text>
            <TouchableOpacity
              style={[styles.primaryButton, isReadingCodes && styles.buttonDisabled]}
              onPress={readErrorCodes}
              disabled={isReadingCodes}
              activeOpacity={0.8}
            >
              <LinearGradient colors={Colors.gradientSecondary} style={styles.gradientButton}>
                <Text style={styles.primaryButtonText}>
                  {isReadingCodes ? 'Reading Codes...' : 'Scan for Error Codes'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {errorCodes.length > 0 && (
              <TouchableOpacity style={styles.dangerButton} onPress={clearErrorCodes} activeOpacity={0.8}>
                <Text style={styles.dangerButtonText}>Clear Error Codes</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Error Code Results */}
        {errorCodes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.cardTitle}>Error Codes</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{errorCodes.length}</Text>
              </View>
            </View>
            <FlatList
              data={errorCodes}
              renderItem={renderErrorCode}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* All Clear */}
        {connectedDevice && !isReadingCodes && errorCodes.length === 0 && (
          <View style={styles.allClearContainer}>
            <LinearGradient colors={Colors.gradientSecondary} style={styles.allClearCircle}>
              <Text style={styles.allClearIcon}>✓</Text>
            </LinearGradient>
            <Text style={styles.allClearTitle}>All Clear</Text>
            <Text style={styles.allClearSubtext}>No error codes found — your vehicle is running normally</Text>
          </View>
        )}

        <View style={{ height: 30 }} />
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
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select OBD Device</Text>
            {devices.length > 0 ? (
              <FlatList
                data={devices}
                renderItem={renderDevice}
                keyExtractor={(item) => item.address}
                style={styles.deviceList}
              />
            ) : (
              <View style={styles.emptyDevices}>
                <Text style={styles.emptyDevicesIcon}>📡</Text>
                <Text style={styles.noDevicesText}>No devices found</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDeviceModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {isConnecting && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Connecting...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 54,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  carBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  carBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusConnected: {
    backgroundColor: Colors.success,
  },
  statusDisconnected: {
    backgroundColor: Colors.error,
  },
  connectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.success,
  },
  disconnectedText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: Colors.surfaceAlt,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  dangerButton: {
    backgroundColor: Colors.errorLight,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gauge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  gaugeValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  gaugeUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  gaugeLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  gaugeDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.border,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countBadge: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 10,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  // Error code styles
  errorCodeItem: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  severityAccent: {
    width: 5,
  },
  errorCodeContent: {
    flex: 1,
    padding: 16,
  },
  errorCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorCode: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  // All clear
  allClearContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  allClearCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  allClearIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
  },
  allClearTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.success,
    marginBottom: 6,
  },
  allClearSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 260,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  deviceList: {
    maxHeight: 300,
  },
  deviceItem: {
    backgroundColor: Colors.surfaceAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deviceIcon: {
    fontSize: 18,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  deviceAddress: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  emptyDevices: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyDevicesIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  noDevicesText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 15,
  },
  modalCloseButton: {
    backgroundColor: Colors.surfaceAlt,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    color: Colors.text,
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
  },
});