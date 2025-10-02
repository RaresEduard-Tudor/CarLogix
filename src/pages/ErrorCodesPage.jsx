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
  ListItemIcon
} from '@mui/material';
import {
  Error,
  CheckCircle,
  Scanner,
  Clear,
  CalendarToday,
  Speed,
  Info
} from '@mui/icons-material';

const ErrorCodesPage = ({ cars, errorCodes, onScanForErrors, onClearErrorCode }) => {
  const [selectedCarId, setSelectedCarId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleScan = async () => {
    if (!selectedCarId) return;
    
    setScanning(true);
    try {
      const results = await onScanForErrors(selectedCarId);
      setScanResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const handleClearError = (errorId) => {
    onClearErrorCode(errorId);
  };

  const filteredErrors = selectedCarId 
    ? errorCodes.filter(error => error.carId === selectedCarId)
    : errorCodes;

  const sortedErrors = filteredErrors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const activeErrors = filteredErrors.filter(error => error.status === 'active');
  const clearedErrors = filteredErrors.filter(error => error.status === 'cleared');

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model} (${car.year})` : 'Unknown Car';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'moderate': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Error Codes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scan for diagnostic trouble codes and track error history.
          </Typography>
        </Box>
      </Box>

      {cars.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body1">
            Please add a car first before scanning for error codes.
          </Typography>
        </Alert>
      ) : (
        <>
          {/* Scanner Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Scanner sx={{ mr: 1 }} />
                OBD-II Scanner (Mock)
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>MVP Demo:</strong> This is a mock scanner that randomly generates sample error codes for testing.
                In the full version, this would connect to a real OBD-II adapter.
              </Alert>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Car to Scan</InputLabel>
                    <Select
                      value={selectedCarId}
                      label="Select Car to Scan"
                      onChange={(e) => setSelectedCarId(e.target.value)}
                    >
                      {cars.map((car) => (
                        <MenuItem key={car.id} value={car.id}>
                          {getCarName(car.id)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    startIcon={scanning ? <CircularProgress size={20} /> : <Scanner />}
                    onClick={handleScan}
                    disabled={!selectedCarId || scanning}
                    fullWidth
                  >
                    {scanning ? 'Scanning...' : 'Start Scan'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Active Errors
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {activeErrors.length}
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
                        Cleared Errors
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {clearedErrors.length}
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
                        Total Errors
                      </Typography>
                      <Typography variant="h4">
                        {filteredErrors.length}
                      </Typography>
                    </Box>
                    <Info sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <FormControl fullWidth size="small">
                    <InputLabel>Filter by Car</InputLabel>
                    <Select
                      value={selectedCarId}
                      label="Filter by Car"
                      onChange={(e) => setSelectedCarId(e.target.value)}
                    >
                      <MenuItem value="">All Cars</MenuItem>
                      {cars.map((car) => (
                        <MenuItem key={car.id} value={car.id}>
                          {getCarName(car.id)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Error Codes Table */}
          {sortedErrors.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No error codes found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedCarId ? 
                    'This car has no recorded error codes. Run a scan to check for new issues.' :
                    'No error codes recorded yet. Select a car and run a scan to get started.'
                  }
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Car</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Mileage</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {error.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {error.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={error.severity} 
                          size="small" 
                          color={getSeverityColor(error.severity)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getCarName(error.carId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                          {new Date(error.timestamp).toLocaleDateString()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {error.mileage ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Speed sx={{ mr: 1, fontSize: 16 }} />
                            {error.mileage.toLocaleString()}
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={error.status} 
                          size="small" 
                          color={error.status === 'active' ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        {error.status === 'active' && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleClearError(error.id)}
                            title="Mark as cleared"
                          >
                            <Clear />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Scan Results Dialog */}
      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Scanner sx={{ mr: 1 }} />
          Scan Results
        </DialogTitle>
        <DialogContent>
          {scanResults && scanResults.length > 0 ? (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Found {scanResults.length} error code{scanResults.length > 1 ? 's' : ''}
              </Alert>
              <List>
                {scanResults.map((error) => (
                  <ListItem key={error.id}>
                    <ListItemIcon>
                      <Error color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${error.code} - ${error.severity.toUpperCase()}`}
                      secondary={error.description}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 2 }}>
                <CheckCircle sx={{ mr: 1 }} />
                No error codes found!
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Your vehicle is running clean with no diagnostic trouble codes detected.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResults(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ErrorCodesPage;