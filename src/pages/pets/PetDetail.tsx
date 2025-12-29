import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Pets as PetsIcon,
  LocalHospital as VaccineIcon,
} from '@mui/icons-material';
import { petsApi } from '../../api/pets';
import { vaccineRecordsApi } from '../../api/vaccineRecords';

export default function PetDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const petId = parseInt(id || '0');

  // Fetch pet
  const { data: pet, isLoading: petLoading, error: petError } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petsApi.getById(petId),
    enabled: petId > 0,
  });

  // Fetch pet's vaccine records
  const { data: allRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['vaccine-records'],
    queryFn: vaccineRecordsApi.getAll,
  });

  // Filter records for this pet
  const vaccineRecords = allRecords?.filter(r => r.petId === petId) || [];

  if (petLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (petError || !pet) {
    return <Alert severity="error">Pet not found</Alert>;
  }

  const getGenderLabel = (gender: number) => {
    return gender === 1 ? 'Female' : 'Male';
  };

  const getGenderColor = (gender: number) => {
    return gender === 1 ? 'secondary' : 'primary';
  };

  const isDue = (nextDueDate?: string) => {
    if (!nextDueDate) return false;
    const daysUntilDue = Math.floor(
      (new Date(nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  };

  const isOverdue = (nextDueDate?: string) => {
    if (!nextDueDate) return false;
    return new Date(nextDueDate) < new Date();
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/pets')}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: getGenderColor(pet.gender) === 'secondary' ? '#dc004e' : '#1976d2' }}>
            <PetsIcon />
          </Avatar>
          <Box>
            <Typography variant="h4">{pet.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {pet.species?.codeName} - {pet.breed?.codeName}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/pets/edit/${petId}`)}
        >
          Edit Pet
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Pet Information */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pet Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">{pet.name}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Species & Breed
                </Typography>
                <Typography variant="body1">
                  {pet.species?.codeName} - {pet.breed?.codeName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Gender
                </Typography>
                <Box>
                  <Chip
                    label={getGenderLabel(pet.gender)}
                    color={getGenderColor(pet.gender)}
                    size="small"
                  />
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Microchip Number
                </Typography>
                <Typography variant="body1">{pet.microchipNumber}</Typography>
              </Box>

              {pet.petPassportNumber && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pet Passport Number
                  </Typography>
                  <Typography variant="body1">{pet.petPassportNumber}</Typography>
                </Box>
              )}

              {pet.color && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Color
                  </Typography>
                  <Typography variant="body1">{pet.color}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Owner Information */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PersonIcon />
              <Typography variant="h6">Owner Information</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {pet.owner ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Owner Name
                  </Typography>
                  <Typography variant="body1">
                    {pet.owner.firstName} {pet.owner.lastName}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/owners/${pet.ownerId}`)}
                >
                  View Owner Details
                </Button>
              </Box>
            ) : (
              <Alert severity="warning">No owner information</Alert>
            )}
          </Paper>
        </Grid>

        {/* Vaccine History */}
        {/* item yerine size */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <VaccineIcon />
                <Typography variant="h6">
                  Vaccine History ({vaccineRecords.length})
                </Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => navigate('/vaccine-records/create')}
                size="small"
              >
                Add Vaccine Record
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {recordsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : vaccineRecords.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vaccine</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Veterinarian</TableCell>
                      <TableCell>Next Due</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vaccineRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          <strong>{record.vaccine?.name || '-'}</strong>
                        </TableCell>
                        <TableCell>
                          {new Date(record.vaccinationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.veterinarian
                            ? `${record.veterinarian.firstName} ${record.veterinarian.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.nextDueDate
                            ? new Date(record.nextDueDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {record.nextDueDate ? (
                            isOverdue(record.nextDueDate) ? (
                              <Chip label="Overdue" color="error" size="small" />
                            ) : isDue(record.nextDueDate) ? (
                              <Chip label="Due Soon" color="warning" size="small" />
                            ) : (
                              <Chip label="Up to Date" color="success" size="small" />
                            )
                          ) : (
                            <Chip label="No Follow-up" color="default" size="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                No vaccine records yet. Click "Add Vaccine Record" to add one.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}