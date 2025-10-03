# OBD Scanner - React Native Bluetooth OBD-II Diagnostic Tool

A React Native app built with Expo that connects to ELM327 Bluetooth OBD-II adapters to read and clear diagnostic trouble codes from vehicles.

## Features

- 🔍 Scan for Bluetooth OBD devices
- 🔗 Connect to ELM327 adapters  
- 📊 Read diagnostic trouble codes (DTCs)
- 🗑️ Clear error codes
- ⚡ Real-time vehicle data (speed, RPM)
- 📱 Native Android support with proper permissions

## Requirements

- **Android device** (Bluetooth Classic not supported on iOS)
- **ELM327 Bluetooth OBD-II adapter**
- **Vehicle with OBD-II port** (1996+ in US, 2001+ in EU)
- **Expo Dev Client** (for native modules)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Build Development Client

Since this app uses native Bluetooth modules, you need to build a custom Expo development client:

```bash
# Build for Android
npx expo run:android
```

This will:
- Generate native Android code
- Install the Bluetooth library
- Build and install the development client on your connected device

### 3. Start Development Server

```bash
npm start
```

### 4. Testing with Real Hardware

1. **Pair your ELM327 adapter** with your phone via Android Bluetooth settings
2. **Plugin adapter** to your vehicle's OBD-II port (usually under dashboard)
3. **Turn on vehicle ignition** (engine doesn't need to be running)
4. **Open the app** and tap "Scan for Devices"
5. **Select your ELM327 device** from the list
6. **Wait for connection** and initialization
7. **Tap "Scan for Error Codes"** to read DTCs

## Project Structure

```
src/
├── obd/
│   ├── bluetoothService.js    # Bluetooth connection management
│   └── obdService.js          # OBD-II protocol implementation
└── screens/
    └── OBDScannerScreen.jsx   # Main UI screen
```

## Supported OBD Commands

- `03` - Read diagnostic trouble codes
- `04` - Clear diagnostic trouble codes  
- `010C` - Engine RPM
- `010D` - Vehicle speed
- `0100` - Check supported PIDs

## Permissions

The app automatically requests these Android permissions:
- `BLUETOOTH` - Basic Bluetooth access
- `BLUETOOTH_ADMIN` - Bluetooth administration
- `BLUETOOTH_CONNECT` - Connect to devices (Android 12+)
- `BLUETOOTH_SCAN` - Scan for devices (Android 12+)
- `ACCESS_FINE_LOCATION` - Required for Bluetooth scanning

## Troubleshooting

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