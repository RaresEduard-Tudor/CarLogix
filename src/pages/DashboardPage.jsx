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
  ListItemIcon
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Error,
  AttachMoney,
  Schedule
} from '@mui/icons-material';

const DashboardPage = ({ cars, maintenanceRecords, errorCodes }) => {
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
    {
      title: 'Total Cars',
      value: totalCars,
      icon: DirectionsCar,
      color: 'primary.main'
    },
    {
      title: 'Maintenance Records',
      value: totalMaintenanceRecords,
      icon: Build,
      color: 'success.main'
    },
    {
      title: 'Active Errors',
      value: activeErrors,
      icon: Error,
      color: activeErrors > 0 ? 'error.main' : 'success.main'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: AttachMoney,
      color: 'info.main'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to CarLogix! Here's an overview of your vehicle maintenance data.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">
                      {stat.value}
                    </Typography>
                  </Box>
                  <stat.icon sx={{ fontSize: 40, color: stat.color }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Maintenance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Build sx={{ mr: 1 }} />
              Recent Maintenance
            </Typography>
            {recentMaintenance.length > 0 ? (
              <List>
                {recentMaintenance.map((record) => (
                  <ListItem key={record.id} divider>
                    <ListItemIcon>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText
                      primary={record.serviceType}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {record.date} • {record.mileage?.toLocaleString()} miles
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {record.cost > 0 && `$${record.cost}`}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No maintenance records yet. Add your first service record!
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Active Errors */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Error sx={{ mr: 1 }} />
              Active Error Codes
            </Typography>
            {activeErrorsList.length > 0 ? (
              <List>
                {activeErrorsList.map((error) => (
                  <ListItem key={error.id} divider>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {error.code}
                          </Typography>
                          <Chip 
                            label={error.severity} 
                            size="small" 
                            color={
                              error.severity === 'high' || error.severity === 'critical' ? 'error' :
                              error.severity === 'moderate' ? 'warning' : 'success'
                            }
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {error.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(error.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No active error codes. Your car is running clean! 🚗✨
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;