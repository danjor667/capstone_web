import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar open={sidebarOpen} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          paddingTop: sidebarOpen ? 0 : '64px', // Add padding when header is visible
        }}
      >
        <Header />
        {children}
      </Box>
    </Box>
  )
}

export default Layout