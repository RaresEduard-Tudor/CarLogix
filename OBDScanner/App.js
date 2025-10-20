import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthChange } from './src/services/firebaseService';

import LoginScreen from './src/screens/LoginScreen';
import CarSelectionScreen from './src/screens/CarSelectionScreen';
import OBDScannerScreen from './src/screens/OBDScannerScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        setSelectedCar(null);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
                />
              )}
            </Stack.Screen>
          ) : !selectedCar ? (
            <Stack.Screen name="CarSelection">
              {(props) => (
                <CarSelectionScreen
                  {...props}
                  user={user}
                  onCarSelected={(car) => setSelectedCar(car)}
                  onLogout={() => setUser(null)}
                />
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="OBDScanner">
              {(props) => (
                <OBDScannerScreen
                  {...props}
                  user={user}
                  selectedCar={selectedCar}
                  onBackToCarSelection={() => setSelectedCar(null)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

