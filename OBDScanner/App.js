import React from 'react';
import { StatusBar } from 'expo-status-bar';
import OBDScannerScreen from './src/screens/OBDScannerScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <OBDScannerScreen />
    </>
  );
}
