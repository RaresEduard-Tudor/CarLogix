import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../config/colors';
import { getUserCars, logout } from '../services/apiService';

export default function CarSelectionScreen({ user, onCarSelected, onLogout }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  const loadCars = async () => {
    setLoading(true);
    try {
      const carList = await getUserCars();
      setCars(carList);
      if (carList.length === 0) {
        Alert.alert(
          'No Cars Found',
          'Please add a car in the web app first before using the OBD scanner.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
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
            await logout();
            onLogout();
          },
        },
      ]
    );
  };

  const renderCarItem = ({ item }) => {
    const isSelected = selectedCar?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.carCard, isSelected && styles.carCardSelected]}
        onPress={() => handleCarSelect(item)}
        activeOpacity={0.7}
      >
        {/* Accent bar */}
        <LinearGradient
          colors={isSelected ? Colors.gradientPrimary : [Colors.border, Colors.border]}
          style={styles.accentBar}
        />
        <View style={styles.carCardContent}>
          <View style={styles.carCardRow}>
            <Text style={styles.carName}>
              {item.year} {item.brand} {item.model}
            </Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>Selected</Text>
              </View>
            )}
          </View>
          {item.vin && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>VIN</Text>
              <Text style={styles.carVin}>{item.vin}</Text>
            </View>
          )}
          {item.licensePlate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plate</Text>
              <Text style={styles.carPlate}>{item.licensePlate}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your cars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={Colors.gradientPrimary} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Select Your Car</Text>
            <Text style={styles.subtitle}>{user.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {cars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>🚗</Text>
          </View>
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
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textOnPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logoutText: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  carCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  carCardSelected: {
    shadowOpacity: 0.12,
    elevation: 5,
  },
  accentBar: {
    width: 5,
  },
  carCardContent: {
    flex: 1,
    padding: 16,
  },
  carCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  carName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  selectedBadge: {
    backgroundColor: Colors.primaryFaint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    width: 40,
    textTransform: 'uppercase',
  },
  carVin: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  carPlate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryFaint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
