import React from 'react'
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material'
import { Engineering, TrendingUp } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface FeatureEngineeringCardProps {
  modelMetrics: any
}

const FeatureEngineeringCard: React.FC<FeatureEngineeringCardProps> = ({ modelMetrics }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const feature_engineering = modelMetrics?.feature_engineering || {}

  return (
    <Card sx={{ 
      bgcolor: themeMode === 'dark' ? '#1e293b' : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(148,163,184,0.2)' 
        : '1px solid rgba(226,232,240,1)'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Engineering /> Feature Engineering
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#1e293b', fontWeight: 700 }}>
            {feature_engineering.total_features || 0}
          </Typography>
          <Typography variant="caption" color="text.secondary">Selected Features</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Original Features</Typography>
            <Chip 
              label={feature_engineering.original_features || 0} 
              size="small" 
              sx={{ bgcolor: themeMode === 'dark' ? '#475569' : '#64748b', color: 'white' }} 
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2">Reduction Ratio</Typography>
            <Chip 
              label={`${feature_engineering.reduction_ratio || 0}%`} 
              size="small" 
              sx={{ bgcolor: themeMode === 'dark' ? '#475569' : '#64748b', color: 'white' }} 
            />
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={feature_engineering.reduction_ratio || 0} 
          sx={{ 
            mb: 2,
            bgcolor: themeMode === 'dark' ? 'rgba(148,163,184,0.2)' : 'rgba(226,232,240,1)', 
            '& .MuiLinearProgress-bar': { bgcolor: themeMode === 'dark' ? '#64748b' : '#475569' } 
          }} 
        />

        <Box sx={{ 
          p: 2, 
          bgcolor: themeMode === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(241,245,249,1)', 
          borderRadius: 1 
        }}>
          <Typography variant="caption" sx={{ color: themeMode === 'dark' ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <TrendingUp sx={{ fontSize: 14 }} /> Top Features
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {feature_engineering.selected_features?.slice(0, 5).map((feature: string, index: number) => (
              <Chip 
                key={index}
                label={feature} 
                size="small" 
                sx={{ bgcolor: themeMode === 'dark' ? '#475569' : '#64748b', color: 'white', fontSize: '0.7rem' }} 
              />
            )) || <Typography variant="caption">No features available</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default FeatureEngineeringCard