import React, { useState } from 'react'
import { Box, Typography, Paper, Grid, TextField, Button } from '@mui/material'

interface MetricsForm {
  age: string
  bloodPressure: string
  specificGravity: string
  albumin: string
  sugar: string
  redBloodCells: string
  pusCell: string
  pusCellClumps: string
  bacteria: string
  bloodGlucoseRandom: string
  bloodUrea: string
  serumCreatinine: string
  sodium: string
  potassium: string
  hemoglobin: string
  packedCellVolume: string
  whiteBloodCellCount: string
  redBloodCellCount: string
  hypertension: string
  diabetesMellitus: string
  coronaryArteryDisease: string
  appetite: string
  pedalEdema: string
  anemia: string
}

const PatientMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsForm>({
    age: '',
    bloodPressure: '',
    specificGravity: '',
    albumin: '',
    sugar: '',
    redBloodCells: '',
    pusCell: '',
    pusCellClumps: '',
    bacteria: '',
    bloodGlucoseRandom: '',
    bloodUrea: '',
    serumCreatinine: '',
    sodium: '',
    potassium: '',
    hemoglobin: '',
    packedCellVolume: '',
    whiteBloodCellCount: '',
    redBloodCellCount: '',
    hypertension: '',
    diabetesMellitus: '',
    coronaryArteryDisease: '',
    appetite: '',
    pedalEdema: '',
    anemia: '',
  })

  const [prediction, setPrediction] = useState<string | null>(null)

  const handleChange = (field: keyof MetricsForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetrics({ ...metrics, [field]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Call ML model API
    setPrediction('Processing...')
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ width: 4, height: 32, backgroundColor: '#00d4ff', mr: 2, boxShadow: '0 0 10px #00d4ff' }} />
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
              PATIENT METRICS INPUT
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>
              // Enter clinical parameters for ML prediction
            </Typography>
          </Box>
        </Box>
      </Box>

      <Paper sx={{ flex: 1, p: 2, background: 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)', border: '1px solid rgba(0, 212, 255, 0.3)', boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)', overflow: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1.5}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Age" type="number" value={metrics.age} onChange={handleChange('age')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Blood Pressure (mmHg)" value={metrics.bloodPressure} onChange={handleChange('bloodPressure')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Specific Gravity" type="number" value={metrics.specificGravity} onChange={handleChange('specificGravity')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Albumin" type="number" value={metrics.albumin} onChange={handleChange('albumin')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Sugar" type="number" value={metrics.sugar} onChange={handleChange('sugar')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Red Blood Cells" value={metrics.redBloodCells} onChange={handleChange('redBloodCells')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Pus Cell" value={metrics.pusCell} onChange={handleChange('pusCell')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Pus Cell Clumps" value={metrics.pusCellClumps} onChange={handleChange('pusCellClumps')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Bacteria" value={metrics.bacteria} onChange={handleChange('bacteria')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Blood Glucose Random (mg/dL)" type="number" value={metrics.bloodGlucoseRandom} onChange={handleChange('bloodGlucoseRandom')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Blood Urea (mg/dL)" type="number" value={metrics.bloodUrea} onChange={handleChange('bloodUrea')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Serum Creatinine (mg/dL)" type="number" value={metrics.serumCreatinine} onChange={handleChange('serumCreatinine')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Sodium (mEq/L)" type="number" value={metrics.sodium} onChange={handleChange('sodium')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Potassium (mEq/L)" type="number" value={metrics.potassium} onChange={handleChange('potassium')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Hemoglobin (g/dL)" type="number" value={metrics.hemoglobin} onChange={handleChange('hemoglobin')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Packed Cell Volume" type="number" value={metrics.packedCellVolume} onChange={handleChange('packedCellVolume')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="White Blood Cell Count" type="number" value={metrics.whiteBloodCellCount} onChange={handleChange('whiteBloodCellCount')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Red Blood Cell Count" type="number" value={metrics.redBloodCellCount} onChange={handleChange('redBloodCellCount')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Hypertension (yes/no)" value={metrics.hypertension} onChange={handleChange('hypertension')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Diabetes Mellitus (yes/no)" value={metrics.diabetesMellitus} onChange={handleChange('diabetesMellitus')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Coronary Artery Disease (yes/no)" value={metrics.coronaryArteryDisease} onChange={handleChange('coronaryArteryDisease')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Appetite (good/poor)" value={metrics.appetite} onChange={handleChange('appetite')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Pedal Edema (yes/no)" value={metrics.pedalEdema} onChange={handleChange('pedalEdema')} required size="small" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Anemia (yes/no)" value={metrics.anemia} onChange={handleChange('anemia')} required size="small" />
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: '#00d4ff',
                  color: '#0a0e1a',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  px: 6,
                  py: 1.2,
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                  '&:hover': { bgcolor: '#00b8e6', boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' },
                }}
              >
                PREDICT KIDNEY HEALTH
              </Button>
              <Button
                type="reset"
                variant="outlined"
                sx={{
                  borderColor: '#ff6b35',
                  color: '#ff6b35',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  px: 6,
                  py: 1.2,
                  '&:hover': { borderColor: '#ff8555', bgcolor: 'rgba(255, 107, 53, 0.1)' },
                }}
              >
                RESET
              </Button>
            </Box>
          </Grid>
        </form>

        {prediction && (
          <Paper sx={{ mt: 2, p: 2, background: 'linear-gradient(135deg, #2a3441 0%, #3d4a5c 100%)', border: '2px solid #00ff88', boxShadow: '0 0 30px rgba(0, 255, 136, 0.2)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00ff88', mr: 1.5, boxShadow: '0 0 15px #00ff88' }} />
              <Typography variant="h6" sx={{ color: '#00ff88', fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem' }}>
                PREDICTION RESULT
              </Typography>
            </Box>
            <Typography sx={{ color: '#fff', fontSize: '1rem', fontFamily: 'monospace' }}>{prediction}</Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  )
}

export default PatientMetrics
