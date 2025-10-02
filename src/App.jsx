import React, { useState } from 'react';
import { useCarLogix } from './hooks/useCarLogix';
import { ThemeContextProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CarsPage from './pages/CarsPage';
import MaintenancePage from './pages/MaintenancePage';
import ErrorCodesPage from './pages/ErrorCodesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {
    user,
    cars,
    maintenanceRecords,
    errorCodes,
    isLoggedIn,
    login,
    logout,
    addCar,
    updateCar,
    addMaintenanceRecord,
    clearErrorCode,
    scanForErrors
  } = useCarLogix();

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <ThemeContextProvider>
        <LoginPage onLogin={login} />
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
      default:
        return <DashboardPage cars={cars} maintenanceRecords={maintenanceRecords} errorCodes={errorCodes} />;
    }
  };

  return (
    <ThemeContextProvider>
      <DashboardLayout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
        onLogout={logout}
      >
        {renderPageContent()}
      </DashboardLayout>
    </ThemeContextProvider>
  );
}

export default App;