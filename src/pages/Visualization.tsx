import React, { useState } from 'react'
import { Box, Typography, Paper, CircularProgress, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Grid, Card, CardContent, Chip, Slider, Switch, FormControlLabel } from '@mui/material'
import { useParams } from 'react-router-dom'
import { Person, ThreeDRotation, Tune } from '@mui/icons-material'
import Scene from '../components/3d/Scene'
import { useGetMLPredictionQuery, useGetKidneyMetricsQuery, useGetPatientsQuery } from '../services/api'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Visualization: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const themeMode = useSelector((state: RootState) => state.ui.theme)
  const [selectedPatientId, setSelectedPatientId] = useState<string>(id || '')
  const [interactiveMode, setInteractiveMode] = useState(false)
  
  // Interactive metric states
  const [interactiveMetrics, setInteractiveMetrics] = useState({
    eGFR: 90,
    creatinine: 1.0,
    proteinuria: 150,
    systolic: 120,
    diastolic: 80
  })
  
  const { data: patients, isLoading: patientsLoading } = useGetPatientsQuery()
  const { data: mlPrediction } = useGetMLPredictionQuery(selectedPatientId, { skip: !selectedPatientId })
  const { data: kidneyMetrics } = useGetKidneyMetricsQuery(selectedPatientId, { skip: !selectedPatientId })
  
  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatientId(event.target.value)
    // Reset interactive metrics when patient changes
    if (kidneyMetrics) {
      setInteractiveMetrics({
        eGFR: kidneyMetrics.eGFR || 90,
        creatinine: Number(kidneyMetrics.creatinine || 1.0),
        proteinuria: kidneyMetrics.proteinuria || 150,
        systolic: kidneyMetrics.bloodPressure?.systolic || 120,
        diastolic: kidneyMetrics.bloodPressure?.diastolic || 80
      })
    }
  }
  
  const calculateStageFromMetrics = (eGFR: number, proteinuria: number) => {
    if (eGFR >= 90 && proteinuria < 150) return 0
    if (eGFR >= 90) return 1
    if (eGFR >= 60) return 2
    if (eGFR >= 30) return 3
    if (eGFR >= 15) return 4
    return 5
  }
  
  const selectedPatient = patients?.find(p => p.id === selectedPatientId)

  if (patientsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Use interactive metrics if in interactive mode, otherwise use real data
  const currentMetrics = interactiveMode ? interactiveMetrics : {
    eGFR: kidneyMetrics?.eGFR || 90,
    creatinine: Number(kidneyMetrics?.creatinine || 1.0),
    proteinuria: kidneyMetrics?.proteinuria || 150,
    systolic: kidneyMetrics?.bloodPressure?.systolic || 120,
    diastolic: kidneyMetrics?.bloodPressure?.diastolic || 80
  }
  
  const stage = interactiveMode 
    ? calculateStageFromMetrics(currentMetrics.eGFR, currentMetrics.proteinuria)
    : (mlPrediction?.stage || kidneyMetrics?.stage || 1)
  const confidence = mlPrediction?.confidence || 0
  const confidencePercent = confidence > 1 ? Math.round(confidence) : Math.round(confidence * 100)
  
  const getStageColor = (stage: number) => {
    switch(stage) {
      case 0:
      case 1: return '#00ff88'
      case 2: return '#ffaa00'
      case 3: return '#ff6b35'
      case 4: return '#ff4757'
      case 5: return '#8b0000'
      default: return '#94a3b8'
    }
  }


  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ThreeDRotation sx={{ color: '#00d4ff', mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: themeMode === 'dark' ? '#ffffff' : '#000000' }}>
            3D Kidney Visualization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Interactive patient-specific kidney models
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Patient</InputLabel>
            <Select
              value={selectedPatientId}
              onChange={handlePatientChange}
              label="Select Patient"
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
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Person sx={{ fontSize: 40, color: '#00d4ff' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedPatient.demographics.firstName} {selectedPatient.demographics.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPatient.demographics.gender} • CKD Stage {stage}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={interactiveMode}
                        onChange={(e) => setInteractiveMode(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Interactive Mode"
                    sx={{ mr: 2 }}
                  />
                  <Chip 
                    label={`Stage ${stage}`} 
                    sx={{ 
                      bgcolor: `${getStageColor(stage)}20`, 
                      color: getStageColor(stage),
                      fontWeight: 600
                    }} 
                  />
                  {!interactiveMode && (
                    <Chip 
                      label={`${confidencePercent}% Confidence`} 
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {selectedPatientId && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#ff6b35', fontWeight: 700 }}>
                {Math.round(currentMetrics.eGFR)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                eGFR (mL/min/1.73m²)
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#ffaa00', fontWeight: 700 }}>
                {currentMetrics.creatinine.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Creatinine (mg/dL)
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: '#8a2be2', fontWeight: 700 }}>
                {Math.round(currentMetrics.proteinuria)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Proteinuria (mg/g)
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" sx={{ color: getStageColor(stage), fontWeight: 700 }}>
                {stage}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CKD Stage
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Interactive Controls */}
      {selectedPatientId && interactiveMode && (
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tune sx={{ color: '#00d4ff' }} />
            Interactive Controls
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>eGFR: {Math.round(interactiveMetrics.eGFR)} mL/min/1.73m²</Typography>
              <Slider
                value={interactiveMetrics.eGFR}
                onChange={(_: Event, value: number | number[]) => setInteractiveMetrics(prev => ({ ...prev, eGFR: value as number }))}
                min={5}
                max={120}
                step={1}
                sx={{ color: '#ff6b35' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Creatinine: {interactiveMetrics.creatinine.toFixed(1)} mg/dL</Typography>
              <Slider
                value={interactiveMetrics.creatinine}
                onChange={(_: Event, value: number | number[]) => setInteractiveMetrics(prev => ({ ...prev, creatinine: value as number }))}
                min={0.5}
                max={8.0}
                step={0.1}
                sx={{ color: '#ffaa00' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Proteinuria: {Math.round(interactiveMetrics.proteinuria)} mg/g</Typography>
              <Slider
                value={interactiveMetrics.proteinuria}
                onChange={(_: Event, value: number | number[]) => setInteractiveMetrics(prev => ({ ...prev, proteinuria: value as number }))}
                min={30}
                max={3000}
                step={10}
                sx={{ color: '#8a2be2' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Blood Pressure: {interactiveMetrics.systolic}/{interactiveMetrics.diastolic} mmHg</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption">Systolic</Typography>
                  <Slider
                    value={interactiveMetrics.systolic}
                    onChange={(_: Event, value: number | number[]) => setInteractiveMetrics(prev => ({ ...prev, systolic: value as number }))}
                    min={90}
                    max={200}
                    step={1}
                    sx={{ color: '#ff4757' }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption">Diastolic</Typography>
                  <Slider
                    value={interactiveMetrics.diastolic}
                    onChange={(_: Event, value: number | number[]) => setInteractiveMetrics(prev => ({ ...prev, diastolic: value as number }))}
                    min={60}
                    max={120}
                    step={1}
                    sx={{ color: '#ff4757' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}

      {selectedPatientId ? (
        <Paper sx={{ height: '500px', borderRadius: 2, overflow: 'hidden' }}>
          <Scene
            patientData={{
              kidneyMetrics: {
                eGFR: currentMetrics.eGFR,
                creatinine: currentMetrics.creatinine,
                proteinuria: currentMetrics.proteinuria,
                bloodPressure: {
                  systolic: currentMetrics.systolic,
                  diastolic: currentMetrics.diastolic
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
        </Paper>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Person sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Select a patient to view 3D visualization
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose from the dropdown above to see interactive kidney models
          </Typography>
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
