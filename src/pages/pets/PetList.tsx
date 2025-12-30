import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pets as PetsIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { petsApi } from '../../api/pets';
import { ownersApi } from '../../api/owners';
import { codesApi } from '../../api/codes';
import type { Pet, PetSearchDto } from '../../types/pet';

export default function PetList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Search states
  const [searchCriteria, setSearchCriteria] = useState<PetSearchDto>({
    name: '',
    ownerId: undefined,
    speciesId: undefined,
    breedId: undefined,
    microchipNumber: '',
  });

  // Active search
  const [activeSearch, setActiveSearch] = useState<PetSearchDto>({
    name: '',
    ownerId: undefined,
    speciesId: undefined,
    breedId: undefined,
    microchipNumber: '',
  });

  // Fetch data for filters
  const { data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: ownersApi.getAll,
  });

  const { data: speciesOptions } = useQuery({
    queryKey: ['species-options'],
    queryFn: codesApi.getSpeciesOptions,
  });

  const { data: breeds } = useQuery({
    queryKey: ['breeds', searchCriteria.speciesId],
    queryFn: () => codesApi.getBreedsBySpecies(searchCriteria.speciesId!),
    enabled: !!searchCriteria.speciesId && searchCriteria.speciesId > 0,
  });

  // Fetch pets with search
  const { data: pets, isLoading, error } = useQuery({
    queryKey: ['pets', activeSearch],
    queryFn: async () => {
      // Check if any search criteria is filled
      const hasSearchCriteria = 
        (activeSearch.name && activeSearch.name.trim() !== '') ||
        (activeSearch.ownerId && activeSearch.ownerId > 0) ||
        (activeSearch.speciesId && activeSearch.speciesId > 0) ||
        (activeSearch.breedId && activeSearch.breedId > 0) ||
        (activeSearch.microchipNumber && activeSearch.microchipNumber.trim() !== '');

      if (hasSearchCriteria) {
        return await petsApi.search(activeSearch);
      }
      return await petsApi.getAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: petsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      setDeleteDialogOpen(false);
      setSelectedPet(null);
    },
  });

  const handleDelete = (pet: Pet) => {
    setSelectedPet(pet);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPet) {
      deleteMutation.mutate(selectedPet.id);
    }
  };

  const handleSearch = () => {
    setActiveSearch({ ...searchCriteria });
  };

  const handleClearSearch = () => {
    const emptySearch: PetSearchDto = {
      name: '',
      ownerId: undefined,
      speciesId: undefined,
      breedId: undefined,
      microchipNumber: '',
    };
    setSearchCriteria(emptySearch);
    setActiveSearch(emptySearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getGenderLabel = (gender: number) => {
    return gender === 1 ? 'Female' : 'Male';
  };

  const getGenderColor = (gender: number) => {
    return gender === 1 ? 'secondary' : 'primary';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load pets. Please try again later.</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Pets</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/pets/create')}
        >
          Add Pet
        </Button>
      </Box>

      {/* Search Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          {/* Pet Name */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Pet Name"
              value={searchCriteria.name}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Owner */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Owner</InputLabel>
              <Select
                value={searchCriteria.ownerId || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, ownerId: e.target.value as number || undefined }))}
                label="Owner"
              >
                <MenuItem value="">All Owners</MenuItem>
                {owners?.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.firstName} {owner.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Species */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Species</InputLabel>
              <Select
                value={searchCriteria.speciesId || ''}
                onChange={(e) => setSearchCriteria(prev => ({ 
                  ...prev, 
                  speciesId: e.target.value as number || undefined,
                  breedId: undefined // Reset breed when species changes
                }))}
                label="Species"
              >
                <MenuItem value="">All Species</MenuItem>
                {speciesOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Breed */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth disabled={!searchCriteria.speciesId}>
              <InputLabel>Breed</InputLabel>
              <Select
                value={searchCriteria.breedId || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, breedId: e.target.value as number || undefined }))}
                label="Breed"
              >
                <MenuItem value="">All Breeds</MenuItem>
                {breeds?.map((breed) => (
                  <MenuItem key={breed.id} value={breed.id}>
                    {breed.codeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Microchip */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Microchip Number"
              value={searchCriteria.microchipNumber}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, microchipNumber: e.target.value }))}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* Results */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Microchip</TableCell>
                <TableCell>Species</TableCell>
                <TableCell>Breed</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pets?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box py={4}>
                      <PetsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No pets found. Try different search criteria.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                pets?.map((pet) => (
                  <TableRow key={pet.id} hover>
                    <TableCell>{pet.id}</TableCell>
                    <TableCell>{pet.name}</TableCell>
                    <TableCell>{pet.microchipNumber}</TableCell>
                    <TableCell>{pet.species?.codeName || '-'}</TableCell>
                    <TableCell>{pet.breed?.codeName || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getGenderLabel(pet.gender)}
                        color={getGenderColor(pet.gender)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {pet.owner
                        ? `${pet.owner.firstName} ${pet.owner.lastName}`
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="info"
                        onClick={() => navigate(`/pets/${pet.id}`)}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/pets/edit/${pet.id}`)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDelete(pet)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete pet <strong>{selectedPet?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}