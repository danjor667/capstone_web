import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
} from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            CKD Digital Twin Dashboard
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Advanced 3D visualization for Chronic Kidney Disease monitoring
            and treatment planning
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => loginWithRedirect()}
            sx={{ mt: 2, px: 4 }}
          >
            Sign In
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login