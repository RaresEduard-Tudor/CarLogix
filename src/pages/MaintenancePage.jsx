import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  Select,
  Alert
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
  Notes,
  Alarm,
  Download
} from '@mui/icons-material';
import { useSettings, currencies } from '../contexts/SettingsContext';
import { serviceTypes } from '../data/carData';

const MaintenancePage = React.memo(({ cars, maintenanceRecords, onAddMaintenanceRecord }) => {
  const { formatDate, formatCurrency, formatDistance, settings, distanceUnits } = useSettings();
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
    notes: '',
    // Reminder settings
    reminderMileageInterval: '',
    reminderTimeInterval: '',
    reminderTimeUnit: 'months' // months, years
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
      notes: '',
      reminderMileageInterval: '',
      reminderTimeInterval: '',
      reminderTimeUnit: 'months'
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
    // Normalize to base units (miles, USD) so formatDistance/formatCurrency display correctly
    const rawMileage = formData.mileage ? parseInt(formData.mileage) : undefined;
    const mileageInMiles = rawMileage !== undefined && settings.distanceUnit === 'kilometers'
      ? Math.round(rawMileage / 1.60934)
      : rawMileage;

    const rawCost = formData.cost ? parseFloat(formData.cost) : 0;
    const costInUSD = rawCost / (currencies[settings.currency]?.rate || 1);

    const rawReminder = formData.reminderMileageInterval ? parseInt(formData.reminderMileageInterval) : null;
    const reminderInMiles = rawReminder !== null && settings.distanceUnit === 'kilometers'
      ? Math.round(rawReminder / 1.60934)
      : rawReminder;

    const recordData = {
      ...formData,
      mileage: mileageInMiles,
      cost: costInUSD,
      reminderMileageInterval: reminderInMiles,
      reminderTimeInterval: formData.reminderTimeInterval ? parseInt(formData.reminderTimeInterval) : null
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

  const exportToPDF = () => {
    const doc = new jsPDF();
    const carName = selectedCarId ? getCarName(selectedCarId) : 'All Cars';
    
    // Title
    doc.setFontSize(20);
    doc.text('CarLogix - Maintenance Records', 20, 20);
    
    // Car info
    doc.setFontSize(14);
    doc.text(`Vehicle: ${carName}`, 20, 35);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Total Records: ${filteredRecords.length}`, 20, 55);
    doc.text(`Total Spent: ${formatCurrency(totalSpent)}`, 20, 65);
    
    // Check if autoTable is available
    if (typeof doc.autoTable === 'function') {
      // Table data
      const tableColumns = ['Date', 'Service Type', 'Description', 'Mileage', 'Cost', 'Location'];
      const tableRows = sortedRecords.map(record => [
        formatDate(record.date),
        record.serviceType || 'N/A',
        record.description || 'N/A',
        record.mileage ? formatDistance(record.mileage) : 'N/A',
        record.cost ? formatCurrency(record.cost) : '$0.00',
        record.location || 'N/A'
      ]);
      
      // Add table
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 75,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    } else {
      // Fallback: Simple text-based export
      doc.setFontSize(10);
      let yPosition = 85;
      
      sortedRecords.forEach((record, index) => {
        if (yPosition > 280) { // New page if needed
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${index + 1}. ${formatDate(record.date)} - ${record.serviceType || 'N/A'}`, 20, yPosition);
        yPosition += 10;
        doc.text(`   Description: ${record.description || 'N/A'}`, 20, yPosition);
        yPosition += 10;
        doc.text(`   Mileage: ${record.mileage ? formatDistance(record.mileage) : 'N/A'} | Cost: ${record.cost ? formatCurrency(record.cost) : '$0.00'}`, 20, yPosition);
        yPosition += 15;
      });
    }
    
    // Save the PDF
    const fileName = selectedCarId 
      ? `${getCarName(selectedCarId)}_Maintenance_Records.pdf`
      : 'All_Cars_Maintenance_Records.pdf';
    doc.save(fileName);
  };

  const totalSpent = filteredRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Maintenance Records
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Track your vehicle service history
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
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Records: {filteredRecords.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent: {formatCurrency(totalSpent)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download />}
                      onClick={exportToPDF}
                      disabled={filteredRecords.length === 0}
                    >
                      Export PDF
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Maintenance Records Table */}
          {sortedRecords.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Box sx={{
                  width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Build sx={{ fontSize: 36, color: '#fff' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No maintenance records yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>
                  Start tracking your vehicle maintenance to keep detailed service history.
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
                  Add First Record
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Car</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Description</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Mileage</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Location</TableCell>
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
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
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
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2">
                          {record.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
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
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
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
            <Grid size={12}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={12}>
              <TextField
                label="Description"
                fullWidth
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="Brief description of the service performed"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={`Mileage (${distanceUnits[settings.distanceUnit]?.abbr || 'mi'})`}
                fullWidth
                type="number"
                value={formData.mileage}
                onChange={handleChange('mileage')}
                placeholder="Odometer reading at service"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={12}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleChange('location')}
                placeholder="Where was the service performed?"
              />
            </Grid>
            <Grid size={12}>
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
            
            {/* Reminder Settings */}
            <Grid size={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
                <Alarm sx={{ mr: 1 }} />
                Maintenance Reminders (Optional)
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label={`Remind me every (${distanceUnits[settings.distanceUnit]?.abbr || 'mi'})`}
                fullWidth
                type="number"
                value={formData.reminderMileageInterval}
                onChange={handleChange('reminderMileageInterval')}
                placeholder="e.g., 5000"
                helperText="Set mileage interval for next service reminder"
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Grid container spacing={1}>
                <Grid size={8}>
                  <TextField
                    label="Remind me every"
                    fullWidth
                    type="number"
                    value={formData.reminderTimeInterval}
                    onChange={handleChange('reminderTimeInterval')}
                    placeholder="e.g., 6"
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={4}>
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={formData.reminderTimeUnit}
                      onChange={handleChange('reminderTimeUnit')}
                      label="Unit"
                    >
                      <MenuItem value="months">Months</MenuItem>
                      <MenuItem value="years">Years</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
});

export default MaintenancePage;