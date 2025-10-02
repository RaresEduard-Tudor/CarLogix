import React, { useState, Suspense } from 'react';
import { useFirebaseCarLogix } from './hooks/useFirebaseCarLogix';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext_Firebase';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import { CircularProgress, Box } from '@mui/material';

// Lazy load pages for better performance
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CarsPage = React.lazy(() => import('./pages/CarsPage'));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));
const ErrorCodesPage = React.lazy(() => import('./pages/ErrorCodesPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

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

  // Loading component for lazy loaded pages
  const PageLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );

  // Render page content based on current page
  const renderPageContent = () => {
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
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
              return (
                <DashboardPage 
                  cars={cars}
                  maintenanceRecords={maintenanceRecords}
                  errorCodes={errorCodes}
                />
              );
          }
        })()}
      </Suspense>
    );
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