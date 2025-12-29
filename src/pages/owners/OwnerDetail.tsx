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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  ContactEmergency as EmergencyIcon,
  Pets as PetsIcon,
} from '@mui/icons-material';
import { ownersApi } from '../../api/owners';
import { petsApi } from '../../api/pets';

export default function OwnerDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ownerId = parseInt(id || '0');

  // Fetch owner
  const { data: owner, isLoading: ownerLoading, error: ownerError } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownersApi.getById(ownerId),
    enabled: ownerId > 0,
  });

  // Fetch owner's pets
  const { data: pets, isLoading: petsLoading } = useQuery({
    queryKey: ['pets-by-owner', ownerId],
    queryFn: () => petsApi.getByOwnerId(ownerId),
    enabled: ownerId > 0,
  });

  if (ownerLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (ownerError || !owner) {
    return <Alert severity="error">Owner not found</Alert>;
  }

  const getGenderLabel = (gender: number) => {
    return gender === 1 ? 'Female' : 'Male';
  };

  const getGenderColor = (gender: number) => {
    return gender === 1 ? 'secondary' : 'primary';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/owners')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {owner.firstName} {owner.lastName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/owners/edit/${ownerId}`)}
        >
          Edit Owner
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Owner Information */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Owner Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {owner.firstName} {owner.lastName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  TC Kimlik No
                </Typography>
                <Typography variant="body1">{owner.tcKimlikNo}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon color="action" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">{owner.phoneNumber}</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="flex-start" gap={1}>
                <HomeIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Address
                  </Typography>
                  <Typography variant="body1">{owner.address}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Emergency Contact */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmergencyIcon color="error" />
                <Typography variant="h6">Emergency Contact</Typography>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {owner.emergencyPerson || owner.emergencyPhone ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {owner.emergencyPerson && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Emergency Person
                    </Typography>
                    <Typography variant="body1">{owner.emergencyPerson}</Typography>
                  </Box>
                )}

                {owner.emergencyPhone && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Emergency Phone
                      </Typography>
                      <Typography variant="body1">{owner.emergencyPhone}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Alert severity="info">No emergency contact information</Alert>
            )}
          </Paper>
        </Grid>

        {/* Owner's Pets */}
        {/*item yerine size */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <PetsIcon />
                <Typography variant="h6">Pets ({pets?.length || 0})</Typography>
              </Box>
              <Button
                variant="outlined"
                onClick={() => navigate('/pets/create')}
                size="small"
              >
                Add Pet
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {petsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : pets && pets.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Species</TableCell>
                      <TableCell>Breed</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Microchip</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet.id} hover>
                        <TableCell>
                          <strong>{pet.name}</strong>
                        </TableCell>
                        <TableCell>{pet.species?.codeName || '-'}</TableCell>
                        <TableCell>{pet.breed?.codeName || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={getGenderLabel(pet.gender)}
                            color={getGenderColor(pet.gender)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{pet.microchipNumber}</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/pets/edit/${pet.id}`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">
                This owner has no pets yet. Click "Add Pet" to register one.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}