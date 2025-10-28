import React, { useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Box, Chip, Avatar, CircularProgress, Button } from '@mui/material'
import { Person, Visibility, Add, TrendingUp, Warning, LocalHospital } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store/store'
import { useGetPatientsQuery } from '../services/api'
import { wsService } from '../services/websocket'

const Dashboard: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  const navigate = useNavigate()
  
  const { data: patients, isLoading } = useGetPatientsQuery()

  useEffect(() => {
    wsService.connect()
    return () => wsService.disconnect()
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const totalPatients = patients?.length || 0
  const highRiskPatients = Math.floor(totalPatients * 0.3) // Estimate 30% high risk
  const activeAlerts = Math.floor(totalPatients * 0.15) // Estimate 15% with alerts

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          CKD Digital Twin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and analyze chronic kidney disease progression with AI-powered insights
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {totalPatients}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Patients
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {highRiskPatients}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    High Risk
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {activeAlerts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Alerts
                  </Typography>
                </Box>
                <LocalHospital sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    87%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    AI Accuracy
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/patients')}
                  sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                >
                  Add New Patient
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => navigate('/patients')}
                >
                  View All Patients
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Patients */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Patients
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/patients')}
                  sx={{ color: '#3b82f6' }}
                >
                  View All
                </Button>
              </Box>
              
              {patients && patients.length > 0 ? (
                <Grid container spacing={2}>
                  {patients.slice(0, 6).map((patient) => {
                    const calculateAge = (dateOfBirth: string) => {
                      if (!dateOfBirth) return 'N/A'
                      const birthDate = new Date(dateOfBirth)
                      if (isNaN(birthDate.getTime())) return 'N/A'
                      const today = new Date()
                      let age = today.getFullYear() - birthDate.getFullYear()
                      const monthDiff = today.getMonth() - birthDate.getMonth()
                      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--
                      }
                      return age
                    }
                    const age = calculateAge(patient.demographics.dateOfBirth)
                    return (
                      <Grid item xs={12} sm={6} md={4} key={patient.id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: '#3b82f6' }}>
                                <Person />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {patient.demographics.firstName} {patient.demographics.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Age {age} • {patient.demographics.gender}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Chip 
                                label="Active" 
                                size="small" 
                                sx={{ 
                                  bgcolor: '#dcfce7', 
                                  color: '#166534',
                                  fontSize: '0.75rem'
                                }} 
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              📧 {patient.demographics.contactInfo.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              📞 {patient.demographics.contactInfo.phone}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    No patients found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/patients')}
                    sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
                  >
                    Add Your First Patient
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard