import React from 'react'
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material'
import { Psychology, TrendingUp } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface ModelMetricsCardProps {
  modelMetrics: any
}

const ModelMetricsCard: React.FC<ModelMetricsCardProps> = ({ modelMetrics }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const model_info = modelMetrics?.model_info || {}
  const training_dataset = modelMetrics?.training_dataset || {}

  return (
    <Card sx={{ 
      bgcolor: themeMode === 'dark' ? '#1e293b' : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(148,163,184,0.2)' 
        : '1px solid rgba(226,232,240,1)'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Psychology /> ML Model Performance
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{model_info?.name || 'ML Model'}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={model_info?.version || 'v1.0.0'} size="small" sx={{ bgcolor: themeMode === 'dark' ? '#475569' : '#64748b', color: 'white' }} />
            <Chip label={model_info?.status || 'Active'} size="small" color="success" />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {model_info?.algorithm || 'Machine Learning Algorithm'}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Samples</Typography>
              <Typography variant="h5" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 700 }}>
                {training_dataset?.total_samples?.toLocaleString() || '0'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Features Selected</Typography>
              <Typography variant="h5" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 700 }}>
                {training_dataset?.features_selected || '0'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Positive Cases</Typography>
              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#cbd5e1' : '#475569' }}>
                {training_dataset?.positive_cases?.toLocaleString() || '0'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Negative Cases</Typography>
              <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#cbd5e1' : '#475569' }}>
                {training_dataset?.negative_cases?.toLocaleString() || '0'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, p: 2, bgcolor: themeMode === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(241,245,249,1)', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <TrendingUp sx={{ fontSize: 14 }} /> Model Architecture
          </Typography>
          <Typography variant="body2">
            {model_info?.optimization || 'Model optimization details'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ModelMetricsCard