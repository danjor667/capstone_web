import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { toggleSidebar } from '../../store/slices/uiSlice'

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  if (sidebarOpen) return null

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: themeMode === 'dark' ? '#1f2937' : '#ffffff',
        color: themeMode === 'dark' ? '#ffffff' : '#1e293b',
        boxShadow: themeMode === 'dark' ? '0 0 30px rgba(0, 212, 255, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderBottom: themeMode === 'dark' ? '2px solid #00d4ff' : '1px solid #e2e8f0',
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={() => dispatch(toggleSidebar())}
          sx={{ 
            mr: 2,
            color: themeMode === 'dark' ? '#00d4ff' : '#1e293b'
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 6, 
            height: 6, 
            borderRadius: '50%', 
            backgroundColor: '#00ff88', 
            mr: 1, 
            boxShadow: '0 0 8px #00ff88' 
          }} />
          <Typography variant="h6" sx={{ 
            color: themeMode === 'dark' ? '#00d4ff' : '#1e293b', 
            fontFamily: 'monospace', 
            fontWeight: 700 
          }}>
            NEPHRO.AI
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header