import React from 'react'
import { Card, CardContent, Typography, Box, LinearProgress, Grid } from '@mui/material'
import { Assessment } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface PerformanceMetricsCardProps {
  modelMetrics: any
}

const PerformanceMetricsCard: React.FC<PerformanceMetricsCardProps> = ({ modelMetrics }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const performance_metrics = modelMetrics?.performance_metrics || {}

  return (
    <Card sx={{ 
      bgcolor: themeMode === 'dark' ? '#1e293b' : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(148,163,184,0.2)' 
        : '1px solid rgba(226,232,240,1)'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment /> Performance Metrics
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Accuracy</Typography>
              <Typography variant="h5" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 700 }}>
                {performance_metrics.accuracy || 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={performance_metrics.accuracy || 0} 
                sx={{ 
                  bgcolor: themeMode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(226,232,240,1)', 
                  '& .MuiLinearProgress-bar': { bgcolor: themeMode === 'dark' ? '#64748b' : '#475569' } 
                }} 
              />
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">F1-Score</Typography>
              <Typography variant="h5" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 700 }}>
                {performance_metrics.f1_score || 0}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={performance_metrics.f1_score || 0} 
                sx={{ 
                  bgcolor: themeMode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(226,232,240,1)', 
                  '& .MuiLinearProgress-bar': { bgcolor: themeMode === 'dark' ? '#64748b' : '#475569' } 
                }} 
              />
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">Precision</Typography>
              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#cbd5e1' : '#475569' }}>
                {performance_metrics.precision || 0}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">Recall</Typography>
              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#cbd5e1' : '#475569' }}>
                {performance_metrics.recall || 0}%
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">AUC Score</Typography>
              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#cbd5e1' : '#475569' }}>
                {performance_metrics.auc_score || 0}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default PerformanceMetricsCard