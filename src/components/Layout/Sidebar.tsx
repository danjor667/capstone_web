import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  ThreeDRotation as ViewIn3DIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

interface SidebarProps {
  open: boolean
}

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { text: '3D Visualization', icon: <ViewIn3DIcon />, path: '/3d-view' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
]

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: '64px',
          backgroundColor: '#0f1419',
          borderRight: '2px solid #00d4ff',
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)',
          background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
        },
      }}
    >
      <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#00d4ff',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
          }}
        >
          // NAVIGATION
        </Typography>
      </Box>
      
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                border: '1px solid transparent',
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  color: '#00d4ff',
                  boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)',
                  '& .MuiListItemIcon-root': {
                    color: '#00d4ff',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '3px',
                    height: '100%',
                    backgroundColor: '#00d4ff',
                    boxShadow: '0 0 10px #00d4ff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? '#00d4ff' : '#94a3b8',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={`${String(index + 1).padStart(2, '0')}. ${item.text}`}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontFamily: 'monospace',
                  color: location.pathname === item.path ? '#00d4ff' : '#ffffff',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* System Status */}
      <Box sx={{ p: 2, mt: 'auto', borderTop: '1px solid rgba(0, 212, 255, 0.2)' }}>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', display: 'block', mb: 1 }}>
          SYSTEM STATUS
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00ff88', mr: 1, boxShadow: '0 0 8px #00ff88' }} />
          <Typography variant="caption" sx={{ color: '#00ff88', fontFamily: 'monospace' }}>ONLINE</Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
          Last sync: 2m ago
        </Typography>
      </Box>
    </Drawer>
  )
}

export default Sidebar