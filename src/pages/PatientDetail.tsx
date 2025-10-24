import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, Card, CardContent, Typography, Box, Avatar, Chip, CircularProgress, Tabs, Tab, Button } from '@mui/material'
import { Person, Email, Phone, LocationOn, CalendarToday, Add, Analytics } from '@mui/icons-material'
import { useGetPatientQuery, useGetKidneyMetricsQuery, useGetMLPredictionQuery } from '../services/api'
import MLAnalyticsPanel from '../components/analytics/MLAnalyticsPanel'
import KidneyMetricsForm from '../components/forms/KidneyMetricsForm'
import Scene from '../components/3d/Scene'

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: patient, isLoading, error } = useGetPatientQuery(id || '')
  const { data: kidneyMetrics } = useGetKidneyMetricsQuery(id || '', { skip: !id })
  const { data: prediction } = useGetMLPredictionQuery(id || '', { skip: !id })
  const [activeTab, setActiveTab] = useState(0)
  const [showMetricsForm, setShowMetricsForm] = useState(false)

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
        <Typography color="error">Patient not found</Typography>
      </Box>
    )
  }

  const age = new Date().getFullYear() - new Date(patient.demographics.dateOfBirth).getFullYear()

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Patient Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#00d4ff' }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {patient.demographics.firstName} {patient.demographics.lastName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Patient ID: {patient.id}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`Age: ${age}`} />
                    <Chip label={patient.demographics.gender} />
                    <Chip label={patient.demographics.ethnicity} />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email /> Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Email sx={{ color: 'text.secondary' }} />
                  <Typography>{patient.demographics.contactInfo.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Phone sx={{ color: 'text.secondary' }} />
                  <Typography>{patient.demographics.contactInfo.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOn sx={{ color: 'text.secondary' }} />
                  <Typography>
                    {patient.demographics.contactInfo.address?.street}, {patient.demographics.contactInfo.address?.city}, {patient.demographics.contactInfo.address?.state} {patient.demographics.contactInfo.address?.zipCode}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarToday sx={{ color: 'text.secondary' }} />
                  <Typography>DOB: {new Date(patient.demographics.dateOfBirth).toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Medical History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Medical History</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Conditions</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {patient.medicalHistory?.conditions?.map((condition, index) => (
                    <Chip key={index} label={condition} color="warning" size="small" />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Allergies</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {patient.medicalHistory?.allergies?.map((allergy, index) => (
                    <Chip key={index} label={allergy} color="error" size="small" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Family History</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {patient.medicalHistory?.family_history?.map((history, index) => (
                    <Chip key={index} label={history} color="info" size="small" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabbed Content */}
        <Grid item xs={12}>
          <Card>
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="Overview" />
              <Tab label="Medical Data" />
              <Tab label="Analytics" />
              <Tab label="Timeline" />
            </Tabs>
            
            <CardContent>
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Patient Overview</Typography>
                  <Box sx={{ height: 400, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                    <Scene patientData={{ 
                      kidneyMetrics: kidneyMetrics || {
                        eGFR: 45,
                        creatinine: 2.1,
                        proteinuria: 150,
                        stage: 3
                      },
                      prediction: prediction || {
                        stage: 3,
                        risk_level: 'high',
                        confidence: 87.5
                      }
                    }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    3D kidney visualization based on current medical data and ML predictions.
                  </Typography>
                </Box>
              )}
              
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Medical Data</Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setShowMetricsForm(true)}
                      sx={{
                        bgcolor: '#00d4ff',
                        '&:hover': { bgcolor: '#0099cc' }
                      }}
                    >
                      Add Kidney Metrics
                    </Button>
                  </Box>
                  
                  {/* Kidney Metrics Cards */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#ffaa00', fontWeight: 700 }}>
                          {kidneyMetrics?.eGFR || 45}
                        </Typography>
                        <Typography variant="caption">eGFR (mL/min/1.73m²)</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#ff4757', fontWeight: 700 }}>
                          {kidneyMetrics?.creatinine || 2.1}
                        </Typography>
                        <Typography variant="caption">Creatinine (mg/dL)</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#ff6b35', fontWeight: 700 }}>
                          {kidneyMetrics?.proteinuria || 150}
                        </Typography>
                        <Typography variant="caption">Proteinuria (mg/g)</Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h4" sx={{ color: '#00d4ff', fontWeight: 700 }}>
                          {kidneyMetrics?.bloodPressure?.systolic || 140}/{kidneyMetrics?.bloodPressure?.diastolic || 90}
                        </Typography>
                        <Typography variant="caption">Blood Pressure (mmHg)</Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeTab === 2 && (
                <Box>
                  <MLAnalyticsPanel patientId={id || ''} />
                </Box>
              )}
              
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>Patient Timeline</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0,212,255,0.1)', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Patient Created</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(patient.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, bgcolor: 'rgba(0,255,136,0.1)', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Last Updated</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(patient.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <KidneyMetricsForm
        open={showMetricsForm}
        onClose={() => setShowMetricsForm(false)}
        patientId={id || ''}
        onSuccess={() => setShowMetricsForm(false)}
      />
    </Box>
  )
}

export default PatientDetail