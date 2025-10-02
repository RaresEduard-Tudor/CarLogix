#!/usr/bin/env node

// Firebase Database Setup Script for CarLogix
// Run with: node scripts/setupDatabase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { populateSampleData, testFirebaseConnection } from '../src/utils/sampleData.js';
import dotenv from 'dotenv';
import process from 'process';

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getFirestore(app); // Initialize Firestore

async function setupDatabase() {
  console.log('🚀 CarLogix Database Setup Starting...');
  console.log(`📍 Project ID: ${firebaseConfig.projectId}\n`);

  try {
    // Step 1: Test Firebase connection
    console.log('🔍 Step 1: Testing Firebase connection...');
    const connectionTest = await testFirebaseConnection();
    
    if (!connectionTest.success) {
      console.error('❌ Firebase connection failed. Please check your configuration.');
      console.error('Error:', connectionTest.error);
      process.exit(1);
    }
    
    console.log('✅ Firebase connection successful!\n');

    // Step 2: Populate sample data
    console.log('📝 Step 2: Populating sample data...');
    const sampleUserId = 'demo-user-' + Date.now();
    
    const populationResult = await populateSampleData(sampleUserId);
    
    if (!populationResult.success) {
      console.error('❌ Failed to populate sample data:', populationResult.error);
      process.exit(1);
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👤 User ID: ${populationResult.data.userId}`);
    console.log(`   🚗 Car ID: ${populationResult.data.carId}`);
    console.log(`   🔧 Maintenance Records: ${populationResult.data.recordsCreated}`);
    console.log(`   ⚠️  Error Codes: ${populationResult.data.errorCodesCreated}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Run your app: yarn dev');
    console.log('   2. Sign up/login to see the data');
    console.log('   3. Check Firestore console to verify data');
    console.log(`   4. Firebase Console: https://console.firebase.google.com/project/${firebaseConfig.projectId}`);

  } catch (error) {
    console.error('💥 Setup failed with error:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();