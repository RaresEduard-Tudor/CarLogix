import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Fab,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  Edit,
  Build,
  Close,
  CalendarToday,
  Speed,
  AttachMoney,
  LocationOn,
  Notes
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { serviceTypes } from '../data/mockData';

const MaintenancePage = ({ cars, maintenanceRecords, onAddMaintenanceRecord, onUpdateMaintenanceRecord }) => {
  const { formatDate, formatCurrency, formatDistance } = useSettings();
  const [open, setOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [formData, setFormData] = useState({
    carId: '',
    serviceType: '',
    description: '',
    mileage: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    location: '',
    notes: ''
  });

  const handleOpen = () => {
    const defaultCarId = cars.length === 1 ? cars[0].id : '';
    setFormData({
      carId: defaultCarId,
      serviceType: '',
      description: '',
      mileage: '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      location: '',
      notes: ''
    });
    setSelectedCarId(defaultCarId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [field]: value
    });
    
    if (field === 'carId') {
      setSelectedCarId(value);
    }
  };

  const handleSubmit = () => {
    const recordData = {
      ...formData,
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      cost: formData.cost ? parseFloat(formData.cost) : 0
    };

    onAddMaintenanceRecord(recordData);
    handleClose();
  };

  const isFormValid = formData.carId && formData.serviceType && formData.date;

  const filteredRecords = selectedCarId 
    ? maintenanceRecords.filter(record => record.carId === selectedCarId)
    : maintenanceRecords;

  const sortedRecords = filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getCarName = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model} (${car.year})` : 'Unknown Car';
  };

  const totalSpent = filteredRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Maintenance Records
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track all your vehicle maintenance and service history.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpen}
          disabled={cars.length === 0}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add Record
        </Button>
      </Box>

      {cars.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body1">
            Please add a car first before recording maintenance.
          </Typography>
        </Alert>
      ) : (
        <>
          {/* Car Filter */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
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
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Records: {filteredRecords.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent: {formatCurrency(totalSpent)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Maintenance Records Table */}
          {sortedRecords.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Build sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No maintenance records yet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Start tracking your vehicle maintenance to keep detailed service history.
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Car</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Mileage</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                          {formatDate(record.date)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getCarName(record.carId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={record.serviceType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {record.mileage ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Speed sx={{ mr: 1, fontSize: 16 }} />
                            {formatDistance(record.mileage)}
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {record.cost > 0 ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoney sx={{ mr: 1, fontSize: 16 }} />
                            {formatCurrency(record.cost)}
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {record.location ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                            <Typography variant="body2">
                              {record.location}
                            </Typography>
                          </Box>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add maintenance record"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={handleOpen}
        disabled={cars.length === 0}
      >
        <Add />
      </Fab>

      {/* Add Maintenance Record Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Maintenance Record</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Car</InputLabel>
                <Select
                  value={formData.carId}
                  label="Car"
                  onChange={handleChange('carId')}
                >
                  {cars.map((car) => (
                    <MenuItem key={car.id} value={car.id}>
                      {getCarName(car.id)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={formData.serviceType}
                  label="Service Type"
                  onChange={handleChange('serviceType')}
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                fullWidth
                required
                type="date"
                value={formData.date}
                onChange={handleChange('date')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Brief description of the service performed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mileage"
                fullWidth
                type="number"
                value={formData.mileage}
                onChange={handleChange('mileage')}
                placeholder="Odometer reading at service"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cost"
                fullWidth
                type="number"
                value={formData.cost}
                onChange={handleChange('cost')}
                placeholder="0.00"
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: <AttachMoney sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange('location')}
                placeholder="Where was the service performed?"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="Additional notes about the service"
                InputProps={{
                  startAdornment: <Notes sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!isFormValid}>
            Add Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenancePage;