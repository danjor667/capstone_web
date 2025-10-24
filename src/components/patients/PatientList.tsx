import React, { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Box, TextField, InputAdornment, Avatar, Chip, Button } from '@mui/material'
import { Search, Person, Add } from '@mui/icons-material'
import { useGetPatientsQuery, useSearchPatientsQuery } from '../../services/api'
import { PatientData } from '../../types/patient'
import PatientRegistrationForm from '../forms/PatientRegistrationForm'
import { useNavigate } from 'react-router-dom'

interface PatientCardProps {
  patient: PatientData
  onClick: (patient: PatientData) => void
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const age = new Date().getFullYear() - new Date(patient.demographics.dateOfBirth).getFullYear()
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,212,255,0.15)'
        }
      }}
      onClick={() => onClick(patient)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#00d4ff', mr: 2 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              {patient.demographics.firstName} {patient.demographics.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {patient.id}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Age: {age} • {patient.demographics.gender}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.demographics.contactInfo.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Active" size="small" color="success" />
        </Box>
      </CardContent>
    </Card>
  )
}

const PatientList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  
  const { data: allPatients, isLoading: loadingAll } = useGetPatientsQuery()
  const { data: searchResults, isLoading: loadingSearch } = useSearchPatientsQuery(searchQuery, {
    skip: !searchQuery.trim()
  })
  
  const patients = searchQuery.trim() ? searchResults : allPatients
  const isLoading = searchQuery.trim() ? loadingSearch : loadingAll

  const handlePatientClick = (patient: PatientData) => {
    navigate(`/patients/${patient.id}`)
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading patients...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Patient Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowRegistrationForm(true)}
            sx={{
              bgcolor: '#00d4ff',
              '&:hover': { bgcolor: '#0099cc' }
            }}
          >
            Add New Patient
          </Button>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Search patients by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      <Grid container spacing={3}>
        {patients?.map(patient => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
            <PatientCard 
              patient={patient} 
              onClick={handlePatientClick}
            />
          </Grid>
        ))}
      </Grid>

      {patients?.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? 'No patients found matching your search' : 'No patients available'}
          </Typography>
        </Box>
      )}
      
      <PatientRegistrationForm
        open={showRegistrationForm}
        onClose={() => setShowRegistrationForm(false)}
        onSuccess={() => setShowRegistrationForm(false)}
      />
    </Box>
  )
}

export default PatientList