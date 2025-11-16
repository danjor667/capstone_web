import React from 'react'
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material'
import { Security, CheckCircle, Warning, Error } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

interface ConfidenceThresholdsProps {
  modelMetrics: any
}

const ConfidenceThresholds: React.FC<ConfidenceThresholdsProps> = ({ modelMetrics }) => {
  const themeMode = useSelector((state: RootState) => state.ui.theme)

  const clinical_thresholds = modelMetrics?.clinical_thresholds || {
    high_confidence: 90,
    medium_confidence: 70,
    low_confidence: 50
  }

  const thresholds = [
    {
      level: 'High Confidence',
      value: clinical_thresholds.high_confidence,
      color: themeMode === 'dark' ? '#94a3b8' : '#334155',
      icon: <CheckCircle />,
      description: 'Reliable for clinical decisions'
    },
    {
      level: 'Medium Confidence',
      value: clinical_thresholds.medium_confidence,
      color: themeMode === 'dark' ? '#6b7280' : '#4b5563',
      icon: <Warning />,
      description: 'Requires clinical review'
    },
    {
      level: 'Low Confidence',
      value: clinical_thresholds.low_confidence,
      color: themeMode === 'dark' ? '#64748b' : '#475569',
      icon: <Error />,
      description: 'Additional testing recommended'
    }
  ]

  return (
    <Card sx={{ 
      bgcolor: themeMode === 'dark' ? '#1e293b' : '#ffffff',
      border: themeMode === 'dark' 
        ? '1px solid rgba(148,163,184,0.2)' 
        : '1px solid rgba(226,232,240,1)'
    }}>
      <CardContent>
        <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#e2e8f0' : '#334155', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security /> Confidence Thresholds
        </Typography>
        
        {thresholds.map((threshold, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: threshold.color }}>{threshold.icon}</Box>
                <Typography variant="subtitle2">{threshold.level}</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: threshold.color, fontWeight: 700 }}>
                ≥{threshold.value}%
              </Typography>
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={threshold.value} 
              sx={{ 
                mb: 1,
                bgcolor: `rgba(${threshold.color.slice(1).match(/.{2}/g)?.map((x: string) => parseInt(x, 16)).join(',')}, 0.1)`,
                '& .MuiLinearProgress-bar': { bgcolor: threshold.color } 
              }} 
            />
            
            <Typography variant="caption" color="text.secondary">
              {threshold.description}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default ConfidenceThresholds