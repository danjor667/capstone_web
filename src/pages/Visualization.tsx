import React from 'react'
import { Box, Typography, Paper, Chip, Grid, CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import Scene from '../components/3d/Scene'
import { useGetMLPredictionQuery, useGetKidneyMetricsQuery } from '../services/api'

const Visualization: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: mlPrediction, isLoading: mlLoading } = useGetMLPredictionQuery(id || '', { skip: !id })
  const { data: kidneyMetrics, isLoading: metricsLoading } = useGetKidneyMetricsQuery(id || '', { skip: !id })

  if (mlLoading || metricsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isHealthy = mlPrediction?.predicted_stage <= 2
  const confidence = mlPrediction?.confidence || 0
  const stage = mlPrediction?.predicted_stage || kidneyMetrics?.stage || 1
  const eGFR = kidneyMetrics?.eGFR || mlPrediction?.input_data?.eGFR || 90
  const damage = stage >= 3 ? (stage - 1) * 20 : 10
  const inflammation = mlPrediction?.risk_level === 'high' ? 70 : mlPrediction?.risk_level === 'medium' ? 40 : 20

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
            label={isHealthy ? 'HEALTHY' : mlPrediction?.prediction_result || 'CKD DETECTED'}
            sx={{
              bgcolor: isHealthy ? '#00ff88' : '#ff4757',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 3,
              py: 2.5,
              fontFamily: 'monospace',
              boxShadow: isHealthy ? '0 0 20px rgba(0, 255, 136, 0.5)' : '0 0 20px rgba(255, 71, 87, 0.5)',
            }}
          />
        </Box>
      </Box>

      <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)', mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                CKD STAGE
              </Typography>
              <Typography variant="h3" sx={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700 }}>
                {stage}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(255, 107, 53, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                eGFR
              </Typography>
              <Typography variant="h3" sx={{ color: '#ff6b35', fontFamily: 'monospace', fontWeight: 700 }}>
                {eGFR}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                CONFIDENCE
              </Typography>
              <Typography variant="h3" sx={{ color: '#00ff88', fontFamily: 'monospace', fontWeight: 700 }}>
                {confidence}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ background: 'linear-gradient(135deg, #1a2332 0%, #2a3441 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)', height: '600px', borderRadius: 2, overflow: 'hidden' }}>
        <Scene
          patientData={{
            kidneyMetrics: {
              eGFR: eGFR,
              creatinine: kidneyMetrics?.creatinine || mlPrediction?.input_data?.serumCreatinine || 1.5,
              proteinuria: kidneyMetrics?.proteinuria || 300,
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
      </Paper>
    </Box>
  )
}

export default Visualization
