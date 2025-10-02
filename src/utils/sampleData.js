// Sample data population script for CarLogix Firebase
import { firebaseService } from '../services/firebaseService.js';

// Sample user data
export const sampleUserData = {
  uid: 'demo-user-123',
  email: 'demo@carlogix.com',
  displayName: 'Demo User',
  subscription: {
    plan: 'free',
    features: ['basic_tracking']
  },
  preferences: {
    theme: 'light',
    notifications: {
      maintenance_reminders: true,
      error_alerts: true,
      email_reports: false
    }
  }
};

// Sample car data
export const sampleCarData = {
  brand: 'Toyota',
  model: 'Camry',
  year: 2020,
  vin: '1HGBH41JXMN109186',
  licensePlate: 'ABC-1234',
  color: 'Silver Metallic',
  currentMileage: 45000,
  purchaseDate: new Date('2020-01-15'),
  purchasePrice: 25000,
  insurance: {
    provider: 'State Farm',
    policyNumber: 'SF-123456',
    expiryDate: new Date('2025-12-31')
  }
};

// Sample maintenance records
export const sampleMaintenanceRecords = [
  {
    serviceType: 'Oil Change',
    description: 'Regular oil change with synthetic oil',
    serviceDate: new Date('2024-10-01'),
    mileage: 45000,
    cost: 89.99,
    location: {
      name: 'Quick Lube Express',
      address: '123 Main St, City, State',
      phone: '+1-555-0123'
    },
    partsReplaced: [
      {
        partName: 'Engine Oil',
        partNumber: '5W-30-SYNTH',
        quantity: 1,
        warranty: {
          duration: '6 months',
          mileage: 6000
        }
      }
    ],
    nextServiceDue: {
      mileage: 51000,
      date: new Date('2025-04-01'),
      serviceType: 'Oil Change'
    },
    notes: 'Used high-quality synthetic oil'
  },
  {
    serviceType: 'Tire Rotation',
    description: 'Rotated all four tires',
    serviceDate: new Date('2024-09-15'),
    mileage: 44500,
    cost: 25.00,
    location: {
      name: 'Local Tire Shop',
      address: '456 Oak Ave, City, State'
    },
    notes: 'Front tires showed slight wear on inner edge'
  },
  {
    serviceType: 'Brake Inspection',
    description: 'Annual brake system inspection',
    serviceDate: new Date('2024-08-20'),
    mileage: 44000,
    cost: 0.00,
    location: {
      name: 'Toyota Dealership',
      address: '789 Auto Blvd, City, State'
    },
    notes: 'Brake pads at 60% - good condition'
  }
];

// Sample error codes
export const sampleErrorCodes = [
  {
    code: 'P0301',
    description: 'Cylinder 1 Misfire Detected',
    severity: 'moderate',
    category: 'engine',
    detectedAt: new Date('2024-09-28'),
    mileage: 44850,
    status: 'active',
    detectionMethod: 'obd_scan',
    diagnosticData: {
      freezeFrame: {
        rpm: 2000,
        speed: 45,
        engineTemp: 195,
        fuelTrim: -2.5
      },
      scannerModel: 'OBDLink MX+'
    },
    notes: 'Occurs mainly during cold starts'
  },
  {
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    severity: 'low',
    category: 'fuel_system',
    detectedAt: new Date('2024-09-10'),
    mileage: 44200,
    status: 'cleared',
    clearedAt: new Date('2024-09-12'),
    resolution: {
      method: 'part_replacement',
      description: 'Cleaned mass airflow sensor',
      cost: 75.00,
      serviceLocation: "Joe's Auto Shop",
      serviceDate: new Date('2024-09-12')
    },
    notes: 'Resolved after cleaning mass airflow sensor'
  }
];

// Sample settings
export const sampleSettings = {
  currency: 'USD',
  distanceUnit: 'miles',
  dateFormat: 'MM/DD/YYYY',
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
  syncEnabled: true
};

// Function to populate database with sample data
export async function populateSampleData(userId) {
  console.log('Starting sample data population...');
  
  try {
    // 1. Create user document
    console.log('Creating user document...');
    const userResult = await firebaseService.createUser(userId, sampleUserData);
    if (!userResult.success) {
      console.error('Failed to create user:', userResult.error);
      return { success: false, error: userResult.error };
    }

    // 2. Create car
    console.log('Creating car...');
    const carResult = await firebaseService.createCar(sampleCarData, userId);
    if (!carResult.success) {
      console.error('Failed to create car:', carResult.error);
      return { success: false, error: carResult.error };
    }
    const carId = carResult.id;

    // 3. Create maintenance records
    console.log('Creating maintenance records...');
    for (const record of sampleMaintenanceRecords) {
      const recordData = { ...record, carId };
      const result = await firebaseService.createMaintenanceRecord(recordData, userId);
      if (!result.success) {
        console.warn('Failed to create maintenance record:', result.error);
      }
    }

    // 4. Create error codes
    console.log('Creating error codes...');
    for (const errorCode of sampleErrorCodes) {
      const errorData = { ...errorCode, carId };
      const result = await firebaseService.createErrorCode(errorData, userId);
      if (!result.success) {
        console.warn('Failed to create error code:', result.error);
      }
    }

    // 5. Create settings
    console.log('Creating user settings...');
    const settingsResult = await firebaseService.updateUserSettings(userId, sampleSettings);
    if (!settingsResult.success) {
      console.warn('Failed to create settings:', settingsResult.error);
    }

    console.log('✅ Sample data population completed successfully!');
    return { 
      success: true, 
      data: { 
        userId, 
        carId,
        recordsCreated: sampleMaintenanceRecords.length,
        errorCodesCreated: sampleErrorCodes.length
      }
    };

  } catch (error) {
    console.error('Error populating sample data:', error);
    return { success: false, error: error.message };
  }
}

// Quick test function to verify Firebase connection
export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to read from a collection (this will create it if it doesn't exist)
    const testUserId = 'test-user-' + Date.now();
    const result = await firebaseService.createUser(testUserId, {
      email: 'test@example.com',
      displayName: 'Test User',
      isTestUser: true
    });

    if (result.success) {
      console.log('✅ Firebase connection successful!');
      
      // Clean up test user
      // Note: You'd need to implement deleteUser in firebaseService for this
      
      return { success: true, message: 'Firebase connection working' };
    } else {
      console.error('❌ Firebase connection failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    return { success: false, error: error.message };
  }
}