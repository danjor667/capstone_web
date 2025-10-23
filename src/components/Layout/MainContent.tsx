import React from 'react'
import { Box } from '@mui/material'

interface MainContentProps {
  children: React.ReactNode
  sidebarOpen: boolean
}

const MainContent: React.FC<MainContentProps> = ({ children, sidebarOpen }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 1,
        mt: '64px',
        ml: sidebarOpen ? '240px' : 0,
        transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#1a2332',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, transparent 49%, rgba(0, 212, 255, 0.03) 50%, transparent 51%)
        `,
        backgroundSize: '100px 100px, 150px 150px, 20px 20px',
      }}
    >
      {children}
    </Box>
  )
}

export default MainContent