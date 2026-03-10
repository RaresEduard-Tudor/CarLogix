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
  Fab,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  DirectionsCar,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { getBrandNames, getModelsForBrand, carColors } from '../data/carData';

const CarsPage = React.memo(({ cars, onAddCar, onUpdateCar, onDeleteCar }) => {
  const { formatDate, formatDistance, settings, distanceUnits } = useSettings();
  const [open, setOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
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
      // Set available models for the car's brand
      setAvailableModels(getModelsForBrand(car.brand));
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
      setAvailableModels([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCar(null);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [field]: value
    });
    
    // If brand changes, update available models and reset model selection
    if (field === 'brand') {
      setAvailableModels(getModelsForBrand(value));
      setFormData(prev => ({
        ...prev,
        [field]: value,
        model: '' // Reset model when brand changes
      }));
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            My Cars
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your vehicle profiles and information
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
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Box sx={{
              width: 72, height: 72, borderRadius: 3, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DirectionsCar sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              No cars added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>
              Add your first car to start tracking maintenance and diagnostics.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
              Add Your First Car
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {cars.map((car) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={car.id}>
              <Card sx={{ overflow: 'visible' }}>
                {/* Colored top accent */}
                <Box sx={{
                  height: 4, borderRadius: '16px 16px 0 0',
                  background: 'linear-gradient(90deg, #4f46e5, #0d9488)',
                }} />
                <CardContent sx={{ pt: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} lineHeight={1.3}>
                        {car.brand} {car.model}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Chip label={car.year} size="small" variant="outlined" />
                        {car.color && (
                          <Chip label={car.color} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      <IconButton size="small" onClick={() => handleOpen(car)} sx={{ color: 'primary.main' }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setDeleteConfirm(car)} sx={{ color: 'error.main' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ width: 60, flexShrink: 0 }}>VIN</Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {car.vin}
                      </Typography>
                    </Box>
                    {car.mileage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ width: 60, flexShrink: 0 }}>Mileage</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDistance(car.mileage)}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ width: 60, flexShrink: 0 }}>Added</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {formatDate(car.addedDate)}
                      </Typography>
                    </Box>
                  </Box>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Car</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteConfirm?.brand} {deleteConfirm?.model}? This will also remove all associated maintenance records and diagnostics.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              onDeleteCar(deleteConfirm.id);
              setDeleteConfirm(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Car Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCar ? 'Edit Car' : 'Add New Car'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="brand-label">Brand</InputLabel>
                <Select
                  labelId="brand-label"
                  value={formData.brand}
                  label="Brand"
                  onChange={handleChange('brand')}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      paddingRight: '100px !important'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select a brand</em>
                  </MenuItem>
                  {getBrandNames().map((brand) => (
                    <MenuItem key={brand} value={brand}>
                      {brand}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                  labelId="model-label"
                  value={formData.model}
                  label="Model"
                  onChange={handleChange('model')}
                  disabled={!formData.brand}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      paddingRight: '100px !important'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{formData.brand ? 'Select a model' : 'Select brand first'}</em>
                  </MenuItem>
                  {availableModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <FormControl fullWidth>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  labelId="color-label"
                  value={formData.color}
                  label="Color"
                  onChange={handleChange('color')}
                  sx={{ 
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      paddingRight: '100px !important'
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select a color</em>
                  </MenuItem>
                  {carColors.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
});

export default CarsPage;