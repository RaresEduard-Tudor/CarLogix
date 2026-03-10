import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  InputAdornment,
  IconButton
} from '@mui/material';
import { DirectionsCar, Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = React.memo(({ onLogin, onRegister }) => {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        if (result.error.includes('invalid-credential')) {
          setError('Invalid email or password. Try creating an account first using the Sign Up tab.');
        } else if (result.error.includes('user-not-found')) {
          setError('No account found with this email. Please sign up first.');
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }
    
    try {
      const result = await onRegister(email, password, displayName);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        edge="end"
        size="small"
      >
        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4f46e5 50%, #0d9488 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)', top: -100, right: -100,
      }} />
      <Box sx={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)', bottom: -80, left: -80,
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 4,
          }}
        >
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 64, height: 64, borderRadius: 3,
                background: 'linear-gradient(135deg, #4f46e5, #0d9488)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                mb: 2,
              }}
            >
              <DirectionsCar sx={{ fontSize: 36, color: '#fff' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              CarLogix
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Smart vehicle maintenance tracker
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600, textTransform: 'none', fontSize: '0.95rem',
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: passwordAdornment,
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3, mb: 1, py: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                  },
                }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                autoComplete="name"
                autoFocus
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="At least 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: passwordAdornment,
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3, mb: 1, py: 1.5,
                  background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4338ca, #4f46e5)',
                  },
                }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
});

export default LoginPage;