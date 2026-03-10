import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  TextField
} from '@mui/material';
import {
  Person,
  Security,
  VerifiedUser,
  DirectionsCar,
} from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';

const ProfilePage = React.memo(({ cars = [], maintenanceRecords = [], errorCodes = [], onChangePassword }) => {
  const { currentUser } = useSettings();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Calculate KPIs from real data
  const carsCount = cars.length;
  const maintenanceCount = maintenanceRecords.length;
  const errorCodesCount = errorCodes.length;
  
  // Calculate days active (days since account creation)
  const daysActive = React.useMemo(() => {
    const creationTime = currentUser?.createdAt || currentUser?.metadata?.creationTime;
    if (!creationTime) return 0;
    const creationDate = new Date(creationTime);
    const today = new Date();
    const diffTime = Math.abs(today - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [currentUser]);



  const handlePasswordChange = async () => {
    setPasswordError('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    if (onChangePassword) {
      const result = await onChangePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(result.error || 'Failed to change password');
      }
    }
  };

  const getAvatarInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return 'U';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Loading profile information...</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Profile Header Card */}
      <Card sx={{ mb: 3, overflow: 'visible' }}>
        <Box sx={{
          height: 100,
          background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
          borderRadius: '16px 16px 0 0',
        }} />
        <CardContent sx={{ pt: 0, pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: 2, mt: -5 }}>
            <Avatar sx={{
              width: 80, height: 80, fontSize: '1.8rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
              border: '4px solid', borderColor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {getAvatarInitials()}
            </Avatar>
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
                <Typography variant="h5" fontWeight={700}>
                  {currentUser.displayName || 'User'}
                </Typography>
                {currentUser.emailVerified && (
                  <Chip icon={<VerifiedUser />} label="Verified" color="success" size="small" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {currentUser.email}
              </Typography>
            </Box>
            <Button variant="outlined" size="small" onClick={() => setShowPasswordDialog(true)} startIcon={<Security />}>
              Change Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        {/* Account Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Person sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>Account Info</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={500}>{currentUser.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Member Since</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatDate(currentUser.createdAt || currentUser.metadata?.creationTime)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Security</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {currentUser.emailVerified ? 'Email verified' : 'Email not verified'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DirectionsCar sx={{ fontSize: 20, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>Your Stats</Typography>
              </Box>
              <Grid container spacing={1.5}>
                {[
                  { value: carsCount, label: 'Cars', gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
                  { value: maintenanceCount, label: 'Records', gradient: 'linear-gradient(135deg, #0d9488, #14b8a6)' },
                  { value: errorCodesCount, label: 'Errors', gradient: 'linear-gradient(135deg, #e11d48, #f43f5e)' },
                  { value: daysActive, label: 'Days Active', gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
                ].map((stat, i) => (
                  <Grid size={6} key={i}>
                    <Box sx={{
                      p: 2, borderRadius: 2, textAlign: 'center',
                      background: stat.gradient, color: '#fff',
                    }}>
                      <Typography variant="h5" fontWeight={700}>{stat.value}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.85 }}>{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default ProfilePage;