// Firebase service layer for CarLogix
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

class FirebaseService {
  // ==================== USERS ====================
  
  async createUser(userId, userData) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  }

  async getUser(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, userData) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== CARS ====================

  async createCar(carData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        ...carData,
        ownerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating car:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserCars(userId) {
    try {
      const q = query(
        collection(db, 'cars'),
        where('ownerId', '==', userId),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const cars = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: cars };
    } catch (error) {
      console.error('Error getting user cars:', error);
      return { success: false, error: error.message };
    }
  }

  async updateCar(carId, carData) {
    try {
      await updateDoc(doc(db, 'cars', carId), {
        ...carData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating car:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteCar(carId) {
    try {
      // Soft delete
      await updateDoc(doc(db, 'cars', carId), {
        isActive: false,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting car:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== MAINTENANCE RECORDS ====================

  async createMaintenanceRecord(recordData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'maintenanceRecords'), {
        ...recordData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      return { success: false, error: error.message };
    }
  }

  async getMaintenanceRecords(userId, carId = null) {
    try {
      let q;
      if (carId) {
        q = query(
          collection(db, 'maintenanceRecords'),
          where('userId', '==', userId),
          where('carId', '==', carId),
          orderBy('date', 'desc')
        );
      } else {
        q = query(
          collection(db, 'maintenanceRecords'),
          where('userId', '==', userId),
          orderBy('date', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: records };
    } catch (error) {
      console.error('Error getting maintenance records:', error);
      return { success: false, error: error.message };
    }
  }

  async updateMaintenanceRecord(recordId, recordData) {
    try {
      await updateDoc(doc(db, 'maintenanceRecords', recordId), {
        ...recordData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating maintenance record:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteMaintenanceRecord(recordId) {
    try {
      await deleteDoc(doc(db, 'maintenanceRecords', recordId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== ERROR CODES ====================

  async createErrorCode(errorData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'errorCodes'), {
        ...errorData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating error code:', error);
      return { success: false, error: error.message };
    }
  }

  async getErrorCodes(userId, carId = null) {
    try {
      // Query errorCodeScans collection (new schema from mobile app)
      let q;
      if (carId) {
        q = query(
          collection(db, 'errorCodeScans'),
          where('userId', '==', userId),
          where('carId', '==', carId),
          orderBy('timestamp', 'desc')
        );
      } else {
        q = query(
          collection(db, 'errorCodeScans'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const errorCodes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: errorCodes };
    } catch (error) {
      console.error('Error getting error codes:', error);
      return { success: false, error: error.message };
    }
  }

  async updateErrorCode(errorId, errorData) {
    try {
      await updateDoc(doc(db, 'errorCodeScans', errorId), {
        ...errorData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating error code:', error);
      return { success: false, error: error.message };
    }
  }

  async clearErrorCode(errorId) {
    try {
      await updateDoc(doc(db, 'errorCodeScans', errorId), {
        status: 'resolved',
        resolvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error clearing error code:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== SETTINGS ====================

  async getUserSettings(userId) {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', userId));
      if (settingsDoc.exists()) {
        return { success: true, data: settingsDoc.data() };
      }
      
      // Create default settings if none exist
      const defaultSettings = {
        userId,
        currency: 'USD',
        distanceUnit: 'miles',
        dateFormat: 'us',
        theme: 'light',
        language: 'en',
        maintenanceReminders: {
          enabled: true,
          leadTime: 30,
          methods: ['push']
        },
        errorAlerts: {
          enabled: true,
          severity: ['moderate', 'high', 'critical']
        },
        autoBackup: true,
        backupFrequency: 'daily',
        syncEnabled: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'settings', userId), defaultSettings);
      return { success: true, data: defaultSettings };
    } catch (error) {
      console.error('Error getting user settings:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserSettings(userId, settings) {
    try {
      await updateDoc(doc(db, 'settings', userId), {
        ...settings,
        lastSyncAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== REAL-TIME LISTENERS ====================

  subscribeToUserCars(userId, callback) {
    const q = query(
      collection(db, 'cars'),
      where('ownerId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const cars = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(cars);
    });
  }

  subscribeToMaintenanceRecords(userId, callback, carId = null) {
    let q;
    if (carId) {
      q = query(
        collection(db, 'maintenanceRecords'),
        where('userId', '==', userId),
        where('carId', '==', carId),
        orderBy('serviceDate', 'desc')
      );
    } else {
      q = query(
        collection(db, 'maintenanceRecords'),
        where('userId', '==', userId),
        orderBy('serviceDate', 'desc')
      );
    }
    
    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(records);
    });
  }

  subscribeToErrorCodes(userId, callback, carId = null) {
    let q;
    if (carId) {
      q = query(
        collection(db, 'errorCodes'),
        where('userId', '==', userId),
        where('carId', '==', carId),
        orderBy('detectedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'errorCodes'),
        where('userId', '==', userId),
        orderBy('detectedAt', 'desc')
      );
    }
    
    return onSnapshot(q, (snapshot) => {
      const errorCodes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(errorCodes);
    });
  }

  subscribeToUserSettings(userId, callback) {
    return onSnapshot(doc(db, 'settings', userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }

  // ==================== UTILITY METHODS ====================

  async batchCreateSampleData(userId) {
    // This method can be used to populate sample data for testing
    try {
      // Sample car
      const carResult = await this.createCar({
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        vin: '1HGBH41JXMN109186',
        color: 'Silver',
        currentMileage: 45000,
        purchaseDate: new Date('2020-01-15')
      }, userId);

      if (carResult.success) {
        const carId = carResult.id;

        // Sample maintenance records
        await this.createMaintenanceRecord({
          carId,
          serviceType: 'Oil Change',
          description: 'Regular oil change with synthetic oil',
          serviceDate: new Date('2024-10-01'),
          mileage: 45000,
          cost: 89.99,
          location: { name: 'Quick Lube Express' }
        }, userId);

        // Sample error code
        await this.createErrorCode({
          carId,
          code: 'P0301',
          description: 'Cylinder 1 Misfire Detected',
          severity: 'moderate',
          detectedAt: new Date(),
          mileage: 44850,
          status: 'active'
        }, userId);
      }

      return { success: true };
    } catch (error) {
      console.error('Error creating sample data:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();