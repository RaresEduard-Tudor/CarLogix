/**
 * Comprehensive OBD-II Diagnostic Trouble Code descriptions.
 * Covers the most common powertrain (P), chassis (C), body (B), and network (U) codes.
 */

const DTC_DESCRIPTIONS = {
  // ── Fuel and Air Metering ──────────────────────────────────────
  P0100: 'Mass or Volume Air Flow Circuit Malfunction',
  P0101: 'Mass or Volume Air Flow Circuit Range/Performance',
  P0102: 'Mass or Volume Air Flow Circuit Low Input',
  P0103: 'Mass or Volume Air Flow Circuit High Input',
  P0104: 'Mass or Volume Air Flow Circuit Intermittent',
  P0105: 'Manifold Absolute Pressure/Barometric Pressure Circuit Malfunction',
  P0106: 'Manifold Absolute Pressure/Barometric Pressure Circuit Range/Performance',
  P0107: 'Manifold Absolute Pressure/Barometric Pressure Circuit Low Input',
  P0108: 'Manifold Absolute Pressure/Barometric Pressure Circuit High Input',
  P0110: 'Intake Air Temperature Circuit Malfunction',
  P0111: 'Intake Air Temperature Circuit Range/Performance',
  P0112: 'Intake Air Temperature Circuit Low Input',
  P0113: 'Intake Air Temperature Circuit High Input',
  P0115: 'Engine Coolant Temperature Circuit Malfunction',
  P0116: 'Engine Coolant Temperature Circuit Range/Performance',
  P0117: 'Engine Coolant Temperature Circuit Low Input',
  P0118: 'Engine Coolant Temperature Circuit High Input',
  P0120: 'Throttle Position Sensor/Switch A Circuit Malfunction',
  P0121: 'Throttle Position Sensor/Switch A Circuit Range/Performance',
  P0122: 'Throttle Position Sensor/Switch A Circuit Low Input',
  P0123: 'Throttle Position Sensor/Switch A Circuit High Input',
  P0125: 'Insufficient Coolant Temperature for Closed Loop Fuel Control',
  P0128: 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)',
  P0130: 'O2 Sensor Circuit Malfunction (Bank 1, Sensor 1)',
  P0131: 'O2 Sensor Circuit Low Voltage (Bank 1, Sensor 1)',
  P0132: 'O2 Sensor Circuit High Voltage (Bank 1, Sensor 1)',
  P0133: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 1)',
  P0134: 'O2 Sensor Circuit No Activity Detected (Bank 1, Sensor 1)',
  P0135: 'O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 1)',
  P0136: 'O2 Sensor Circuit Malfunction (Bank 1, Sensor 2)',
  P0137: 'O2 Sensor Circuit Low Voltage (Bank 1, Sensor 2)',
  P0138: 'O2 Sensor Circuit High Voltage (Bank 1, Sensor 2)',
  P0139: 'O2 Sensor Circuit Slow Response (Bank 1, Sensor 2)',
  P0140: 'O2 Sensor Circuit No Activity Detected (Bank 1, Sensor 2)',
  P0141: 'O2 Sensor Heater Circuit Malfunction (Bank 1, Sensor 2)',
  P0150: 'O2 Sensor Circuit Malfunction (Bank 2, Sensor 1)',
  P0151: 'O2 Sensor Circuit Low Voltage (Bank 2, Sensor 1)',
  P0152: 'O2 Sensor Circuit High Voltage (Bank 2, Sensor 1)',
  P0153: 'O2 Sensor Circuit Slow Response (Bank 2, Sensor 1)',
  P0154: 'O2 Sensor Circuit No Activity Detected (Bank 2, Sensor 1)',
  P0155: 'O2 Sensor Heater Circuit Malfunction (Bank 2, Sensor 1)',
  P0156: 'O2 Sensor Circuit Malfunction (Bank 2, Sensor 2)',
  P0157: 'O2 Sensor Circuit Low Voltage (Bank 2, Sensor 2)',
  P0158: 'O2 Sensor Circuit High Voltage (Bank 2, Sensor 2)',
  P0159: 'O2 Sensor Circuit Slow Response (Bank 2, Sensor 2)',
  P0160: 'O2 Sensor Circuit No Activity Detected (Bank 2, Sensor 2)',
  P0161: 'O2 Sensor Heater Circuit Malfunction (Bank 2, Sensor 2)',
  P0170: 'Fuel Trim Malfunction (Bank 1)',
  P0171: 'System Too Lean (Bank 1)',
  P0172: 'System Too Rich (Bank 1)',
  P0173: 'Fuel Trim Malfunction (Bank 2)',
  P0174: 'System Too Lean (Bank 2)',
  P0175: 'System Too Rich (Bank 2)',

  // ── Ignition System / Misfire ──────────────────────────────────
  P0200: 'Injector Circuit Malfunction',
  P0201: 'Injector Circuit Malfunction — Cylinder 1',
  P0202: 'Injector Circuit Malfunction — Cylinder 2',
  P0203: 'Injector Circuit Malfunction — Cylinder 3',
  P0204: 'Injector Circuit Malfunction — Cylinder 4',
  P0205: 'Injector Circuit Malfunction — Cylinder 5',
  P0206: 'Injector Circuit Malfunction — Cylinder 6',
  P0207: 'Injector Circuit Malfunction — Cylinder 7',
  P0208: 'Injector Circuit Malfunction — Cylinder 8',
  P0217: 'Engine Over Temperature Condition',
  P0218: 'Transmission Over Temperature Condition',
  P0219: 'Engine Over Speed Condition',
  P0220: 'Throttle/Pedal Position Sensor/Switch B Circuit',
  P0230: 'Fuel Pump Primary Circuit Malfunction',
  P0261: 'Cylinder 1 Injector Circuit Low',
  P0262: 'Cylinder 1 Injector Circuit High',
  P0263: 'Cylinder 1 Contribution/Balance Fault',
  P0264: 'Cylinder 2 Injector Circuit Low',
  P0265: 'Cylinder 2 Injector Circuit High',
  P0267: 'Cylinder 3 Injector Circuit Low',
  P0268: 'Cylinder 3 Injector Circuit High',
  P0270: 'Cylinder 4 Injector Circuit Low',
  P0271: 'Cylinder 4 Injector Circuit High',
  P0300: 'Random/Multiple Cylinder Misfire Detected',
  P0301: 'Cylinder 1 Misfire Detected',
  P0302: 'Cylinder 2 Misfire Detected',
  P0303: 'Cylinder 3 Misfire Detected',
  P0304: 'Cylinder 4 Misfire Detected',
  P0305: 'Cylinder 5 Misfire Detected',
  P0306: 'Cylinder 6 Misfire Detected',
  P0307: 'Cylinder 7 Misfire Detected',
  P0308: 'Cylinder 8 Misfire Detected',
  P0325: 'Knock Sensor 1 Circuit Malfunction (Bank 1)',
  P0326: 'Knock Sensor 1 Circuit Range/Performance (Bank 1)',
  P0327: 'Knock Sensor 1 Circuit Low Input (Bank 1)',
  P0328: 'Knock Sensor 1 Circuit High Input (Bank 1)',
  P0330: 'Knock Sensor 2 Circuit Malfunction (Bank 2)',
  P0335: 'Crankshaft Position Sensor A Circuit Malfunction',
  P0336: 'Crankshaft Position Sensor A Circuit Range/Performance',
  P0340: 'Camshaft Position Sensor Circuit Malfunction',
  P0341: 'Camshaft Position Sensor Circuit Range/Performance',

  // ── Emission Controls ──────────────────────────────────────────
  P0400: 'Exhaust Gas Recirculation Flow Malfunction',
  P0401: 'Exhaust Gas Recirculation Flow Insufficient Detected',
  P0402: 'Exhaust Gas Recirculation Flow Excessive Detected',
  P0410: 'Secondary Air Injection System Malfunction',
  P0411: 'Secondary Air Injection System Incorrect Flow Detected',
  P0420: 'Catalyst System Efficiency Below Threshold (Bank 1)',
  P0421: 'Warm Up Catalyst Efficiency Below Threshold (Bank 1)',
  P0430: 'Catalyst System Efficiency Below Threshold (Bank 2)',
  P0440: 'Evaporative Emission Control System Malfunction',
  P0441: 'Evaporative Emission Control System Incorrect Purge Flow',
  P0442: 'Evaporative Emission Control System Leak Detected (Small Leak)',
  P0443: 'Evaporative Emission Control System Purge Control Valve Circuit Malfunction',
  P0446: 'Evaporative Emission Control System Vent Control Circuit Malfunction',
  P0449: 'Evaporative Emission Control System Vent Valve/Solenoid Circuit Malfunction',
  P0450: 'Evaporative Emission Control System Pressure Sensor Malfunction',
  P0451: 'Evaporative Emission Control System Pressure Sensor Range/Performance',
  P0452: 'Evaporative Emission Control System Pressure Sensor Low Input',
  P0453: 'Evaporative Emission Control System Pressure Sensor High Input',
  P0455: 'Evaporative Emission Control System Leak Detected (Gross Leak)',
  P0456: 'Evaporative Emission Control System Leak Detected (Very Small Leak)',

  // ── Speed / Idle Control ───────────────────────────────────────
  P0500: 'Vehicle Speed Sensor Malfunction',
  P0501: 'Vehicle Speed Sensor Range/Performance',
  P0505: 'Idle Control System Malfunction',
  P0506: 'Idle Control System RPM Lower Than Expected',
  P0507: 'Idle Control System RPM Higher Than Expected',

  // ── Transmission ───────────────────────────────────────────────
  P0600: 'Serial Communication Link Malfunction',
  P0601: 'Internal Control Module Memory Check Sum Error',
  P0602: 'Control Module Programming Error',
  P0603: 'Internal Control Module Keep Alive Memory (KAM) Error',
  P0700: 'Transmission Control System Malfunction',
  P0705: 'Transmission Range Sensor Circuit Malfunction',
  P0710: 'Transmission Fluid Temperature Sensor Circuit Malfunction',
  P0715: 'Input/Turbine Speed Sensor Circuit Malfunction',
  P0720: 'Output Speed Sensor Circuit Malfunction',
  P0725: 'Engine Speed Input Circuit Malfunction',
  P0730: 'Incorrect Gear Ratio',
  P0731: 'Gear 1 Incorrect Ratio',
  P0732: 'Gear 2 Incorrect Ratio',
  P0733: 'Gear 3 Incorrect Ratio',
  P0734: 'Gear 4 Incorrect Ratio',
  P0740: 'Torque Converter Clutch Circuit Malfunction',
  P0741: 'Torque Converter Clutch Circuit Performance or Stuck Off',
  P0743: 'Torque Converter Clutch Circuit Electrical',
  P0750: 'Shift Solenoid A Malfunction',
  P0751: 'Shift Solenoid A Performance or Stuck Off',
  P0755: 'Shift Solenoid B Malfunction',
  P0756: 'Shift Solenoid B Performance or Stuck Off',
  P0760: 'Shift Solenoid C Malfunction',
  P0765: 'Shift Solenoid D Malfunction',

  // ── Common additional powertrain codes ─────────────────────────
  P1000: 'OBD-II Monitor Testing Not Complete',
  P1101: 'Intake Air Flow System Performance',
  P1131: 'Lack of Upstream Heated O2 Sensor Switch — Lean (Bank 1)',
  P1151: 'Lack of Upstream Heated O2 Sensor Switch — Lean (Bank 2)',
  P1211: 'ABS/TCS Control Unit Malfunction',

  // ── Chassis (C) ────────────────────────────────────────────────
  C0035: 'Left Front Wheel Speed Circuit Malfunction',
  C0040: 'Right Front Wheel Speed Circuit Malfunction',
  C0045: 'Left Rear Wheel Speed Circuit Malfunction',
  C0050: 'Right Rear Wheel Speed Circuit Malfunction',
  C0060: 'Left Front ABS Solenoid Circuit Malfunction',
  C0065: 'Right Front ABS Solenoid Circuit Malfunction',
  C0070: 'Left Rear ABS Solenoid Circuit Malfunction',
  C0075: 'Right Rear ABS Solenoid Circuit Malfunction',
  C0110: 'Pump Motor Circuit Malfunction',
  C0242: 'PCM Indicated Traction Control Malfunction',
  C0300: 'Rear Speed Sensor Malfunction',

  // ── Body (B) ───────────────────────────────────────────────────
  B0001: 'Driver Frontal Stage 1 Deployment Control',
  B0002: 'Driver Frontal Stage 2 Deployment Control',
  B0010: 'Passenger Frontal Stage 1 Deployment Control',
  B1000: 'ECU Malfunction — Internal',
  B1200: 'Climate Control Push Button Circuit',
  B1318: 'Battery Voltage Low',
  B1325: 'Battery Voltage High',
  B1342: 'ECU is Faulted',
  B1601: 'PATS Received Incorrect Key Code',
  B2100: 'Door Handle Sensor Circuit Open',

  // ── Network (U) ────────────────────────────────────────────────
  U0001: 'High Speed CAN Communication Bus',
  U0073: 'Control Module Communication Bus Off',
  U0100: 'Lost Communication with ECM/PCM',
  U0101: 'Lost Communication with TCM',
  U0121: 'Lost Communication with Anti-Lock Brake System (ABS) Control Module',
  U0140: 'Lost Communication with Body Control Module',
  U0155: 'Lost Communication with Instrument Panel Cluster (IPC) Control Module',
  U0168: 'Lost Communication with Vehicle Immobilizer Control Module',
  U0401: 'Invalid Data Received from ECM/PCM',
  U0426: 'Invalid Data Received from Steering Angle Sensor Module',
};

/**
 * Map DTC prefixes to severity buckets.
 * - Misfires, fuel issues, and overheating are HIGH
 * - Emission / catalyst codes are MEDIUM
 * - Everything else defaults to LOW
 */
const HIGH_SEVERITY_PREFIXES = [
  'P030', 'P017', 'P021', 'P021', 'P060', 'P020',
];
const MEDIUM_SEVERITY_PREFIXES = [
  'P042', 'P043', 'P044', 'P040', 'P041', 'P045',
  'P050', 'P070', 'P073', 'P074', 'P075',
];

export function getDTCDescription(code) {
  return DTC_DESCRIPTIONS[code] || `Diagnostic Trouble Code ${code}`;
}

export function getDTCSeverity(code) {
  if (!code) return 'low';
  for (const prefix of HIGH_SEVERITY_PREFIXES) {
    if (code.startsWith(prefix)) return 'high';
  }
  for (const prefix of MEDIUM_SEVERITY_PREFIXES) {
    if (code.startsWith(prefix)) return 'medium';
  }
  // Network (U) and body (B) default medium; chassis (C) default medium
  if (code.startsWith('U') || code.startsWith('C')) return 'medium';
  return 'low';
}
