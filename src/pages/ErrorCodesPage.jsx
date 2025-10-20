import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider
} from '@mui/material';
import {
  Error,
  CheckCircle,
  Scanner,
  Clear,
  CalendarToday,
  Speed,
  Info,
  History,
  ExpandMore,
  ExpandLess,
  DirectionsCar
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext_Firebase';

const ErrorCodesPage = React.memo(({ cars, errorCodes, onUpdateErrorCode }) => {
  const { formatDate, formatDistance } = useSettings();
  const [showScanHistory, setShowScanHistory] = useState({});

  const toggleScanHistory = (carId) => {
    setShowScanHistory(prev => ({
      ...prev,
      [carId]: !prev[carId]
    }));
  };

  const handleMarkResolved = async (scanId) => {
    try {
      await onUpdateErrorCode(scanId, { status: 'resolved' });
    } catch (error) {
      console.error('Error marking scan as resolved:', error);
    }
  };

  // Group scans by car
  const scansByCar = cars.reduce((acc, car) => {
    const carScans = errorCodes.filter(scan => scan.carId === car.id);
    if (carScans.length > 0) {
      acc[car.id] = {
        car,
        scans: carScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      };
    }
    return acc;
  }, {});

  const totalScans = errorCodes.length;
  const activeScans = errorCodes.filter(scan => scan.status === 'active' || !scan.status).length;
  const resolvedScans = errorCodes.filter(scan => scan.status === 'resolved').length;
  const totalErrorCodes = errorCodes.reduce((sum, scan) => sum + (scan.codes?.length || 0), 0);

  const getCarName = (car) => {
    return `${car.brand} ${car.model} (${car.year})`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'powertrain': return 'error';
      case 'chassis': return 'warning';
      case 'body': return 'info';
      case 'network': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Error Code History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View scanned error codes from your mobile OBD scanner app.
          </Typography>
        </Box>
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Scans
                  </Typography>
                  <Typography variant="h4">
                    {totalScans}
                  </Typography>
                </Box>
                <Scanner sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Scans
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {activeScans}
                  </Typography>
                </Box>
                <Error sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Resolved
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {resolvedScans}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Error Codes
                  </Typography>
                  <Typography variant="h4">
                    {totalErrorCodes}
                  </Typography>
                </Box>
                <Info sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {errorCodes.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Scanner sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No scans yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use the mobile OBD Scanner app to scan your car for error codes.
              They will appear here automatically!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Car Cards with Scan History */}
          <Grid container spacing={3}>
            {Object.values(scansByCar).map(({ car, scans }) => (
              <Grid item xs={12} key={car.id}>
                <Card>
                  <CardContent>
                    {/* Car Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsCar sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="h6">
                            {getCarName(car)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {scans.length} scan{scans.length > 1 ? 's' : ''} recorded
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={showScanHistory[car.id] ? <ExpandLess /> : <ExpandMore />}
                        onClick={() => toggleScanHistory(car.id)}
                      >
                        {showScanHistory[car.id] ? 'Hide' : 'Show'} History
                      </Button>
                    </Box>

                    {/* Recent Scan Summary */}
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Most Recent Scan
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 18 }} />
                          <Typography variant="body2">
                            {formatDate(scans[0].timestamp)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Error sx={{ mr: 1, fontSize: 18, color: 'error.main' }} />
                          <Typography variant="body2">
                            {scans[0].codes?.length || 0} error code{scans[0].codes?.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                        {scans[0].mileage && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Speed sx={{ mr: 1, fontSize: 18 }} />
                            <Typography variant="body2">
                              {formatDistance(scans[0].mileage)}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ ml: 'auto' }}>
                          <Chip 
                            label={scans[0].status === 'resolved' ? 'Resolved' : 'Active'} 
                            size="small" 
                            color={scans[0].status === 'resolved' ? 'success' : 'error'}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Scan History (Collapsible) */}
                    <Collapse in={showScanHistory[car.id]} timeout="auto" unmountOnExit>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <History sx={{ mr: 1 }} />
                        Scan History
                      </Typography>
                      
                      {scans.map((scan, index) => (
                        <Box 
                          key={scan.id} 
                          sx={{ 
                            mb: 2, 
                            p: 2, 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            bgcolor: scan.status === 'resolved' ? 'action.hover' : 'background.paper'
                          }}
                        >
                          {/* Scan Header */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              Scan #{scans.length - index}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(scan.timestamp)}
                              </Typography>
                              {scan.status === 'resolved' ? (
                                <Chip label="Resolved" size="small" color="success" />
                              ) : (
                                <Button 
                                  size="small" 
                                  variant="outlined" 
                                  color="success"
                                  startIcon={<CheckCircle />}
                                  onClick={() => handleMarkResolved(scan.id)}
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </Box>
                          </Box>

                          {/* Error Codes List */}
                          {scan.codes && scan.codes.length > 0 ? (
                            <List dense disablePadding>
                              {scan.codes.map((code, codeIndex) => (
                                <ListItem key={codeIndex} disablePadding sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Error fontSize="small" color="error" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                          {code.code}
                                        </Typography>
                                        {code.type && (
                                          <Chip 
                                            label={code.type} 
                                            size="small" 
                                            color={getTypeColor(code.type)}
                                          />
                                        )}
                                      </Box>
                                    }
                                    secondary={code.description}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No error codes in this scan
                            </Typography>
                          )}

                          {/* Mileage Info */}
                          {scan.mileage && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                              <Speed sx={{ mr: 1, fontSize: 16 }} />
                              <Typography variant="caption" color="text.secondary">
                                Mileage: {formatDistance(scan.mileage)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
});

export default ErrorCodesPage;