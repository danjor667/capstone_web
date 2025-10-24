import React, { useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Chip, Avatar, CircularProgress } from '@mui/material'
import { TrendingDown, Warning, CheckCircle, Person } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { useGetPatientsQuery, useGetKidneyMetricsQuery, useGetAlertsQuery } from '../services/api'
import { wsService } from '../services/websocket'
import Scene from '../components/3d/Scene'

const Dashboard: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  
  // Fetch real data from backend
  const { data: patients, isLoading: patientsLoading } = useGetPatientsQuery()
  const currentPatient = patients?.[0] // Use first patient for demo
  const { data: kidneyMetrics, isLoading: metricsLoading } = useGetKidneyMetricsQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )
  const { data: alerts } = useGetAlertsQuery(
    currentPatient?.id || '', 
    { skip: !currentPatient?.id }
  )

  // Mock kidney metrics if none exist
  const mockKidneyMetrics = {
    eGFR: 45,
    creatinine: 2.1,
    proteinuria: 150,
    bloodPressure: { systolic: 140, diastolic: 90 },
    stage: 3 as const,
    progression: {
      trend: 'declining' as const,
      rateOfChange: -2.5,
      predictedStage: 4 as const,
      timeToNextStage: 18,
      riskFactors: []
    },
    lastUpdated: new Date().toISOString()
  }

  const displayMetrics = kidneyMetrics || mockKidneyMetrics

  // Subscribe to real-time updates
  useEffect(() => {
    wsService.connect()
    if (currentPatient?.id) {
      wsService.subscribeToPatient(currentPatient.id)
    }
    
    return () => {
      wsService.unsubscribeFromPatient()
    }
  }, [currentPatient?.id])

  if (patientsLoading || metricsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentPatient) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">No patient data available</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      p: 3, 
      height: '100vh', 
      overflow: 'auto', 
      background: themeMode === 'dark' 
        ? 'linear-gradient(135deg, rgba(0,212,255,0.02) 0%, rgba(255,107,53,0.02) 100%)' 
        : 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)'
    }}>
      <Grid container spacing={3}>
        {/* Enhanced Patient Header */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0,212,255,0.2)' 
              : '1px solid rgba(0,0,0,0.08)',
            boxShadow: themeMode === 'dark' 
              ? '0 8px 32px rgba(0,212,255,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)', 
                  border: themeMode === 'dark' 
                    ? '3px solid rgba(0,212,255,0.3)' 
                    : '3px solid rgba(0,212,255,0.2)'
                }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: -2, 
                  right: -2, 
                  width: 20, 
                  height: 20, 
                  borderRadius: '50%', 
                  bgcolor: '#00ff88', 
                  border: themeMode === 'dark' ? '2px solid #1e293b' : '2px solid #ffffff',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ 
                  color: themeMode === 'dark' ? '#fff' : '#1e293b', 
                  fontWeight: 700, 
                  mb: 0.5 
                }}>
                  {currentPatient.demographics.firstName} {currentPatient.demographics.lastName}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
                  mb: 1 
                }}>
                  Patient ID: {currentPatient.id} • Age: {new Date().getFullYear() - new Date(currentPatient.demographics.dateOfBirth).getFullYear()} • {currentPatient.demographics.gender}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: themeMode === 'dark' ? '#64748b' : '#94a3b8', 
                  mb: 2 
                }}>
                  📧 {currentPatient.demographics.contactInfo.email} • 📞 {currentPatient.demographics.contactInfo.phone}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`Stage ${displayMetrics.stage} CKD`} sx={{ 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,170,0,0.2)' : 'rgba(255,170,0,0.1)', 
                    color: '#ffaa00', 
                    border: themeMode === 'dark' ? '1px solid rgba(255,170,0,0.3)' : '1px solid rgba(255,170,0,0.2)'
                  }} size="small" />
                  <Chip label={displayMetrics.progression?.trend === 'declining' ? 'High Risk' : 'Stable'} sx={{ 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.2)' : 'rgba(255,71,87,0.1)', 
                    color: '#ff4757', 
                    border: themeMode === 'dark' ? '1px solid rgba(255,71,87,0.3)' : '1px solid rgba(255,71,87,0.2)'
                  }} size="small" />
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ 
                    color: themeMode === 'dark' ? '#64748b' : '#94a3b8', 
                    textTransform: 'uppercase', 
                    letterSpacing: 1 
                  }}>Last Updated</Typography>
                  <Typography variant="body1" sx={{ color: '#00d4ff', fontWeight: 600 }}>
                    {new Date(displayMetrics.lastUpdated).toLocaleTimeString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                  <Typography variant="caption" sx={{ color: '#00ff88', fontWeight: 600 }}>ACTIVE</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Vital Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(255,170,0,0.3)' 
                  : '1px solid rgba(255,170,0,0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', bgcolor: '#ffaa00', boxShadow: '0 0 10px #ffaa00' }} />
                  <Typography variant="h3" sx={{ color: '#ffaa00', fontWeight: 700, mb: 1 }}>{displayMetrics.eGFR}</Typography>
                  <Typography variant="caption" sx={{ 
                    color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    letterSpacing: 1 
                  }}>eGFR (mL/min/1.73m²)</Typography>
                  <LinearProgress variant="determinate" value={(displayMetrics.eGFR / 120) * 100} sx={{ 
                    mt: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,170,0,0.1)' : 'rgba(255,170,0,0.08)', 
                    '& .MuiLinearProgress-bar': { bgcolor: '#ffaa00' } 
                  }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(255,71,87,0.3)' 
                  : '1px solid rgba(255,71,87,0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff4757', boxShadow: '0 0 10px #ff4757' }} />
                  <Typography variant="h3" sx={{ color: '#ff4757', fontWeight: 700, mb: 1 }}>{displayMetrics.creatinine}</Typography>
                  <Typography variant="caption" sx={{ 
                    color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    letterSpacing: 1 
                  }}>Creatinine (mg/dL)</Typography>
                  <LinearProgress variant="determinate" value={(displayMetrics.creatinine / 5) * 100} sx={{ 
                    mt: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.08)', 
                    '& .MuiLinearProgress-bar': { bgcolor: '#ff4757' } 
                  }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(255,107,53,0.3)' 
                  : '1px solid rgba(255,107,53,0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff6b35', boxShadow: '0 0 10px #ff6b35' }} />
                  <Typography variant="h3" sx={{ color: '#ff6b35', fontWeight: 700, mb: 1 }}>{displayMetrics.proteinuria}</Typography>
                  <Typography variant="caption" sx={{ 
                    color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    letterSpacing: 1 
                  }}>Proteinuria (mg/g)</Typography>
                  <LinearProgress variant="determinate" value={(displayMetrics.proteinuria / 500) * 100} sx={{ 
                    mt: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(255,107,53,0.1)' : 'rgba(255,107,53,0.08)', 
                    '& .MuiLinearProgress-bar': { bgcolor: '#ff6b35' } 
                  }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(0,212,255,0.3)' 
                  : '1px solid rgba(0,212,255,0.2)'
              }}>
                <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box sx={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%', bgcolor: '#00d4ff', boxShadow: '0 0 10px #00d4ff' }} />
                  <Typography variant="h4" sx={{ color: '#00d4ff', fontWeight: 700, mb: 1 }}>
                    {displayMetrics.bloodPressure?.systolic}/{displayMetrics.bloodPressure?.diastolic}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: themeMode === 'dark' ? '#94a3b8' : '#64748b', 
                    textTransform: 'uppercase', 
                    letterSpacing: 1 
                  }}>Blood Pressure (mmHg)</Typography>
                  <LinearProgress variant="determinate" value={(displayMetrics.bloodPressure?.systolic / 200) * 100} sx={{ 
                    mt: 2, 
                    bgcolor: themeMode === 'dark' ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.08)', 
                    '& .MuiLinearProgress-bar': { bgcolor: '#00d4ff' } 
                  }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* 3D Visualization */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            background: themeMode === 'dark' 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
              : '#ffffff',
            border: themeMode === 'dark' 
              ? '1px solid rgba(0,212,255,0.3)' 
              : '1px solid rgba(0,212,255,0.2)',
            height: 500 
          }}>
            <CardContent sx={{ p: 0, height: '100%' }}>
              <Box sx={{ 
                p: 2, 
                borderBottom: themeMode === 'dark' 
                  ? '1px solid rgba(0,212,255,0.2)' 
                  : '1px solid rgba(0,212,255,0.1)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <Typography variant="h6" sx={{ color: '#00d4ff', fontWeight: 600 }}>3D Kidney Analysis</Typography>
                <Chip label="Real-time" color="success" size="small" />
              </Box>
              <Box sx={{ height: 'calc(100% - 64px)' }}>
                <Scene patientData={{ kidneyMetrics: displayMetrics }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Alerts */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(255,71,87,0.3)' 
                  : '1px solid rgba(255,71,87,0.2)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#ff4757', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning /> Critical Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {alerts?.slice(0, 3).map((alert) => (
                      <Box key={alert.id} sx={{ 
                        p: 2, 
                        bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.05)', 
                        borderRadius: 1, 
                        border: themeMode === 'dark' ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,71,87,0.1)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>{alert.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{alert.message}</Typography>
                      </Box>
                    )) || (
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: themeMode === 'dark' ? 'rgba(255,71,87,0.1)' : 'rgba(255,71,87,0.05)', 
                        borderRadius: 1, 
                        border: themeMode === 'dark' ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,71,87,0.1)'
                      }}>
                        <Typography variant="body2" sx={{ color: '#ff4757', fontWeight: 600 }}>High Creatinine</Typography>
                        <Typography variant="caption" color="text.secondary">Levels above normal range</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
                  : '#ffffff',
                border: themeMode === 'dark' 
                  ? '1px solid rgba(0,255,136,0.3)' 
                  : '1px solid rgba(0,255,136,0.2)'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle /> Recent Activity
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00ff88' }} />
                      <Box>
                        <Typography variant="body2" sx={{ 
                          color: themeMode === 'dark' ? '#fff' : '#1e293b' 
                        }}>Patient Data Loaded</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date().toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard