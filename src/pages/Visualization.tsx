import React from 'react'
import { Box, Typography, Paper, Chip, Grid } from '@mui/material'
import Scene from '../components/3d/Scene'

const Visualization: React.FC = () => {
  // TODO: Get ML prediction result from state/API
  const mlPrediction = {
    isHealthy: false,
    confidence: 0.87,
    stage: 3,
    eGFR: 45,
    damage: 65,
    inflammation: 55,
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
            label={mlPrediction.isHealthy ? 'HEALTHY' : 'CKD DETECTED'}
            sx={{
              bgcolor: mlPrediction.isHealthy ? '#00ff88' : '#ff4757',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 3,
              py: 2.5,
              fontFamily: 'monospace',
              boxShadow: mlPrediction.isHealthy ? '0 0 20px rgba(0, 255, 136, 0.5)' : '0 0 20px rgba(255, 71, 87, 0.5)',
            }}
          />
        </Box>
      </Box>

      <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)', mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                CKD STAGE
              </Typography>
              <Typography variant="h3" sx={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700 }}>
                {mlPrediction.stage}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(255, 107, 53, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                eGFR
              </Typography>
              <Typography variant="h3" sx={{ color: '#ff6b35', fontFamily: 'monospace', fontWeight: 700 }}>
                {mlPrediction.eGFR}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                CONFIDENCE
              </Typography>
              <Typography variant="h3" sx={{ color: '#00ff88', fontFamily: 'monospace', fontWeight: 700 }}>
                {(mlPrediction.confidence * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)', height: '600px', borderRadius: 2, overflow: 'hidden' }}>
        <Scene
          patientData={{
            kidneyMetrics: {
              leftKidney: {
                volume: 150,
                bloodFlow: mlPrediction.isHealthy ? 600 : 400,
                filtrationRate: mlPrediction.eGFR,
                damage: mlPrediction.damage,
                inflammation: mlPrediction.inflammation,
              },
              rightKidney: {
                volume: 150,
                bloodFlow: mlPrediction.isHealthy ? 600 : 400,
                filtrationRate: mlPrediction.eGFR,
                damage: mlPrediction.damage,
                inflammation: mlPrediction.inflammation,
              },
              stage: mlPrediction.stage,
              eGFR: mlPrediction.eGFR,
              creatinine: 1.5,
              proteinuria: 300,
            },
          }}
        />
      </Paper>
    </Box>
  )
}

export default Visualization
