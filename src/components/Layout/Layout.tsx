import React from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Header from './Header'
import Sidebar from './Sidebar'
import MainContent from './MainContent'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Header />
      <Sidebar open={sidebarOpen} />
      <MainContent sidebarOpen={sidebarOpen}>
        {children}
      </MainContent>
    </Box>
  )
}

export default Layout