import React, { useState } from 'react'
import { Box, Typography, Paper, Chip, Grid, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Card, CardContent, Avatar, Button, Divider, Alert, LinearProgress } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { Person, Visibility, TrendingUp, TrendingDown, Warning, CheckCircle, Assessment, Timeline, LocalHospital } from '@mui/icons-material'
import Scene from '../components/3d/Scene'
import { useGetMLPredictionQuery, useGetKidneyMetricsQuery, useGetPatientsQuery, useGetKidneyMetricsHistoryQuery, useGetAlertsQuery, useValidatePatientDataQuery, useTriggerMLAnalysisMutation } from '../services/api'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Visualization: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  const [selectedPatientId, setSelectedPatientId] = useState<string>(id || '')
  
  const { data: patients, isLoading: patientsLoading } = useGetPatientsQuery()
  const { data: validationData } = useValidatePatientDataQuery(selectedPatientId, { skip: !selectedPatientId })
  const { data: mlPrediction, isLoading: mlLoading } = useGetMLPredictionQuery(selectedPatientId, { skip: !selectedPatientId })
  const { data: kidneyMetrics, isLoading: metricsLoading } = useGetKidneyMetricsQuery(selectedPatientId, { skip: !selectedPatientId })
  const { data: metricsHistory } = useGetKidneyMetricsHistoryQuery(selectedPatientId, { skip: !selectedPatientId })
  const { data: alerts } = useGetAlertsQuery(selectedPatientId, { skip: !selectedPatientId })
  const [triggerAnalysis, { isLoading: analysisLoading }] = useTriggerMLAnalysisMutation()
  
  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatientId(event.target.value)
  }
  
  const selectedPatient = patients?.find(p => p.id === selectedPatientId)
  const activeAlerts = alerts?.filter(alert => !alert.acknowledged) || []
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical')

  if (patientsLoading || mlLoading || metricsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isHealthy = mlPrediction?.stage <= 2
  const confidence = mlPrediction?.confidence || 0
  const stage = mlPrediction?.stage || kidneyMetrics?.stage || 1
  const eGFR = kidneyMetrics?.eGFR || mlPrediction?.input_metrics?.eGFR || 90
  const creatinine = Number(kidneyMetrics?.creatinine || mlPrediction?.input_metrics?.serumCreatinine || 1.0)
  const proteinuria = kidneyMetrics?.proteinuria || mlPrediction?.input_metrics?.proteinInUrine || 150
  
  const handleTriggerAnalysis = async () => {
    if (selectedPatientId) {
      try {
        // Check current validation data
        if (!validationData?.is_ready_for_prediction) {
          console.warn('Patient data incomplete:', validationData?.missing_data)
          return
        }
        
        // If validation passes, trigger analysis
        await triggerAnalysis(selectedPatientId).unwrap()
      } catch (error) {
        console.error('Failed to trigger ML analysis:', error)
      }
    }
  }
  
  const getStageColor = (stage: number) => {
    switch(stage) {
      case 1: return '#00ff88'
      case 2: return '#ffaa00'
      case 3: return '#ff6b35'
      case 4: return '#ff4757'
      case 5: return '#8b0000'
      default: return '#94a3b8'
    }
  }
  
  const getStageDescription = (stage: number) => {
    switch(stage) {
      case 1: return 'Normal or high kidney function'
      case 2: return 'Mild decrease in kidney function'
      case 3: return 'Moderate decrease in kidney function'
      case 4: return 'Severe decrease in kidney function'
      case 5: return 'Kidney failure'
      default: return 'Unknown stage'
    }
  }
  
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


  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 4, height: 40, backgroundColor: '#00d4ff', mr: 2, boxShadow: '0 0 10px #00d4ff' }} />
            <Box>
              <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
                3D KIDNEY VISUALIZATION
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                // ML-powered diagnostic visualization
              </Typography>
            </Box>
          </Box>
          <Chip
            label={mlPrediction ? (isHealthy ? 'HEALTHY' : mlPrediction.result || 'CKD DETECTED') : 'NO PREDICTION'}
            sx={{
              bgcolor: mlPrediction ? (isHealthy ? '#00ff88' : '#ff4757') : '#94a3b8',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 3,
              py: 2.5,
              fontFamily: 'monospace',
              boxShadow: mlPrediction ? (isHealthy ? '0 0 20px rgba(0, 255, 136, 0.5)' : '0 0 20px rgba(255, 71, 87, 0.5)') : 'none',
            }}
          />
        </Box>
        
        {/* Patient Selection & Info */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#94a3b8' }}>Select Patient</InputLabel>
              <Select
                value={selectedPatientId}
                onChange={handlePatientChange}
                label="Select Patient"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 212, 255, 0.3)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00d4ff'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00d4ff'
                  }
                }}
              >
                {patients?.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.demographics.firstName} {patient.demographics.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {selectedPatient && (
            <>
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                  background: themeMode === 'dark' 
                    ? 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)' 
                    : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  height: '100%'
                }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#00d4ff', width: 50, height: 50 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {selectedPatient.demographics.firstName} {selectedPatient.demographics.lastName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Age {calculateAge(selectedPatient.demographics.dateOfBirth)} • {selectedPatient.demographics.gender}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/patients/${selectedPatientId}`)}
                    sx={{ 
                      borderColor: '#00d4ff', 
                      color: '#00d4ff',
                      '&:hover': { borderColor: '#00d4ff', bgcolor: 'rgba(0, 212, 255, 0.1)' }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assessment />}
                    onClick={handleTriggerAnalysis}
                    disabled={analysisLoading || !validationData?.is_ready_for_prediction || validationData?.status === 'ML service unavailable'}
                    sx={{ 
                      borderColor: '#ff6b35', 
                      color: '#ff6b35',
                      '&:hover': { borderColor: '#ff6b35', bgcolor: 'rgba(255, 107, 53, 0.1)' }
                    }}
                  >
                    {analysisLoading ? 'Analyzing...' : 
                     validationData?.status === 'ML service unavailable' ? 'Service Unavailable' :
                     'Run ML Analysis'}
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
        
        {/* Data Validation & Alerts */}
        {selectedPatientId && validationData && (
          <Alert 
            severity={validationData.status === 'ML service unavailable' ? 'error' : 'warning'}
            sx={{ 
              mb: 3, 
              bgcolor: validationData.status === 'ML service unavailable' ? 'rgba(255, 71, 87, 0.1)' : 'rgba(255, 170, 0, 0.1)', 
              border: validationData.status === 'ML service unavailable' ? '1px solid rgba(255, 71, 87, 0.3)' : '1px solid rgba(255, 170, 0, 0.3)',
              '& .MuiAlert-icon': { color: validationData.status === 'ML service unavailable' ? '#ff4757' : '#ffaa00' }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {validationData.status === 'ML service unavailable' 
                ? 'ML Prediction Service Unavailable'
                : `Incomplete Data for ML Prediction (${Math.round(validationData.completeness_score)}% complete)`
              }
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
              {validationData.status === 'ML service unavailable'
                ? 'The ML prediction service is currently offline. Please try again later.'
                : `Missing: ${validationData.missing_data?.slice(0, 3).join(', ')}`
              }
            </Typography>
            {validationData.status !== 'ML service unavailable' && (
              <Button 
                size="small" 
                sx={{ mt: 1, color: '#ffaa00' }}
                onClick={() => navigate(`/patients/${selectedPatientId}`)}
              >
                Complete Patient Data
              </Button>
            )}
          </Alert>
        )}
        
        {selectedPatientId && criticalAlerts.length > 0 && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              bgcolor: 'rgba(255, 71, 87, 0.1)', 
              border: '1px solid rgba(255, 71, 87, 0.3)',
              '& .MuiAlert-icon': { color: '#ff4757' }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''} Active
            </Typography>
            {criticalAlerts.slice(0, 2).map((alert, index) => (
              <Typography key={index} variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                • {alert.message}
              </Typography>
            ))}
          </Alert>
        )}
      </Box>

      {selectedPatientId && (
        <>
          {/* Key Metrics */}
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)', mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ p: 2, background: `rgba(${getStageColor(stage).slice(1).match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(',')}, 0.1)`, border: `1px solid ${getStageColor(stage)}40`, borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    CKD STAGE
                  </Typography>
                  <Typography variant="h2" sx={{ color: getStageColor(stage), fontFamily: 'monospace', fontWeight: 700 }}>
                    {stage}
                  </Typography>
                  <Typography variant="caption" sx={{ color: getStageColor(stage), fontSize: '0.6rem' }}>
                    {getStageDescription(stage)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ p: 2, background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.3)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    eGFR
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#ff6b35', fontFamily: 'monospace', fontWeight: 700 }}>
                    {Math.round(eGFR)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ff6b35', fontSize: '0.6rem' }}>
                    mL/min/1.73m²
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ p: 2, background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    CREATININE
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#ffaa00', fontFamily: 'monospace', fontWeight: 700 }}>
                    {creatinine.toFixed(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ffaa00', fontSize: '0.6rem' }}>
                    mg/dL
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ p: 2, background: 'rgba(138, 43, 226, 0.1)', border: '1px solid rgba(138, 43, 226, 0.3)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    PROTEINURIA
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#8a2be2', fontFamily: 'monospace', fontWeight: 700 }}>
                    {Math.round(proteinuria)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8a2be2', fontSize: '0.6rem' }}>
                    mg/g
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Box sx={{ p: 2, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                    AI CONFIDENCE
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#00ff88', fontFamily: 'monospace', fontWeight: 700 }}>
                    {Math.round(confidence * 100)}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={confidence * 100} 
                    sx={{ 
                      mt: 1,
                      bgcolor: 'rgba(0, 255, 136, 0.2)', 
                      '& .MuiLinearProgress-bar': { bgcolor: '#00ff88' } 
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Additional Info Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                  : '#ffffff',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00d4ff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Timeline /> Progression Trend
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {kidneyMetrics?.progression?.trend === 'improving' ? (
                      <TrendingUp sx={{ color: '#00ff88', fontSize: 40 }} />
                    ) : kidneyMetrics?.progression?.trend === 'declining' ? (
                      <TrendingDown sx={{ color: '#ff4757', fontSize: 40 }} />
                    ) : (
                      <CheckCircle sx={{ color: '#ffaa00', fontSize: 40 }} />
                    )}
                    <Box>
                      <Typography variant="h5" sx={{ 
                        color: kidneyMetrics?.progression?.trend === 'improving' ? '#00ff88' : 
                               kidneyMetrics?.progression?.trend === 'declining' ? '#ff4757' : '#ffaa00',
                        fontWeight: 700,
                        textTransform: 'capitalize'
                      }}>
                        {kidneyMetrics?.progression?.trend || 'Stable'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rate: {kidneyMetrics?.progression?.rateOfChange || 0}% per month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                  : '#ffffff',
                border: '1px solid rgba(255, 170, 0, 0.3)',
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#ffaa00', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Warning /> Active Alerts
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: activeAlerts.length > 0 ? '#ff4757' : '#00ff88', width: 50, height: 50 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {activeAlerts.length}
                      </Typography>
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: activeAlerts.length > 0 ? '#ff4757' : '#00ff88' }}>
                        {activeAlerts.length === 0 ? 'No Active Alerts' : `${activeAlerts.length} Alert${activeAlerts.length > 1 ? 's' : ''}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {criticalAlerts.length} critical, {activeAlerts.length - criticalAlerts.length} warning
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: themeMode === 'dark' 
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
                  : '#ffffff',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00ff88', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital /> Last Updated
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    {kidneyMetrics?.lastUpdated ? 
                      new Date(kidneyMetrics.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'No data available'
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Data freshness indicator
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      
      {!selectedPatientId && (
        <Paper sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(0, 212, 255, 0.2)', mx: 'auto', mb: 3 }}>
            <Person sx={{ fontSize: 40, color: '#00d4ff' }} />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'monospace', mb: 2 }}>
            Select a Patient
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', fontFamily: 'monospace', mb: 3 }}>
            Choose a patient from the dropdown above to view their 3D kidney visualization and detailed metrics
          </Typography>
          <Divider sx={{ my: 3, borderColor: 'rgba(0, 212, 255, 0.2)' }} />
          <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
            Interactive 3D models • Real-time data • AI-powered insights
          </Typography>
        </Paper>
      )}

      {selectedPatientId && (
        <Paper sx={{ 
          background: 'linear-gradient(135deg, #1a2332 0%, #2a3441 100%)', 
          border: '1px solid rgba(0, 212, 255, 0.3)', 
          boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)', 
          height: '700px', 
          borderRadius: 2, 
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* 3D Scene Header */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            p: 2, 
            background: 'rgba(0, 0, 0, 0.7)', 
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
          }}>
            <Typography variant="h6" sx={{ color: '#00d4ff', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, bgcolor: '#00ff88', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              LIVE 3D KIDNEY MODEL - STAGE {stage}
            </Typography>
          </Box>
          
          <Scene
            patientData={{
              kidneyMetrics: {
                eGFR: eGFR,
                creatinine: creatinine,
                proteinuria: proteinuria,
                bloodPressure: {
                  systolic: kidneyMetrics?.bloodPressure?.systolic || 120,
                  diastolic: kidneyMetrics?.bloodPressure?.diastolic || 80
                },
                stage: stage,
                progression: {
                  trend: kidneyMetrics?.progression?.trend || 'stable',
                  rateOfChange: kidneyMetrics?.progression?.rateOfChange || 0,
                  predictedStage: stage,
                  riskFactors: []
                },
                lastUpdated: new Date().toISOString()
              },
            }}
          />
          
          {/* 3D Scene Controls */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            p: 2, 
            background: 'rgba(0, 0, 0, 0.7)', 
            backdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(0, 212, 255, 0.2)'
          }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
              🖱️ Click and drag to rotate • 🔍 Scroll to zoom • 📊 Real-time patient data visualization
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  )
}

// Add keyframe animation for pulse effect
const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`
document.head.appendChild(style)

export default Visualization
