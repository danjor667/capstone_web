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
  IconButton,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,

  ThreeDRotation as ViewIn3DIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { toggleSidebar } from '../../store/slices/uiSlice'
import ThemeToggle from '../ThemeToggle'
import ConnectionStatus from '../common/ConnectionStatus'
import AuthService from '../../services/authService'

interface SidebarProps {
  open: boolean
}

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
  { text: '3D Visualization', icon: <ViewIn3DIcon />, path: '/3d-view' },
]

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const handleLogout = () => {
    AuthService.logout()
    window.location.href = '/login'
  }

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
          backgroundColor: themeMode === 'dark' ? '#1f2937' : '#ffffff',
          borderRight: themeMode === 'dark' ? '2px solid #00d4ff' : '1px solid #e2e8f0',
          boxShadow: themeMode === 'dark' ? '0 0 30px rgba(0, 212, 255, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
          background: themeMode === 'dark' ? 'linear-gradient(180deg, #1f2937 0%, #2a3441 100%)' : '#ffffff',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: themeMode === 'dark' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00ff88', mr: 1, boxShadow: '0 0 8px #00ff88' }} />
          <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#00d4ff' : '#1e293b', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.875rem' }}>
            NEPHRO.AI
          </Typography>
        </Box>
        <IconButton onClick={() => dispatch(toggleSidebar())} size="small" sx={{ color: themeMode === 'dark' ? '#00d4ff' : '#64748b' }}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Controls */}
      <Box sx={{ p: 2, borderBottom: themeMode === 'dark' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
        <IconButton size="small" sx={{ color: themeMode === 'dark' ? '#00d4ff' : '#64748b' }}>
          <NotificationsIcon />
        </IconButton>
        <ThemeToggle />
        <IconButton size="small" sx={{ color: themeMode === 'dark' ? '#00d4ff' : '#64748b' }}>
          <AccountCircle />
        </IconButton>
        <IconButton size="small" onClick={handleLogout} sx={{ color: themeMode === 'dark' ? '#ff4757' : '#ef4444' }}>
          <Logout />
        </IconButton>
      </Box>
      
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
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
                  backgroundColor: themeMode === 'dark' ? 'rgba(0, 212, 255, 0.1)' : 'rgba(0, 212, 255, 0.08)',
                  border: themeMode === 'dark' ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid rgba(0, 212, 255, 0.2)',
                  color: '#00d4ff',
                  boxShadow: themeMode === 'dark' ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
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
                    boxShadow: themeMode === 'dark' ? '0 0 10px #00d4ff' : 'none',
                  },
                },
                '&:hover': {
                  backgroundColor: themeMode === 'dark' ? 'rgba(0, 212, 255, 0.05)' : 'rgba(0, 212, 255, 0.04)',
                  border: themeMode === 'dark' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path ? '#00d4ff' : themeMode === 'dark' ? '#94a3b8' : '#64748b',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontFamily: 'monospace',
                  color: location.pathname === item.path ? '#00d4ff' : themeMode === 'dark' ? '#ffffff' : '#1e293b',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, mt: 'auto', borderTop: themeMode === 'dark' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid #e2e8f0' }}>
        <Typography variant="caption" sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b', fontFamily: 'monospace', display: 'block', mb: 1 }}>
          SYSTEM STATUS
        </Typography>
        <ConnectionStatus />
        <Typography variant="caption" sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b', fontFamily: 'monospace', mt: 1, display: 'block' }}>
          Last sync: 2m ago
        </Typography>
      </Box>
    </Drawer>
  )
}

export default Sidebar