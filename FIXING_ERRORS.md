# Fixing the Errors - Quick Guide

## 🔴 Error 1: Mobile App - TurboModuleRegistry Error

**Cause:** New native dependencies need to be rebuilt into the app.

**Fix:**
```bash
cd /home/rares/projects/CarLogix/OBDScanner

# Clean and rebuild
yarn expo prebuild --clean
yarn expo run:android
```

This will rebuild the app with all the new native modules (AsyncStorage, Navigation, etc).

---

## 🔴 Error 2: Web App - Firebase Permission Error

**Error:** `Missing or insufficient permissions`

**Cause:** Firestore rules don't allow access to the `errorCodeScans` collection.

### Fix Option 1: Deploy via Firebase Console (Easiest)

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com
   - Select your CarLogix project

2. **Navigate to Firestore Rules:**
   - Click "Firestore Database" in left menu
   - Click "Rules" tab at the top

3. **Update the rules:**
   Add this section to your rules (after the `errorCodes` section):

   ```javascript
   // Error Code Scans: Access based on user ownership (from mobile app)
   match /errorCodeScans/{scanId} {
     allow read: if request.auth != null && 
       resource.data.userId == request.auth.uid;
     allow create: if request.auth != null && 
       request.resource.data.userId == request.auth.uid;
     allow update, delete: if request.auth != null && 
       resource.data.userId == request.auth.uid;
   }
   ```

4. **Click "Publish"**

### Fix Option 2: Deploy via Firebase CLI

**Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

**Login and deploy:**
```bash
cd /home/rares/projects/CarLogix
firebase login
firebase deploy --only firestore:rules
```

### Complete Rules File

Your `firestore.rules` should look like this:

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
      allow create: if request.auth != null && 
        request.resource.data.ownerId == request.auth.uid;
    }
    
    // Maintenance Records: Access based on user ownership
    match /maintenanceRecords/{recordId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Error Codes: Access based on user ownership (old schema)
    match /errorCodes/{errorId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Error Code Scans: Access based on user ownership (new schema from mobile)
    match /errorCodeScans/{scanId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Settings: Users can only access their own settings
    match /settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📱 Mobile App - Additional Error

I also saw this in the logs:
```
ERROR  Sign in error: [FirebaseError: Firebase: Error (auth/invalid-credential).]
```

**This means:**
- You tried to login with wrong credentials
- OR Firebase config is not set up correctly

**Check:**
1. Open `/home/rares/projects/CarLogix/OBDScanner/src/config/firebase.js`
2. Make sure you replaced the placeholder values with real Firebase config
3. Use the SAME credentials you use for the web app

---

## ✅ Testing Checklist

After fixing:

### Web App:
```bash
cd /home/rares/projects/CarLogix
yarn dev
# Open http://localhost:5173
# Go to Error Codes page - should not show permission error
```

### Mobile App:
```bash
cd /home/rares/projects/CarLogix/OBDScanner
yarn start
# Open on device
# Login with web app credentials
# Should work without TurboModule error
```

---

## 🚀 Quick Fix Summary

**For Web Permission Error:**
→ Add `errorCodeScans` rules in Firebase Console

**For Mobile TurboModule Error:**
→ Run `yarn expo run:android` to rebuild

**For Mobile Login Error:**
→ Check Firebase config has real values (not placeholders)

---

## Need Help?

If you still get errors:
1. Share the EXACT error message
2. Check browser console (F12) for web app errors
3. Check Metro bundler terminal for mobile app errors
