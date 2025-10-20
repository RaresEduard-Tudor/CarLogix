import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getUserCars, signOut as firebaseSignOut } from '../services/firebaseService';

export default function CarSelectionScreen({ user, onCarSelected, onLogout }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  const loadCars = async () => {
    setLoading(true);
    const result = await getUserCars(user.uid);
    setLoading(false);

    if (result.success) {
      setCars(result.cars);
      if (result.cars.length === 0) {
        Alert.alert(
          'No Cars Found',
          'Please add a car in the web app first before using the OBD scanner.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert('Error', result.error || 'Failed to load cars');
    }
  };

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    onCarSelected(car);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await firebaseSignOut();
            onLogout();
          },
        },
      ]
    );
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.carCard,
        selectedCar?.id === item.id && styles.carCardSelected,
      ]}
      onPress={() => handleCarSelect(item)}
    >
      <Text style={styles.carName}>
        {item.year} {item.brand} {item.model}
      </Text>
      {item.vin && (
        <Text style={styles.carVin}>VIN: {item.vin}</Text>
      )}
      {item.licensePlate && (
        <Text style={styles.carPlate}>Plate: {item.licensePlate}</Text>
      )}
      {selectedCar?.id === item.id && (
        <Text style={styles.selectedBadge}>✓ Selected</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your cars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Select Your Car</Text>
          <Text style={styles.subtitle}>Signed in as: {user.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {cars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🚗</Text>
          <Text style={styles.emptyText}>No cars found</Text>
          <Text style={styles.emptySubtext}>
            Add a car in the CarLogix web app first
          </Text>
        </View>
      ) : (
        <FlatList
          data={cars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  carCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  carVin: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  carPlate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedBadge: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
