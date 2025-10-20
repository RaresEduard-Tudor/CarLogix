# Error Codes Integration Plan

## 🎯 Goal
Enable the mobile app to save scanned OBD-II error codes to Firebase, and display them in the web app's "Error Codes" page.

## 📋 Current State

### Mobile App (OBDScanner)
- ✅ Connects to ELM327 via Bluetooth
- ✅ Reads error codes from vehicle
- ✅ Displays codes in app
- ❌ No Firebase integration
- ❌ No user authentication
- ❌ No car selection

### Web App
- ✅ Firebase Authentication
- ✅ Car management
- ✅ Error Codes page (currently mock data)
- ❌ No real error code history

## 🔄 Proposed Flow

### Mobile App Flow:
```
1. User opens mobile app
2. User logs in with Firebase (same account as web)
3. User selects which car to scan
4. User connects to OBD adapter
5. User scans for error codes
6. Error codes automatically saved to Firebase with:
   - User ID
   - Car ID
   - Error codes
   - Timestamp
   - Mileage (if available from OBD)
7. Success notification
```

### Web App Flow:
```
1. User opens "Error Codes" page
2. Fetches error history from Firebase
3. Displays:
   - Date/time of scan
   - Which car
   - Error codes found
   - Description of codes
   - Option to mark as "resolved"
```

## 📊 Firebase Schema

### Collection: `errorCodeScans`
```javascript
{
  id: "auto-generated-id",
  userId: "user-uid",
  carId: "car-id",
  carName: "2020 Toyota Camry", // Denormalized for quick display
  timestamp: Timestamp,
  codes: [
    {
      code: "P0171",
      description: "System Too Lean (Bank 1)",
      type: "Powertrain"
    },
    {
      code: "P0420",
      description: "Catalyst System Efficiency Below Threshold",
      type: "Powertrain"
    }
  ],
  mileage: 45230, // Optional, from OBD if available
  status: "active", // "active" or "resolved"
  resolvedAt: null, // Timestamp when marked resolved
  notes: "" // User can add notes
}
```

## 🛠️ Implementation Steps

### Phase 1: Mobile App Updates

1. **Add Firebase SDK to OBDScanner**
   ```bash
   cd OBDScanner
   yarn add firebase
   ```

2. **Create Firebase config**
   - Add `src/config/firebase.js`
   - Use same Firebase project as web app

3. **Add Authentication Screen**
   - Simple email/password login
   - Or use Expo Auth Session for Google Sign-In
   - Store user session

4. **Add Car Selection**
   - Fetch user's cars from Firestore
   - Let user select which car they're scanning
   - Cache selection for convenience

5. **Update OBDScannerScreen**
   - After successful scan, save to Firestore
   - Show confirmation toast/notification

### Phase 2: Web App Updates

1. **Update ErrorCodesPage.jsx**
   - Replace mock data with Firestore queries
   - Query: `errorCodeScans` where `userId === currentUser.id`
   - Order by timestamp descending

2. **Add Features**
   - Mark errors as "resolved"
   - Add notes to error scans
   - Filter by car
   - Export to PDF

### Phase 3: Enhanced Features (Future)

- Push notifications when error detected
- Error code lookup database
- Severity indicators
- Maintenance recommendations based on codes
- Compare scans over time

## 📱 Mobile App Changes Needed

### New Files:
```
OBDScanner/
├── src/
│   ├── config/
│   │   └── firebase.js          # Firebase config
│   ├── screens/
│   │   ├── LoginScreen.jsx      # Auth screen
│   │   ├── CarSelectionScreen.jsx # Car picker
│   │   └── OBDScannerScreen.jsx # Updated with save
│   ├── services/
│   │   └── firebaseService.js   # Firebase operations
│   └── navigation/
│       └── AppNavigator.jsx     # Navigation setup
```

### Updated Dependencies:
```json
{
  "dependencies": {
    "firebase": "^12.3.0",
    "@react-navigation/native": "^7.x.x",
    "@react-navigation/stack": "^7.x.x",
    "react-native-screens": "^4.x.x",
    "react-native-safe-area-context": "^5.x.x"
  }
}
```

## 🌐 Web App Changes Needed

### Updated Files:
```
src/
├── pages/
│   └── ErrorCodesPage.jsx       # Update to use real data
└── services/
    └── firebaseService.js       # Add error code queries
```

## 🚀 Deployment Strategy

### Your Proposed Setup (Perfect!)

1. **Web App**: Self-hosted or just run locally
   ```bash
   yarn dev  # Run when needed
   ```

2. **Mobile App**: GitHub Releases
   ```bash
   # Build APK
   eas build --platform android --profile production
   
   # Create GitHub release
   gh release create v1.0.0 app-release.apk
   ```

3. **Usage**:
   - Download APK from GitHub
   - Run `yarn expo start --host tunnel`
   - Connect mobile app to tunnel
   - Both apps share Firebase backend

### Why This Works:
- ✅ No hosting costs (except Firebase free tier)
- ✅ Easy to update (just push to GitHub)
- ✅ Full control over deployment
- ✅ Works behind NAT/firewall (tunnel mode)
- ✅ Private - only you have access

## 📝 Quick Start Implementation

Want me to:
1. Add Firebase to mobile app
2. Create login screen for mobile
3. Add car selection screen
4. Update OBDScannerScreen to save codes
5. Update web app Error Codes page to show real data

This would make your system fully integrated! 🚀

## 🔒 Security Considerations

- Firebase rules to ensure users only see their own data
- Validate car ownership before saving codes
- Rate limiting on error code saves
- Secure authentication tokens

## 💡 Additional Ideas

**Mobile App Enhancements:**
- Offline mode (save codes, sync later)
- History of scans in mobile app
- Car diagnostics dashboard in mobile
- Voice notifications for critical codes

**Web App Enhancements:**
- Error code analytics/trends
- Integration with maintenance records
- "Fix it" links to tutorials/videos
- Cost estimates for repairs

---

**Ready to implement? Let me know and I'll start with the mobile app Firebase integration!**
