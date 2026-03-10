import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Error,
  AttachMoney,
  Schedule,
  CheckCircleOutline
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';

const gradients = [
  'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
  'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
  'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
  'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
];

const DashboardPage = React.memo(({ cars, maintenanceRecords, errorCodes }) => {
  const { formatCurrency, formatDistance, formatDate } = useSettings();
  const theme = useTheme();

  const totalCars = cars.length;
  const totalMaintenanceRecords = maintenanceRecords.length;
  const activeErrors = errorCodes.filter(error => error.status === 'active').length;
  const totalSpent = maintenanceRecords.reduce((sum, record) => sum + (record.cost || 0), 0);

  const recentMaintenance = maintenanceRecords
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const activeErrorsList = errorCodes
    .filter(error => error.status === 'active')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const statCards = [
    { title: 'Total Cars', value: totalCars, icon: DirectionsCar, gradient: gradients[0] },
    { title: 'Maintenance Records', value: totalMaintenanceRecords, icon: Build, gradient: gradients[1] },
    { title: 'Active Errors', value: activeErrors, icon: Error, gradient: activeErrors > 0 ? gradients[2] : gradients[1] },
    { title: 'Total Spent', value: formatCurrency(totalSpent), icon: AttachMoney, gradient: gradients[3] },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of your vehicle maintenance data
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              elevation={0}
              sx={{
                background: stat.gradient,
                color: '#fff',
                border: 'none',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px rgba(0,0,0,0.15)` },
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5, fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <stat.icon sx={{ fontSize: 24 }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        {/* Recent Maintenance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Build sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="h6" fontWeight={600}>
                  Recent Maintenance
                </Typography>
              </Box>
              {recentMaintenance.length > 0 ? (
                <List disablePadding>
                  {recentMaintenance.map((record, idx) => (
                    <ListItem
                      key={record.id}
                      divider={idx < recentMaintenance.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Schedule sx={{ fontSize: 18, color: 'text.secondary' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            {record.serviceType}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(record.date)}
                            {record.mileage ? ` · ${formatDistance(record.mileage)}` : ''}
                            {record.cost > 0 ? ` · ${formatCurrency(record.cost)}` : ''}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <Build sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">
                    No maintenance records yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Active Errors */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Error sx={{ color: activeErrorsList.length > 0 ? 'error.main' : 'success.main', fontSize: 20 }} />
                <Typography variant="h6" fontWeight={600}>
                  Active Error Codes
                </Typography>
              </Box>
              {activeErrorsList.length > 0 ? (
                <List disablePadding>
                  {activeErrorsList.map((error, idx) => (
                    <ListItem
                      key={error.id}
                      divider={idx < activeErrorsList.length - 1}
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                              {error.code}
                            </Typography>
                            <Chip
                              label={error.severity}
                              size="small"
                              color={
                                error.severity === 'high' || error.severity === 'critical' ? 'error' :
                                error.severity === 'moderate' ? 'warning' : 'success'
                              }
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {error.description} · {formatDate(error.timestamp)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography color="text.secondary" variant="body2">
                    No active error codes — all clear!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default DashboardPage;