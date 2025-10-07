import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { toggleSidebar } from '../../store/slices/uiSlice'

const Header: React.FC = () => {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.ui.notifications)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: 1300,
        background: 'linear-gradient(90deg, #0a0e1a 0%, #1a1f2e 50%, #0a0e1a 100%)',
        borderBottom: '2px solid #00d4ff',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: '#00ff88',
              mr: 2,
              boxShadow: '0 0 10px #00ff88',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.7, transform: 'scale(1.2)' },
              },
            }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#00d4ff',
              textShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
            }}
          >
            NEPHRO.AI
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 2,
              color: '#94a3b8',
              fontFamily: 'monospace',
            }}
          >
            v2.1.0
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            sx={{
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              mr: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
              },
            }}
          >
            <Badge 
              badgeContent={notifications.length} 
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ff4757',
                  color: '#fff',
                  boxShadow: '0 0 10px #ff4757',
                }
              }}
            >
              <NotificationsIcon sx={{ color: '#00d4ff' }} />
            </Badge>
          </IconButton>

          <IconButton
            onClick={handleMenuOpen}
            aria-label="account menu"
            sx={{
              backgroundColor: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 15px rgba(0, 212, 255, 0.4)',
              },
            }}
          >
            <AccountCircle sx={{ color: '#00d4ff' }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                backgroundColor: '#1a1f2e',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
              }
            }}
          >
            <MenuItem onClick={handleMenuClose} sx={{ color: '#ffffff', '&:hover': { backgroundColor: 'rgba(0, 212, 255, 0.1)' } }}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: '#ffffff', '&:hover': { backgroundColor: 'rgba(0, 212, 255, 0.1)' } }}>Settings</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header