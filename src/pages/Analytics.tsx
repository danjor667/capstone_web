import React from 'react'
import { Box, Typography, Paper, Grid, Chip } from '@mui/material'

const Analytics: React.FC = () => {
  // TODO: Get ML prediction result from state/API
  const mlResult = {
    prediction: 'CKD Detected',
    isHealthy: false,
    confidence: 87.3,
    stage: 3,
    riskLevel: 'High',
    inputMetrics: {
      age: 65,
      bloodPressure: '150/90',
      serumCreatinine: 2.1,
      bloodUrea: 45,
      hemoglobin: 10.2,
      eGFR: 45,
    },
    recommendations: [
      'Immediate consultation with nephrologist required',
      'Monitor blood pressure daily',
      'Reduce protein intake to 0.8g/kg body weight',
      'Increase fluid intake to 2-3 liters per day',
      'Regular kidney function tests every 3 months',
    ],
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 4, height: 40, backgroundColor: '#00d4ff', mr: 2, boxShadow: '0 0 10px #00d4ff' }} />
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
              ML PREDICTION ANALYTICS
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              // Comprehensive diagnostic analysis and recommendations
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ width: 3, height: 24, backgroundColor: '#00d4ff', mr: 1.5, boxShadow: '0 0 8px #00d4ff' }} />
              <Typography variant="h6" sx={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                PREDICTION RESULT
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Chip
                label={mlResult.prediction}
                sx={{
                  bgcolor: mlResult.isHealthy ? '#00ff88' : '#ff4757',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  px: 3,
                  py: 3,
                  fontFamily: 'monospace',
                  boxShadow: mlResult.isHealthy ? '0 0 20px rgba(0, 255, 136, 0.5)' : '0 0 20px rgba(255, 71, 87, 0.5)',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
              <Box sx={{ flex: 1, p: 2, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  CONFIDENCE
                </Typography>
                <Typography variant="h4" sx={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700 }}>
                  {mlResult.confidence}%
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 2, background: 'rgba(255, 107, 53, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  CKD STAGE
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff6b35', fontFamily: 'monospace', fontWeight: 700 }}>
                  {mlResult.stage}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 2, background: 'rgba(255, 71, 87, 0.05)', border: '1px solid rgba(255, 71, 87, 0.2)', borderRadius: 1 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  RISK LEVEL
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff4757', fontFamily: 'monospace', fontWeight: 700 }}>
                  {mlResult.riskLevel}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ width: 3, height: 24, backgroundColor: '#00d4ff', mr: 1.5, boxShadow: '0 0 8px #00d4ff' }} />
              <Typography variant="h6" sx={{ color: '#00d4ff', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                KEY METRICS
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    AGE
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.age} years
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    BLOOD PRESSURE
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.bloodPressure}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    CREATININE
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.serumCreatinine} mg/dL
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    BLOOD UREA
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.bloodUrea} mg/dL
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    HEMOGLOBIN
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.hemoglobin} g/dL
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1.5, background: 'rgba(0, 212, 255, 0.05)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    eGFR
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>
                    {mlResult.inputMetrics.eGFR}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)', border: '1px solid rgba(255, 107, 53, 0.3)', boxShadow: '0 0 20px rgba(255, 107, 53, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ width: 3, height: 24, backgroundColor: '#ff6b35', mr: 1.5, boxShadow: '0 0 8px #ff6b35' }} />
              <Typography variant="h6" sx={{ color: '#ff6b35', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em' }}>
                CLINICAL RECOMMENDATIONS
              </Typography>
            </Box>
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {mlResult.recommendations.map((rec, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    color: '#fff',
                    mb: 2,
                    fontSize: '1rem',
                    fontFamily: 'monospace',
                    p: 1.5,
                    background: 'rgba(255, 107, 53, 0.05)',
                    border: '1px solid rgba(255, 107, 53, 0.1)',
                    borderRadius: 1,
                    listStyle: 'none',
                    position: 'relative',
                    pl: 3,
                    '&::before': {
                      content: '"▸"',
                      position: 'absolute',
                      left: 12,
                      color: '#ff6b35',
                      fontWeight: 'bold',
                    },
                  }}
                >
                  {rec}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics
