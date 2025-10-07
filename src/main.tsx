import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App.tsx'
import { store } from './store/store.ts'
import './styles/index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
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
      default: '#0a0e1a',
      paper: '#1a1f2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#94a3b8',
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
      color: '#ffffff',
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
          border: '1px solid rgba(0, 212, 255, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)