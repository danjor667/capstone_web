import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Grid, Card, CardContent, Typography, Box, Avatar, Chip, CircularProgress, 
  Button, IconButton, Divider, List, ListItem, ListItemText, Alert
} from '@mui/material'
import { 
  Person, ArrowBack, Edit, Add, Favorite, Timeline, 
  LocalHospital, Medication, Science, Analytics 
} from '@mui/icons-material'
import { 
  useGetPatientQuery, useGetKidneyMetricsQuery, useGetVitalsQuery, 
  useGetMedicationsQuery, useGetMLPredictionQuery 
} from '../services/api'
import MLAnalyticsPanel from '../components/analytics/MLAnalyticsPanel'
import KidneyMetricsForm from '../components/forms/KidneyMetricsForm'
import VitalsForm from '../components/forms/VitalsForm'
import PatientEditForm from '../components/forms/PatientEditForm'
import Scene from '../components/3d/Scene'

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: patient, isLoading, error } = useGetPatientQuery(id || '')
  const { data: kidneyMetrics } = useGetKidneyMetricsQuery(id || '', { skip: !id })
  const { data: vitals } = useGetVitalsQuery(id || '', { skip: !id })
  const { data: medications } = useGetMedicationsQuery(id || '', { skip: !id })
  const { data: prediction } = useGetMLPredictionQuery(id || '', { skip: !id })
  
  const [showMetricsForm, setShowMetricsForm] = useState(false)
  const [showVitalsForm, setShowVitalsForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !patient) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Patient not found</Alert>
      </Box>
    )
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
  const age = calculateAge(patient?.demographics?.dateOfBirth || '')
  const latestVitals = vitals?.[0]

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/patients')} sx={{ bgcolor: 'action.hover' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 700, flex: 1 }}>
          Patient Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => setShowEditForm(true)}
          sx={{ borderColor: '#3b82f6', color: '#3b82f6' }}
        >
          Edit Patient
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Header Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#3b82f6' }}>
                  <Person sx={{ fontSize: 30 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {patient?.demographics?.firstName} {patient?.demographics?.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={`Age ${age}`} size="small" color="primary" />
                    <Chip label={patient?.demographics?.gender} size="small" variant="outlined" />
                    {kidneyMetrics?.stage && (
                      <Chip 
                        label={`Stage ${kidneyMetrics.stage}`} 
                        size="small"
                        color={kidneyMetrics.stage >= 4 ? 'error' : kidneyMetrics.stage >= 3 ? 'warning' : 'success'}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right', minWidth: 200 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>📧 {patient?.demographics?.contactInfo?.email}</Typography>
                  <Typography variant="body2">📞 {patient?.demographics?.contactInfo?.phone}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid container spacing={3}>
            {/* Vital Signs */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Favorite sx={{ color: '#ef4444' }} />
                      Vital Signs
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setShowVitalsForm(true)}
                      sx={{ color: '#3b82f6' }}
                    >
                      Add Vitals
                    </Button>
                  </Box>
                  
                  {latestVitals ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 700 }}>
                            {latestVitals?.systolic_bp || 'N/A'}/{latestVitals?.diastolic_bp || 'N/A'}
                          </Typography>
                          <Typography variant="caption">Blood Pressure</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                            {latestVitals?.heart_rate || 'N/A'}
                          </Typography>
                          <Typography variant="caption">Heart Rate</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                            {latestVitals?.temperature || 'N/A'}°F
                          </Typography>
                          <Typography variant="caption">Temperature</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(147, 51, 234, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ color: '#9333ea', fontWeight: 700 }}>
                            {latestVitals?.weight || 'N/A'} kg
                          </Typography>
                          <Typography variant="caption">Weight</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h6" sx={{ color: '#10b981', fontWeight: 700 }}>
                            {latestVitals?.height || 'N/A'} cm
                          </Typography>
                          <Typography variant="caption">Height</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(107, 114, 128, 0.1)', borderRadius: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            {latestVitals?.timestamp ? new Date(latestVitals.timestamp).toLocaleDateString() : 'N/A'}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block' }}>Last Updated</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info">No vital signs recorded. Click "Add Vitals" to record measurements.</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Kidney Metrics */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalHospital sx={{ color: '#f59e0b' }} />
                      Kidney Function
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setShowMetricsForm(true)}
                      sx={{ color: '#3b82f6' }}
                    >
                      Add Metrics
                    </Button>
                  </Box>
                  
                  {kidneyMetrics ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                            {kidneyMetrics?.eGFR || 'N/A'}
                          </Typography>
                          <Typography variant="caption">eGFR (mL/min/1.73m²)</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 700 }}>
                            {kidneyMetrics?.creatinine || 'N/A'}
                          </Typography>
                          <Typography variant="caption">Creatinine (mg/dL)</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(255, 107, 53, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h5" sx={{ color: '#ff6b35', fontWeight: 700 }}>
                            {kidneyMetrics?.bun || 'N/A'}
                          </Typography>
                          <Typography variant="caption">BUN (mg/dL)</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(59, 130, 246, 0.1)', borderRadius: 1 }}>
                          <Typography variant="h5" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                            Stage {kidneyMetrics?.stage || 'N/A'}
                          </Typography>
                          <Typography variant="caption">CKD Stage</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info">No kidney metrics recorded. Click "Add Metrics" to record measurements.</Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Medications & 3D Model Row */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: 320 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Medication sx={{ color: '#10b981' }} />
                    Medications
                  </Typography>
                  
                  {medications && medications?.length > 0 ? (
                    <List dense>
                      {medications?.slice(0, 4).map((med) => (
                        <ListItem key={med.id} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{med?.name || 'Unknown'}</Typography>}
                            secondary={<Typography variant="caption">{med?.dosage || 'N/A'} - {med?.frequency || 'N/A'}</Typography>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No medications recorded
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* 3D Visualization */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: 320 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Science sx={{ color: '#9333ea' }} />
                    3D Kidney Model
                  </Typography>
                  <Box sx={{ height: 260, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                    <Scene patientData={{ kidneyMetrics }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* ML Analytics */}
            <Grid item xs={12}>
              <MLAnalyticsPanel patientId={id || ''} />
            </Grid>
        </Grid>
      </Grid>
      
      {/* Forms */}
      <KidneyMetricsForm
        open={showMetricsForm}
        onClose={() => setShowMetricsForm(false)}
        patientId={id || ''}
        onSuccess={() => setShowMetricsForm(false)}
      />
      
      <VitalsForm
        open={showVitalsForm}
        onClose={() => setShowVitalsForm(false)}
        patientId={id || ''}
        onSuccess={() => setShowVitalsForm(false)}
      />
      
      <PatientEditForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        patient={patient}
        onSuccess={() => setShowEditForm(false)}
      />
    </Box>
  )
}

export default PatientDetail