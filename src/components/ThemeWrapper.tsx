import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface ThemeWrapperProps {
  children: React.ReactNode
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#00d4ff',
        dark: '#0099cc',
        light: '#33ddff',
      },
      secondary: {
        main: '#ff6b35',
        dark: '#cc5529',
        light: '#ff8c66',
      },
      background: {
        default: themeMode === 'dark' ? '#1a2332' : '#f8fafc',
        paper: themeMode === 'dark' ? '#2a3441' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#1e293b',
        secondary: themeMode === 'dark' ? '#94a3b8' : '#64748b',
      },
      success: {
        main: '#00ff88',
      },
      warning: {
        main: '#ffaa00',
      },
      error: {
        main: '#ff4757',
      },
    },
    typography: {
      fontFamily: '"JetBrains Mono", "Roboto Mono", monospace',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h6: {
        fontWeight: 600,
        color: '#00d4ff',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0, 212, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: themeMode === 'dark'
              ? 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)'
              : '#ffffff',
            border: themeMode === 'dark'
              ? '1px solid rgba(0, 212, 255, 0.2)'
              : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: themeMode === 'dark'
              ? '0 4px 20px rgba(0, 212, 255, 0.1)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default ThemeWrapper