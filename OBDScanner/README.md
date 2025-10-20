# OBD Scanner - React Native Bluetooth OBD-II Diagnostic Tool

A React Native app built with Expo that connects to ELM327 Bluetooth OBD-II adapters to read and clear diagnostic trouble codes from vehicles.

## ✨ Features

- 🔍 **Scan for Bluetooth OBD devices** - Automatic discovery of nearby adapters
- 🔗 **Connect to ELM327 adapters** - Support for ELM327 v1.5 and v2.1
- 📊 **Read diagnostic trouble codes (DTCs)** - Retrieve real error codes from your vehicle
- 🗑️ **Clear error codes** - Clear DTCs directly from the app
- ⚡ **Real-time vehicle data** - Monitor speed, RPM, and more
- 📱 **Native Android support** - Bluetooth Classic with proper permissions

## 📋 Requirements

- **Android device** (Bluetooth Classic not supported on iOS)
- **ELM327 Bluetooth OBD-II adapter** (Get one on Amazon ~$10-30)
- **Vehicle with OBD-II port** (1996+ in US, 2001+ in EU)
- **Development:** Node.js 18+, Yarn, Expo Dev Client

## 🚀 Setup Instructions

### Prerequisites

1. **Install dependencies in main CarLogix project first:**
   ```bash
   cd /path/to/CarLogix
   yarn install
   ```

2. **Navigate to OBDScanner:**
   ```bash
   cd OBDScanner
   yarn install
   ```

### Development Build

Since this app uses native Bluetooth modules, you need a custom development client:

#### Option 1: Build Locally (Requires Android SDK)

```bash
# Make sure you have Android SDK installed
yarn expo run:android
```

This will:
- Generate native Android code via `expo prebuild`
- Install the Bluetooth Classic library
- Build and install the dev client on your connected device

#### Option 2: Build with EAS (Cloud Build - Easier)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Build development client
eas build --profile development --platform android

# Download and install the APK on your device
```

### Running the App

1. **Start the Metro bundler:**
   ```bash
   yarn start
   ```
   
   The app uses tunnel mode by default to work with WSL2/remote development.

2. **Open the app** on your Android device using the Expo Go app or your development build

3. **Scan QR code** from the terminal to load the app

### Testing with Real Hardware

1. **Pair your ELM327 adapter** with your phone via Android Bluetooth settings
2. **Plugin adapter** to your vehicle's OBD-II port (usually under dashboard)
3. **Turn on vehicle ignition** (engine doesn't need to be running)
4. **Open the app** and tap "Scan for Devices"
5. **Select your ELM327 device** from the list
6. **Wait for connection** and initialization
7. **Tap "Scan for Error Codes"** to read DTCs

## 📁 Project Structure

```
src/
├── obd/
│   ├── bluetoothService.js    # Bluetooth connection management
│   └── obdService.js          # OBD-II protocol implementation
└── screens/
    └── OBDScannerScreen.jsx   # Main UI screen
```

## 🔧 Supported OBD Commands

- `03` - Read diagnostic trouble codes
- `04` - Clear diagnostic trouble codes  
- `010C` - Engine RPM
- `010D` - Vehicle speed
- `0100` - Check supported PIDs

## 🔐 Permissions

The app automatically requests these Android permissions:

- `BLUETOOTH` - Basic Bluetooth access
- `BLUETOOTH_ADMIN` - Bluetooth administration
- `BLUETOOTH_CONNECT` - Connect to devices (Android 12+)
- `BLUETOOTH_SCAN` - Scan for devices (Android 12+)
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning

## 🐛 Troubleshooting

### Connection Issues

- Ensure ELM327 is paired in Android Bluetooth settings first
- Check that vehicle ignition is on
- Try disconnecting/reconnecting the adapter
- Some adapters require engine to be running

### App Not Building

- Make sure you're using `--legacy-peer-deps` for npm install
- Clear Expo cache: `npx expo start --clear`
- Rebuild: `npx expo run:android`

### No Devices Found

- Check Bluetooth permissions are granted
- Ensure Location services are enabled
- ELM327 must be paired first in system settings

### Error Code Reading Fails

- Wait for full initialization (can take 10-30 seconds)
- Ensure vehicle is in ready state (ignition on)
- Some vehicles may not support all OBD-II commands

## 🚀 Deployment

### Building APK for Distribution

**Option 1: EAS Build (Recommended)**

```bash
# Build production APK
eas build --platform android --profile production

# Or build AAB for Google Play
eas build --platform android --profile production --local
```

**Option 2: Local Build**

```bash
# Build release APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### Installing APK

**On Windows with WSL2:**

1. Build APK in WSL2
2. Access WSL2 files from Windows: `\\wsl$\Ubuntu\path\to\project`
3. Install using Windows ADB:
   ```cmd
   adb install path\to\app-release.apk
   ```

**Wireless Installation:**

1. Enable Wireless Debugging on Android device
2. Connect via ADB:
   ```bash
   adb connect <device-ip>:<port>
   adb install app-release.apk
   ```

## 🔗 Integration with CarLogix Web

This mobile app complements the CarLogix web application:

- **Web App**: Maintenance tracking, dashboard, cloud sync
- **Mobile App**: Real OBD-II scanning, diagnostic codes
- **Future**: Sync diagnostic data to web app via Firebase

## 📚 Resources

- [ELM327 Command Reference](https://www.elmelectronics.com/wp-content/uploads/2016/07/ELM327DS.pdf)
- [OBD-II PIDs](https://en.wikipedia.org/wiki/OBD-II_PIDs)
- [React Native Bluetooth Classic](https://github.com/kenjdavidson/react-native-bluetooth-classic)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)

## 📝 License

Part of the CarLogix project. See main repository LICENSE file.

## 🤝 Contributing

This is part of the CarLogix ecosystem. See main [README.md](../README.md) for contribution guidelines.

## Hardware Compatibility

**Tested ELM327 Adapters:**
- Standard Bluetooth ELM327 v1.5
- OBDLink LX/MX (Bluetooth Classic mode)

**Vehicle Compatibility:**
- All OBD-II compliant vehicles (1996+ US, 2001+ EU)
- Some older vehicles may have limited command support

## Development Notes

This app uses:
- **Expo SDK 54** with development client
- **react-native-bluetooth-classic** for Bluetooth communication
- **Android-only** (iOS doesn't support Bluetooth Classic)
- **Custom native build** required (not compatible with Expo Go)

## Common DTC Codes

- **P0420** - Catalytic converter efficiency
- **P0171** - System too lean
- **P0300** - Multiple cylinder misfire
- **P0401** - EGR flow insufficient
- **P0442** - EVAP system leak (small)

## License

MIT License - see LICENSE file for details.