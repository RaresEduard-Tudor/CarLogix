// Mock data for CarLogix MVP 1

// Mock user (no real auth)
export const mockUser = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john.doe@example.com'
};

// Mock car data
export const mockCar = {
  id: 'car-001',
  brand: 'Toyota',
  model: 'Camry',
  year: 2018,
  vin: '1HGBH41JXMN109186',
  mileage: 65000,
  color: 'Silver',
  addedDate: '2024-01-15',
  owners: ['user-001'] // Support for multiple owners in future
};

// Sample maintenance records
export const mockMaintenanceRecords = [
  {
    id: 'maint-001',
    carId: 'car-001',
    serviceType: 'Oil Change',
    description: 'Regular oil change with synthetic oil',
    mileage: 65000,
    date: '2024-10-01',
    cost: 45.99,
    location: 'Quick Lube Express',
    notes: 'Used 5W-30 synthetic oil. Next change at 68,000 miles.',
    receiptUrl: null
  },
  {
    id: 'maint-002',
    carId: 'car-001',
    serviceType: 'Tire Rotation',
    description: 'Rotated all four tires',
    mileage: 64500,
    date: '2024-09-15',
    cost: 25.00,
    location: 'Local Tire Shop',
    notes: 'Front tires showed slight wear on inner edge.',
    receiptUrl: null
  },
  {
    id: 'maint-003',
    carId: 'car-001',
    serviceType: 'Brake Inspection',
    description: 'Routine brake system inspection',
    mileage: 63000,
    date: '2024-08-20',
    cost: 0.00,
    location: 'DIY',
    notes: 'Brake pads at 60% life remaining. Good condition.',
    receiptUrl: null
  }
];

// Sample error codes from OBD-II
export const mockErrorCodes = [
  {
    id: 'error-001',
    carId: 'car-001',
    code: 'P0420',
    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    severity: 'moderate',
    timestamp: '2024-09-28T14:30:00Z',
    mileage: 64800,
    status: 'active',
    notes: 'May need catalytic converter replacement soon'
  },
  {
    id: 'error-002',
    carId: 'car-001',
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    severity: 'low',
    timestamp: '2024-09-10T09:15:00Z',
    mileage: 64200,
    status: 'cleared',
    notes: 'Resolved after cleaning mass airflow sensor'
  }
];

// Service types for dropdown
export const serviceTypes = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Transmission Service',
  'Engine Tune-up',
  'Air Filter',
  'Cabin Filter',
  'Battery Replacement',
  'Spark Plugs',
  'Coolant Flush',
  'Inspection',
  'Other'
];

// Error code severity levels
export const errorSeverities = {
  low: { color: '#4caf50', label: 'Low' },
  moderate: { color: '#ff9800', label: 'Moderate' },
  high: { color: '#f44336', label: 'High' },
  critical: { color: '#d32f2f', label: 'Critical' }
};

// Sample OBD-II error codes for mock scanner
export const sampleErrorCodes = [
  { code: 'P0301', description: 'Cylinder 1 Misfire Detected', severity: 'moderate' },
  { code: 'P0420', description: 'Catalyst System Efficiency Below Threshold', severity: 'moderate' },
  { code: 'P0171', description: 'System Too Lean (Bank 1)', severity: 'low' },
  { code: 'P0440', description: 'Evaporative Emission Control System Malfunction', severity: 'low' },
  { code: 'P0128', description: 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)', severity: 'moderate' },
  { code: 'P0455', description: 'Evaporative Emission Control System Leak Detected (Gross Leak)', severity: 'high' }
];