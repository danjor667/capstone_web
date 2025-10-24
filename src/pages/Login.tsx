import React, { useState } from 'react'
import { Box, Card, CardContent, TextField, Button, Typography, Avatar, Alert } from '@mui/material'
import { LocalHospital, Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment } from '@mui/material'
import AuthService from '../services/authService'

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await AuthService.login(credentials.email, credentials.password)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      p: 2
    }}>
      <Card sx={{
        maxWidth: 400,
        width: '100%',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: '1px solid rgba(0,212,255,0.3)',
        boxShadow: '0 20px 40px rgba(0,212,255,0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
              mx: 'auto',
              mb: 2,
              border: '3px solid rgba(0,212,255,0.3)'
            }}>
              <LocalHospital sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" sx={{
              color: '#00d4ff',
              fontFamily: 'monospace',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 0 20px rgba(0,212,255,0.5)'
            }}>
              NEPHRO.AI
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              CKD Digital Twin Platform
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(0,212,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#00d4ff' }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#00d4ff',
                color: '#000',
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '0 0 20px rgba(0,212,255,0.3)',
                '&:hover': {
                  bgcolor: '#0099cc',
                  boxShadow: '0 0 30px rgba(0,212,255,0.5)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(0,212,255,0.3)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Secure Medical Platform • HIPAA Compliant
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login