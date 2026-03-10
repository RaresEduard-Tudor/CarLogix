import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Settings as SettingsIcon,
  AttachMoney,
  Speed,
  Language,
  Restore,
  Save,
  Info
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { useThemeMode } from '../contexts/ThemeContext';

const SettingsPage = React.memo(() => {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    currencies, 
    distanceUnits,
    dateFormats,
    formatCurrency,
    formatDistance,
    getDateExample
  } = useSettings();
  const { toggleTheme, isDarkMode } = useThemeMode();
  
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    updateSetting(key, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // Settings are automatically saved to localStorage via context
  };

  const handleReset = () => {
    resetSettings();
    setHasChanges(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your CarLogix experience with units, currency, and display preferences.
        </Typography>
      </Box>

      {hasChanges && (
        <Alert severity="info" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={handleSave} startIcon={<Save />}>
            Changes Saved Automatically
          </Button>
        }>
          Your preferences are automatically saved as you make changes.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Currency Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney />
                Currency
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose your preferred currency for displaying costs and expenses.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.currency}
                  label="Currency"
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                >
                  {Object.entries(currencies).map(([code, info]) => (
                    <MenuItem key={code} value={code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 30 }}>
                          {info.symbol}
                        </Typography>
                        <Typography>{info.name}</Typography>
                        <Chip label={code} size="small" variant="outlined" />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Preview: {formatCurrency(49.99)} (maintenance cost)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Distance Units Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Speed />
                Distance Units
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose between miles or kilometers for mileage tracking.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Distance Unit</InputLabel>
                <Select
                  value={settings.distanceUnit}
                  label="Distance Unit"
                  onChange={(e) => handleSettingChange('distanceUnit', e.target.value)}
                >
                  {Object.entries(distanceUnits).map(([key, info]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{info.name}</Typography>
                        <Chip label={info.abbr} size="small" variant="outlined" />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Preview: {formatDistance(65000)} (current mileage)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Date Format Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📅
                Date Format
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Choose how dates are displayed throughout the app.
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.dateFormat}
                  label="Date Format"
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  {Object.entries(dateFormats).map(([key, info]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
                        <Typography>{info.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {info.example}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Preview: {getDateExample()} (today's date)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Preferences */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Language />
                Display Preferences
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    {isDarkMode ? '🌙' : '☀️'}
                  </ListItemIcon>
                  <ListItemText
                    primary="Dark Mode"
                    secondary="Toggle between light and dark theme"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                      />
                    }
                    label=""
                  />
                </ListItem>
                
                <Divider />
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Settings Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info />
                Current Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Currency</Typography>
                    <Typography variant="h6">
                      {currencies[settings.currency]?.symbol} {settings.currency}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Distance</Typography>
                    <Typography variant="h6">
                      {distanceUnits[settings.distanceUnit]?.name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Theme</Typography>
                    <Typography variant="h6">
                      {isDarkMode ? 'Dark' : 'Light'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">Date Format</Typography>
                    <Typography variant="h6">
                      {dateFormats[settings.dateFormat]?.name || 'US Format'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Reset Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                Reset Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Reset all settings to their default values. This action cannot be undone.
              </Typography>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Restore />}
                onClick={handleReset}
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default SettingsPage;