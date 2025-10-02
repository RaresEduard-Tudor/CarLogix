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
  Chip,
  IconButton,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  Paper,
  Fab
} from '@mui/material';
import {
  Add,
  Edit,
  DirectionsCar,
  Close,
  CalendarToday,
  Speed
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext_Firebase';

const CarsPage = ({ cars, onAddCar, onUpdateCar }) => {
  const { formatDate, formatDistance, settings, distanceUnits } = useSettings();
  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    color: ''
  });

  const handleOpen = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        brand: car.brand,
        model: car.model,
        year: car.year.toString(),
        vin: car.vin,
        mileage: car.mileage?.toString() || '',
        color: car.color || ''
      });
    } else {
      setEditingCar(null);
      setFormData({
        brand: '',
        model: '',
        year: '',
        vin: '',
        mileage: '',
        color: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCar(null);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    const carData = {
      ...formData,
      year: parseInt(formData.year),
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined
    };

    if (editingCar) {
      onUpdateCar(editingCar.id, carData);
    } else {
      onAddCar(carData);
    }
    handleClose();
  };

  const isFormValid = formData.brand && formData.model && formData.year && formData.vin;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Cars
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your vehicle profiles and basic information.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add Car
        </Button>
      </Box>

      {cars.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <DirectionsCar sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No cars added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add your first car to start tracking maintenance and diagnostics.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item xs={12} md={6} lg={4} key={car.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {car.brand} {car.model}
                      </Typography>
                      <Chip label={car.year} size="small" />
                    </Box>
                    <IconButton size="small" onClick={() => handleOpen(car)}>
                      <Edit />
                    </IconButton>
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="VIN"
                        secondary={car.vin}
                      />
                    </ListItem>
                    {car.mileage && (
                      <ListItem>
                        <Speed sx={{ mr: 1, fontSize: 16 }} />
                        <ListItemText
                          primary="Mileage"
                          secondary={formatDistance(car.mileage)}
                        />
                      </ListItem>
                    )}
                    {car.color && (
                      <ListItem>
                        <ListItemText
                          primary="Color"
                          secondary={car.color}
                        />
                      </ListItem>
                    )}
                    <ListItem>
                      <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                      <ListItemText
                        primary="Added"
                        secondary={formatDate(car.addedDate)}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add car"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => handleOpen()}
      >
        <Add />
      </Fab>

      {/* Add/Edit Car Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCar ? 'Edit Car' : 'Add New Car'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Brand"
                fullWidth
                required
                value={formData.brand}
                onChange={handleChange('brand')}
                placeholder="e.g., Toyota, Honda, Ford"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Model"
                fullWidth
                required
                value={formData.model}
                onChange={handleChange('model')}
                placeholder="e.g., Camry, Civic, F-150"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Year"
                fullWidth
                required
                type="number"
                value={formData.year}
                onChange={handleChange('year')}
                inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Color"
                fullWidth
                value={formData.color}
                onChange={handleChange('color')}
                placeholder="e.g., Red, Blue, Silver"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="VIN"
                fullWidth
                required
                value={formData.vin}
                onChange={handleChange('vin')}
                placeholder="17-character Vehicle Identification Number"
                inputProps={{ maxLength: 17 }}
                helperText={`${formData.vin.length}/17 characters`}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={`Current Mileage (${distanceUnits[settings.distanceUnit]?.abbr || 'mi'})`}
                fullWidth
                type="number"
                value={formData.mileage}
                onChange={handleChange('mileage')}
                placeholder="Current odometer reading"
                inputProps={{ min: 0 }}
                helperText="Optional - used for maintenance reminders"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!isFormValid}>
            {editingCar ? 'Update' : 'Add Car'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarsPage;