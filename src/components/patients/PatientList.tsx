import React, { useState } from 'react'
import { 
  Grid, Card, CardContent, Typography, Box, TextField, InputAdornment, 
  Avatar, Chip, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Menu, MenuItem, Alert, Pagination
} from '@mui/material'
import { 
  Search, Person, Add, MoreVert, Visibility, Edit, 
  GridView, ViewList, FilterList 
} from '@mui/icons-material'
import { useGetPatientsQuery, useSearchPatientsQuery } from '../../services/api'
import { PatientData } from '../../types/patient'
import PatientRegistrationForm from '../forms/PatientRegistrationForm'
import PatientEditForm from '../forms/PatientEditForm'
import { useNavigate } from 'react-router-dom'

interface PatientCardProps {
  patient: PatientData
  onClick: (patient: PatientData) => void
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A'
    const birthDate = new Date(dateOfBirth)
    if (isNaN(birthDate.getTime())) return 'N/A'
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  const age = calculateAge(patient.demographics.dateOfBirth)
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  
  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: 220,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
      onClick={() => onClick(patient)}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: '#3b82f6', mr: 2 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {patient.demographics.firstName} {patient.demographics.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age {age} • {patient.demographics.gender}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            📧 {patient.demographics.contactInfo.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📞 {patient.demographics.contactInfo.phone}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
          <Chip 
            label="Active" 
            size="small" 
            sx={{ 
              bgcolor: '#dcfce7', 
              color: '#166534',
              fontSize: '0.75rem'
            }} 
          />
          <Chip 
            label={`ID: ${patient.id.slice(0, 8)}...`} 
            size="small" 
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onClick(patient); handleMenuClose() }}>
            <Visibility sx={{ mr: 1, fontSize: 18 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={() => { setShowEditForm(true); handleMenuClose() }}>
            <Edit sx={{ mr: 1, fontSize: 18 }} />
            Edit Patient
          </MenuItem>
        </Menu>
        
        <PatientEditForm
          open={showEditForm}
          onClose={() => setShowEditForm(false)}
          patient={patient}
          onSuccess={() => setShowEditForm(false)}
        />
      </CardContent>
    </Card>
  )
}

const PatientTableRow: React.FC<PatientCardProps> = ({ patient, onClick }) => {
  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return 'N/A'
    const birthDate = new Date(dateOfBirth)
    if (isNaN(birthDate.getTime())) return 'N/A'
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  const age = calculateAge(patient.demographics.dateOfBirth)
  
  return (
    <TableRow 
      hover 
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick(patient)}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#3b82f6', mr: 2 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {patient.demographics.firstName} {patient.demographics.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {patient.id.slice(0, 8)}...
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{age}</TableCell>
      <TableCell>{patient.demographics.gender}</TableCell>
      <TableCell>{patient.demographics.contactInfo.email}</TableCell>
      <TableCell>{patient.demographics.contactInfo.phone}</TableCell>
      <TableCell>
        <Chip 
          label="Active" 
          size="small" 
          sx={{ 
            bgcolor: '#dcfce7', 
            color: '#166534',
            fontSize: '0.75rem'
          }} 
        />
      </TableCell>
      <TableCell>
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClick(patient) }}>
          <Visibility />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

const PatientList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 12
  
  const { data: allPatients, isLoading: loadingAll, error } = useGetPatientsQuery()
  const { data: searchResults, isLoading: loadingSearch } = useSearchPatientsQuery(searchQuery, {
    skip: !searchQuery.trim()
  })
  
  const filteredPatients = searchQuery.trim() ? searchResults : allPatients
  const isLoading = searchQuery.trim() ? loadingSearch : loadingAll
  
  // Client-side pagination
  const totalPages = filteredPatients ? Math.ceil(filteredPatients.length / ITEMS_PER_PAGE) : 1
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const patients = filteredPatients?.slice(startIndex, endIndex)

  const handlePatientClick = (patient: PatientData) => {
    navigate(`/patients/${patient.id}`)
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setPage(1) // Reset to first page when searching
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load patients. Please try again.</Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Patient Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and monitor all CKD patients in your care
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowRegistrationForm(true)}
            sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
          >
            Add New Patient
          </Button>
        </Box>
        
        {/* Search and Controls */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search patients by name, email, or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300, flex: 1, maxWidth: 500 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <GridView />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <ViewList />
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total Patients: <strong>{filteredPatients?.length || 0}</strong>
          </Typography>
          {searchQuery && (
            <Typography variant="body2" color="text.secondary">
              Search Results: <strong>{filteredPatients?.length || 0}</strong>
            </Typography>
          )}
          {!searchQuery && totalPages > 1 && (
            <Typography variant="body2" color="text.secondary">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPatients?.length || 0)} of {filteredPatients?.length || 0}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading patients...</Typography>
        </Box>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === 'grid' && (
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
      )}

      {/* Table View */}
      {!isLoading && viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients?.map(patient => (
                <PatientTableRow
                  key={patient.id}
                  patient={patient}
                  onClick={handlePatientClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Empty State */}
      {!isLoading && patients?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {searchQuery ? 'No patients found matching your search' : 'No patients available'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery 
              ? 'Try adjusting your search terms or clear the search to see all patients'
              : 'Get started by adding your first patient to the system'
            }
          </Typography>
          {!searchQuery && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowRegistrationForm(true)}
              sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}
            >
              Add Your First Patient
            </Button>
          )}
        </Box>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
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