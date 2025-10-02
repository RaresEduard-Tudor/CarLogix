# CarLogix Database Setup Guide

This guide will help you set up your Firebase Firestore database for CarLogix.

## Prerequisites

1. **Firebase Project**: You should have already created a Firebase project (carlogix-530d3)
2. **Environment Variables**: Your `.env` file should contain your Firebase configuration
3. **Dependencies**: Run `yarn install` to install all dependencies

## Database Structure

CarLogix uses the following Firestore collections:

### 📊 Collections Overview

- **`users`** - User profiles and subscription data
- **`cars`** - Vehicle information and specifications  
- **`maintenanceRecords`** - Service history and maintenance logs
- **`errorCodes`** - OBD-II error codes and diagnostics
- **`settings`** - User preferences and configuration

### 🏗️ Collection Schemas

#### Users Collection (`users/{userId}`)
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  subscription: {
    plan: 'free' | 'premium' | 'pro',
    features: string[]
  },
  preferences: {
    theme: 'light' | 'dark',
    notifications: {
      maintenance_reminders: boolean,
      error_alerts: boolean,
      email_reports: boolean
    }
  },
  createdAt: timestamp,
  lastLogin: timestamp
}
```

#### Cars Collection (`cars/{carId}`)
```javascript
{
  userId: string,
  brand: string,
  model: string, 
  year: number,
  vin: string,
  licensePlate: string,
  color: string,
  currentMileage: number,
  purchaseDate: timestamp,
  purchasePrice: number,
  insurance: {
    provider: string,
    policyNumber: string,
    expiryDate: timestamp
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Maintenance Records (`maintenanceRecords/{recordId}`)
```javascript
{
  userId: string,
  carId: string,
  serviceType: string,
  description: string,
  serviceDate: timestamp,
  mileage: number,
  cost: number,
  location: {
    name: string,
    address: string,
    phone?: string
  },
  partsReplaced: [{
    partName: string,
    partNumber: string,
    quantity: number,
    warranty?: {
      duration: string,
      mileage: number
    }
  }],
  nextServiceDue?: {
    mileage: number,
    date: timestamp,
    serviceType: string
  },
  notes?: string,
  createdAt: timestamp
}
```

#### Error Codes (`errorCodes/{errorId}`)
```javascript
{
  userId: string,
  carId: string,
  code: string,
  description: string,
  severity: 'low' | 'moderate' | 'high' | 'critical',
  category: 'engine' | 'transmission' | 'fuel_system' | 'emissions' | 'other',
  detectedAt: timestamp,
  mileage: number,
  status: 'active' | 'cleared' | 'resolved',
  clearedAt?: timestamp,
  resolution?: {
    method: string,
    description: string,
    cost: number,
    serviceLocation: string,
    serviceDate: timestamp
  },
  detectionMethod: 'obd_scan' | 'manual_entry' | 'diagnostic_tool',
  diagnosticData?: {
    freezeFrame: object,
    scannerModel: string
  },
  notes?: string,
  createdAt: timestamp
}
```

#### Settings Collection (`settings/{userId}`)
```javascript
{
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD',
  distanceUnit: 'miles' | 'kilometers',
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD',
  theme: 'light' | 'dark' | 'auto',
  language: 'en' | 'es' | 'fr' | 'de',
  maintenanceReminders: {
    enabled: boolean,
    leadTime: number, // days
    methods: ['push', 'email', 'sms']
  },
  errorAlerts: {
    enabled: boolean,
    severity: string[] // which severities to alert on
  },
  autoBackup: boolean,
  backupFrequency: 'daily' | 'weekly' | 'monthly',
  syncEnabled: boolean,
  updatedAt: timestamp
}
```

## 🚀 Setup Methods

### Method 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
node scripts/setupDatabase.js
```

This will:
- ✅ Test your Firebase connection
- ✅ Create all collections with sample data
- ✅ Set up a demo user with realistic data
- ✅ Generate maintenance records and error codes
- ✅ Configure default settings

### Method 2: Manual Setup

If you prefer to set up manually:

1. **Go to Firebase Console**: https://console.firebase.google.com/project/carlogix-530d3
2. **Navigate to Firestore Database**
3. **Create the collections** listed above
4. **Add documents** using the schemas provided

### Method 3: Using the App

1. **Start the app**: `yarn dev`
2. **Sign up** for a new account
3. **Add your first car** - this will create the basic collections
4. **Add maintenance records** and **error codes** through the UI

## 🔧 Testing Your Setup

After setup, verify everything works:

```bash
# Start the development server
yarn dev

# Open http://localhost:5173
# Sign up or login
# Check that data appears correctly
```

## 🛡️ Security Rules

Your Firestore security rules should ensure users can only access their own data:

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access cars they own
    match /cars/{carId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own maintenance records
    match /maintenanceRecords/{recordId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own error codes
    match /errorCodes/{errorId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📋 Next Steps

1. **Run the setup script** to populate sample data
2. **Test the authentication** flow in your app
3. **Verify data appears** correctly in all pages
4. **Set up security rules** in Firebase Console
5. **Configure Firestore indexes** for better performance

## 🔍 Troubleshooting

### Common Issues:

**"Firebase connection failed"**
- Check your `.env` file has correct Firebase config
- Verify your Firebase project is active
- Ensure billing is enabled (required for Firestore)

**"Permission denied"**
- Make sure you're signed in
- Check Firestore security rules
- Verify user authentication

**"Module not found"**
- Run `yarn install` to install dependencies
- Check that all import paths are correct

**"Process is not defined"**
- Make sure you're running the script with Node.js, not in browser
- Use `node scripts/setupDatabase.js` command

## 📞 Support

If you run into issues:
1. Check the browser console for detailed error messages
2. Verify Firebase Console shows your project is active
3. Test your `.env` configuration
4. Review the Firestore security rules

Happy coding! 🚗✨