import React, { useState } from 'react';
import { useFirebaseCarLogix } from './hooks/useFirebaseCarLogix';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CarsPage from './pages/CarsPage';
import MaintenancePage from './pages/MaintenancePage';
import ErrorCodesPage from './pages/ErrorCodesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {
    user,
    cars,
    maintenanceRecords,
    errorCodes,
    isLoggedIn,
    authLoading,
    register,
    login,
    logout,
    addCar,
    updateCar,
    addMaintenanceRecord,
    clearErrorCode,
    scanForErrors
  } = useFirebaseCarLogix();

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <ThemeContextProvider>
        <SettingsProvider>
          <LoginPage onLogin={login} onRegister={register} />
        </SettingsProvider>
      </ThemeContextProvider>
    );
  }

  // Render page content based on current page
  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage 
            cars={cars}
            maintenanceRecords={maintenanceRecords}
            errorCodes={errorCodes}
          />
        );
      case 'cars':
        return (
          <CarsPage 
            cars={cars}
            onAddCar={addCar}
            onUpdateCar={updateCar}
          />
        );
      case 'maintenance':
        return (
          <MaintenancePage 
            cars={cars}
            maintenanceRecords={maintenanceRecords}
            onAddMaintenanceRecord={addMaintenanceRecord}
          />
        );
      case 'errors':
        return (
          <ErrorCodesPage 
            cars={cars}
            errorCodes={errorCodes}
            onClearError={clearErrorCode}
            onScanForErrors={scanForErrors}
          />
        );
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage cars={cars} maintenanceRecords={maintenanceRecords} errorCodes={errorCodes} />;
    }
  };

  return (
    <ThemeContextProvider>
      <SettingsProvider>
        <DashboardLayout
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          user={user}
          onLogout={logout}
        >
          {renderPageContent()}
        </DashboardLayout>
      </SettingsProvider>
    </ThemeContextProvider>
  );
}

export default App;