import React, { createContext, useContext, useState, useEffect } from 'react';

// Create settings context
const SettingsContext = createContext();

// Custom hook to use settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Available currencies with their symbols and exchange rates (mock)
export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', rate: 1.0 },
  EUR: { symbol: '€', name: 'Euro', rate: 0.85 },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.73 },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.25 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.35 },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 110.0 },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', rate: 0.92 },
  SEK: { symbol: 'kr', name: 'Swedish Krona', rate: 8.5 },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', rate: 8.8 },
  DKK: { symbol: 'kr', name: 'Danish Krone', rate: 6.3 }
};

// Available distance units
export const distanceUnits = {
  miles: { name: 'Miles', abbr: 'mi', toMiles: 1.0 },
  kilometers: { name: 'Kilometers', abbr: 'km', toMiles: 0.621371 }
};

// Available date formats
export const dateFormats = {
  'MM/DD/YYYY': { 
    name: 'US Format', 
    example: '10/02/2025',
    locale: 'en-US',
    options: { month: '2-digit', day: '2-digit', year: 'numeric' }
  },
  'DD/MM/YYYY': { 
    name: 'European Format', 
    example: '02/10/2025',
    locale: 'en-GB',
    options: { day: '2-digit', month: '2-digit', year: 'numeric' }
  },
  'YYYY-MM-DD': { 
    name: 'ISO Format', 
    example: '2025-10-02',
    locale: 'sv-SE',
    options: { year: 'numeric', month: '2-digit', day: '2-digit' }
  },
  'DD MMM YYYY': { 
    name: 'Long Format', 
    example: '02 Oct 2025',
    locale: 'en-US',
    options: { day: '2-digit', month: 'short', year: 'numeric' }
  },
  'MMM DD, YYYY': { 
    name: 'US Long Format', 
    example: 'Oct 02, 2025',
    locale: 'en-US',
    options: { month: 'short', day: '2-digit', year: 'numeric' }
  }
};

// Default settings
const defaultSettings = {
  currency: 'USD',
  distanceUnit: 'miles',
  dateFormat: 'MM/DD/YYYY', // US format by default
  theme: 'light' // This will be managed by ThemeContext, but keeping for completeness
};

// Settings context provider component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('carlogix-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('carlogix-settings', JSON.stringify(settings));
  }, [settings]);

  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple settings at once
  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Utility functions for formatting
  const formatCurrency = (amount, currencyCode = settings.currency) => {
    const currency = currencies[currencyCode];
    if (!currency) return `$${amount.toFixed(2)}`;
    
    const convertedAmount = amount * currency.rate;
    return `${currency.symbol}${convertedAmount.toFixed(2)}`;
  };

  const formatDistance = (distance, unit = settings.distanceUnit) => {
    const distanceUnit = distanceUnits[unit];
    if (!distanceUnit) return `${distance} mi`;
    
    const convertedDistance = unit === 'kilometers' ? distance * 1.60934 : distance;
    return `${Math.round(convertedDistance).toLocaleString()} ${distanceUnit.abbr}`;
  };

  const formatDate = (dateString, formatKey = settings.dateFormat) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    
    const format = dateFormats[formatKey];
    if (!format) return date.toLocaleDateString('en-US'); // Fallback
    
    // Use the locale and options from the format configuration
    return date.toLocaleDateString(format.locale, format.options);
  };

  // Get formatted date example for current setting
  const getDateExample = (formatKey = settings.dateFormat) => {
    const today = new Date();
    return formatDate(today.toISOString().split('T')[0], formatKey);
  };

  // Get user's preferred currency info
  const getCurrentCurrency = () => currencies[settings.currency];
  
  // Get user's preferred distance unit info
  const getCurrentDistanceUnit = () => distanceUnits[settings.distanceUnit];

  // Get user's preferred date format info
  const getCurrentDateFormat = () => dateFormats[settings.dateFormat];

  const value = {
    // Settings state
    settings,
    
    // Update functions
    updateSetting,
    updateSettings,
    resetSettings,
    
    // Formatting functions
    formatCurrency,
    formatDistance,
    formatDate,
    getDateExample,
    
    // Helper functions
    getCurrentCurrency,
    getCurrentDistanceUnit,
    getCurrentDateFormat,
    
    // Constants
    currencies,
    distanceUnits,
    dateFormats
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};