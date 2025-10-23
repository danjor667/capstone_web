import React from 'react'
import { Box, Typography, Card, CardContent, Grid, Chip, LinearProgress, Avatar } from '@mui/material'
import { TrendingUp, TrendingDown, Assessment, Timeline, Warning, CheckCircle } from '@mui/icons-material'

const Analytics: React.FC = () => {
  const analyticsData = {
    prediction: { result: 'CKD Stage 3', confidence: 87.3, riskLevel: 'High' },
    trends: [
      { metric: 'eGFR', value: 45, change: -12, trend: 'down', color: '#ff4757' },
      { metric: 'Creatinine', value: 2.1, change: +15, trend: 'up', color: '#ff6b35' },
      { metric: 'Blood Pressure', value: '140/90', change: +8, trend: 'up', color: '#ffaa00' },
      { metric: 'Proteinuria', value: 150, change: +22, trend: 'up', color: '#ff4757' }
    ],
    riskFactors: [
      { name: 'Age', impact: 85, modifiable: false },
      { name: 'Diabetes', impact: 92, modifiable: true },
      { name: 'Hypertension', impact: 78, modifiable: true },
      { name: 'Family History', impact: 65, modifiable: false }
    ],
    recommendations: [
      { priority: 'Critical', text: 'Immediate nephrologist consultation', status: 'pending' },
      { priority: 'High', text: 'Daily blood pressure monitoring', status: 'active' },
      { priority: 'Medium', text: 'Dietary protein restriction', status: 'completed' },
      { priority: 'Medium', text: 'Increase fluid intake', status: 'active' }
    ]
  }

  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto', background: 'linear-gradient(135deg, rgba(0,212,255,0.02) 0%, rgba(255,107,53,0.02) 100%)' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment sx={{ color: '#00d4ff' }} />
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">AI-powered kidney health analysis and predictions</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ML Prediction */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,71,87,0.3)', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: '#ff4757', mx: 'auto', mb: 2 }}>
                <Assessment sx={{ fontSize: 30 }} />
              </Avatar>
              <Typography variant="h6" sx={{ color: '#ff4757', mb: 1 }}>ML Prediction</Typography>
              <Chip label={analyticsData.prediction.result} sx={{ bgcolor: 'rgba(255,71,87,0.2)', color: '#ff4757', mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="h3" sx={{ color: '#ff4757', fontWeight: 700 }}>{analyticsData.prediction.confidence}%</Typography>
                <Typography variant="caption" color="text.secondary">Confidence Level</Typography>
              </Box>
              <LinearProgress variant="determinate" value={analyticsData.prediction.confidence} sx={{ bgcolor: 'rgba(255,71,87,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#ff4757' } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Key Trends */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00d4ff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline /> Key Trends (Last 6 Months)
              </Typography>
              <Grid container spacing={2}>
                {analyticsData.trends.map((trend, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ p: 2, bgcolor: `rgba(${trend.color.slice(1).match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',')}, 0.1)`, borderRadius: 1, border: `1px solid ${trend.color}30` }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>{trend.metric}</Typography>
                        {trend.trend === 'up' ? <TrendingUp sx={{ color: trend.color, fontSize: 16 }} /> : <TrendingDown sx={{ color: trend.color, fontSize: 16 }} />}
                      </Box>
                      <Typography variant="h6" sx={{ color: trend.color, fontWeight: 700 }}>{trend.value}</Typography>
                      <Typography variant="caption" sx={{ color: trend.color }}>{trend.change > 0 ? '+' : ''}{trend.change}% change</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Factors */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(255,170,0,0.3)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffaa00', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning /> Risk Factors
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analyticsData.riskFactors.map((factor, index) => (
                  <Box key={index} sx={{ p: 2, bgcolor: 'rgba(255,170,0,0.05)', borderRadius: 1, border: '1px solid rgba(255,170,0,0.1)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{factor.name}</Typography>
                      <Chip label={factor.modifiable ? 'Modifiable' : 'Non-modifiable'} size="small" sx={{ bgcolor: factor.modifiable ? 'rgba(0,255,136,0.2)' : 'rgba(148,163,184,0.2)', color: factor.modifiable ? '#00ff88' : '#94a3b8' }} />
                    </Box>
                    <LinearProgress variant="determinate" value={factor.impact} sx={{ mb: 1, bgcolor: 'rgba(255,170,0,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#ffaa00' } }} />
                    <Typography variant="caption" color="text.secondary">Impact: {factor.impact}%</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(0,255,136,0.3)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ff88', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle /> Action Items
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {analyticsData.recommendations.map((rec, index) => (
                  <Box key={index} sx={{ p: 2, bgcolor: 'rgba(0,255,136,0.05)', borderRadius: 1, border: '1px solid rgba(0,255,136,0.1)', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      bgcolor: rec.status === 'completed' ? '#00ff88' : rec.status === 'active' ? '#00d4ff' : '#ffaa00',
                      boxShadow: `0 0 8px ${rec.status === 'completed' ? '#00ff88' : rec.status === 'active' ? '#00d4ff' : '#ffaa00'}`
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip label={rec.priority} size="small" sx={{ 
                          bgcolor: rec.priority === 'Critical' ? 'rgba(255,71,87,0.2)' : rec.priority === 'High' ? 'rgba(255,170,0,0.2)' : 'rgba(0,212,255,0.2)',
                          color: rec.priority === 'Critical' ? '#ff4757' : rec.priority === 'High' ? '#ffaa00' : '#00d4ff'
                        }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{rec.status}</Typography>
                      </Box>
                      <Typography variant="body2">{rec.text}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progression Timeline */}
        <Grid item xs={12}>
          <Card sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00d4ff', mb: 3 }}>Disease Progression Timeline</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, p: 2, bgcolor: 'rgba(0,212,255,0.05)', borderRadius: 1 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#00ff88', fontWeight: 700 }}>Stage 1</Typography>
                  <Typography variant="caption" color="text.secondary">2019-2020</Typography>
                </Box>
                <Box sx={{ width: 40, height: 2, bgcolor: '#00d4ff' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ffaa00', fontWeight: 700 }}>Stage 2</Typography>
                  <Typography variant="caption" color="text.secondary">2021-2022</Typography>
                </Box>
                <Box sx={{ width: 40, height: 2, bgcolor: '#00d4ff' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ff4757', fontWeight: 700 }}>Stage 3</Typography>
                  <Typography variant="caption" color="text.secondary">2023-Present</Typography>
                </Box>
                <Box sx={{ width: 40, height: 2, bgcolor: '#94a3b8', opacity: 0.3 }} />
                <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                  <Typography variant="h4" sx={{ color: '#94a3b8', fontWeight: 700 }}>Stage 4</Typography>
                  <Typography variant="caption" color="text.secondary">Predicted: 2025</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics