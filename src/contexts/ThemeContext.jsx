import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create theme context
const ThemeContext = createContext();

// Custom hook to use theme context
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

// Theme configuration
const getTheme = (mode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isLight ? '#4f46e5' : '#818cf8',
        light: isLight ? '#818cf8' : '#a5b4fc',
        dark: isLight ? '#3730a3' : '#6366f1',
      },
      secondary: {
        main: isLight ? '#0d9488' : '#5eead4',
        light: isLight ? '#5eead4' : '#99f6e4',
        dark: isLight ? '#0f766e' : '#14b8a6',
      },
      error: {
        main: isLight ? '#ef4444' : '#f87171',
      },
      warning: {
        main: isLight ? '#f59e0b' : '#fbbf24',
      },
      success: {
        main: isLight ? '#10b981' : '#34d399',
      },
      info: {
        main: isLight ? '#3b82f6' : '#60a5fa',
      },
      background: {
        default: isLight ? '#f1f5f9' : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: isLight ? '#1e293b' : '#f1f5f9',
        secondary: isLight ? '#64748b' : '#94a3b8',
      },
      divider: isLight ? '#e2e8f0' : '#334155',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            color: isLight ? '#1e293b' : '#f1f5f9',
            borderBottom: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
            boxShadow: isLight
              ? '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)'
              : 'none',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              boxShadow: isLight
                ? '0 4px 12px rgba(0,0,0,0.08)'
                : '0 4px 12px rgba(0,0,0,0.3)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight
                ? '0 4px 12px rgba(79, 70, 229, 0.3)'
                : '0 4px 12px rgba(129, 140, 248, 0.3)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isLight
              ? '0 4px 14px rgba(79, 70, 229, 0.4)'
              : '0 4px 14px rgba(129, 140, 248, 0.3)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#ffffff' : '#1e293b',
            borderRight: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 600,
              backgroundColor: isLight ? '#f8fafc' : '#0f172a',
              color: isLight ? '#475569' : '#94a3b8',
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isLight
                ? alpha('#4f46e5', 0.04)
                : alpha('#818cf8', 0.06),
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: '2px 8px',
            '&.Mui-selected': {
              backgroundColor: isLight
                ? alpha('#4f46e5', 0.08)
                : alpha('#818cf8', 0.12),
              '&:hover': {
                backgroundColor: isLight
                  ? alpha('#4f46e5', 0.12)
                  : alpha('#818cf8', 0.18),
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.025em' },
      h2: { fontWeight: 700, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.5 },
      button: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 10,
    },
  });
};

// Theme context provider component
export const ThemeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('carlogix-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeMode(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('carlogix-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = getTheme(themeMode);

  const value = {
    themeMode,
    toggleTheme,
    isDarkMode: themeMode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};