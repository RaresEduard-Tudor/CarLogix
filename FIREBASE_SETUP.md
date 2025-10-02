# Firebase Setup Guide for CarLogix

This guide will help you set up Firebase for your CarLogix application.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `carlogix` (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

## 2. Set up Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click "Done"

## 3. Set up Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Enable **Google** provider for social login
4. Click "Save"

## 4. Configure Security Rules

In **Firestore Database** > **Rules**, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cars: Users can only access cars they own or are shared with
    match /cars/{carId} {
      allow read, write: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         request.auth.uid in resource.data.get('sharedWith', []));
    }
    
    // Maintenance Records: Access based on user ownership
    match /maintenanceRecords/{recordId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Error Codes: Access based on user ownership
    match /errorCodes/{errorId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Settings: Users can only access their own settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **"Add app"** > **Web** (</> icon)
4. Enter app nickname: "CarLogix Web"
5. Click "Register app"
6. Copy the `firebaseConfig` object

## 6. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## 7. Set up Firestore Indexes

For optimal performance, create these composite indexes in **Firestore Database** > **Indexes**:

### Single Field Indexes (auto-created):
- `cars.ownerId`
- `cars.isActive`
- `cars.createdAt`
- `maintenanceRecords.userId`
- `maintenanceRecords.carId` 
- `maintenanceRecords.serviceDate`
- `errorCodes.userId`
- `errorCodes.carId`
- `errorCodes.status`
- `errorCodes.detectedAt`

### Composite Indexes (create manually):

1. **Cars by owner and status:**
   - Collection: `cars`
   - Fields: `ownerId` (Ascending), `isActive` (Ascending), `createdAt` (Descending)

2. **Maintenance records by user and date:**
   - Collection: `maintenanceRecords`
   - Fields: `userId` (Ascending), `serviceDate` (Descending)

3. **Maintenance records by car and date:**
   - Collection: `maintenanceRecords`
   - Fields: `carId` (Ascending), `serviceDate` (Descending)

4. **Error codes by user and status:**
   - Collection: `errorCodes`
   - Fields: `userId` (Ascending), `status` (Ascending), `detectedAt` (Descending)

5. **Error codes by car and status:**
   - Collection: `errorCodes`
   - Fields: `carId` (Ascending), `status` (Ascending), `detectedAt` (Descending)

## 8. Test the Connection

1. Start your development server:
   ```bash
   yarn dev
   ```

2. Check the browser console for any Firebase connection errors

3. Try creating an account in your app

4. Verify data appears in your Firebase console

## 9. Optional: Set up Firebase Storage

If you plan to upload receipts, photos, or documents:

1. Go to **Storage** in Firebase Console
2. Click "Get started"
3. Choose **Start in test mode**
4. Select same location as Firestore
5. Update storage rules as needed

## 10. Production Deployment

When ready for production:

1. Update Firestore rules to be more restrictive
2. Set up proper authentication domains
3. Configure CORS for your domain
4. Set up Firebase Hosting (optional)

## Troubleshooting

### Common Issues:

1. **"Firebase project not found"**
   - Check your project ID in `.env`
   - Ensure project exists in Firebase Console

2. **"Permission denied"**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **"Network request failed"**
   - Check internet connection
   - Verify Firebase configuration

4. **"Index not found"**
   - Create required composite indexes
   - Wait for index creation to complete

### Useful Commands:

```bash
# Install Firebase CLI (optional)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
```

## Next Steps

Once Firebase is set up:

1. Test user registration and login
2. Create sample cars and maintenance records
3. Verify data syncing across devices
4. Set up proper error handling
5. Add offline support with Firebase caching

Your CarLogix app will now have real-time data synchronization across all devices! 🚀