import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { petsApi } from '../../api/pets';
import { ownersApi } from '../../api/owners';
import { codesApi } from '../../api/codes';
import type { PetUpdateDto } from '../../types/pet';

export default function PetEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const petId = parseInt(id || '0');
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PetUpdateDto>();

  const watchSpecies = watch('speciesId');

  useEffect(() => {
    if (watchSpecies && watchSpecies !== selectedSpecies) {
      setSelectedSpecies(watchSpecies);
    }
  }, [watchSpecies, selectedSpecies]);

  // Fetch pet
  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petsApi.getById(petId),
    enabled: petId > 0,
  });

  // Fetch owners
  const { data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: ownersApi.getAll,
  });

  // Fetch species options
  const { data: speciesOptions } = useQuery({
    queryKey: ['species-options'],
    queryFn: codesApi.getSpeciesOptions,
  });

  // Fetch breeds
  const { data: breeds } = useQuery({
    queryKey: ['breeds', selectedSpecies],
    queryFn: () => codesApi.getBreedsBySpecies(selectedSpecies!),
    enabled: !!selectedSpecies && selectedSpecies > 0,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: PetUpdateDto) => petsApi.update(petId, data),
    onSuccess: () => {
      navigate('/pets');
    },
  });

  useEffect(() => {
    if (pet) {
      reset({
        name: pet.name,
        microchipNumber: pet.microchipNumber,
        petPassportNumber: pet.petPassportNumber || '',
        gender: pet.gender,
        color: pet.color || '',
        speciesId: pet.speciesId,
        breedId: pet.breedId,
        ownerId: pet.ownerId,
        version: pet.version,
      });
      setSelectedSpecies(pet.speciesId);
    }
  }, [pet, reset]);

  const onSubmit = (data: PetUpdateDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!pet) {
    return <Alert severity="error">Pet not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Pet
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update pet. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Pet Name */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pet Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>

            {/* Microchip Number */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="microchipNumber"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{15}$/,
                    message: 'Microchip must be 15 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Microchip Number"
                    fullWidth
                    error={!!errors.microchipNumber}
                    helperText={errors.microchipNumber?.message}
                    inputProps={{ maxLength: 15 }}
                  />
                )}
              />
            </Box>

            {/* Pet Passport Number */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="petPassportNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Pet Passport Number (Optional)"
                    fullWidth
                  />
                )}
              />
            </Box>

            {/* Gender */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value={1}>Female</MenuItem>
                      <MenuItem value={2}>Male</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Owner */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="ownerId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Owner</InputLabel>
                    <Select {...field} label="Owner">
                      {owners?.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                          {owner.firstName} {owner.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Species */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="speciesId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Species</InputLabel>
                    <Select {...field} label="Species">
                      {speciesOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Breed */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="breedId"
                control={control}
                render={({ field }) => (
                  <FormControl 
                    fullWidth
                    disabled={!selectedSpecies || selectedSpecies === 0}
                  >
                    <InputLabel>Breed</InputLabel>
                    <Select {...field} label="Breed">
                      {breeds?.map((breed) => (
                        <MenuItem key={breed.id} value={breed.id}>
                          {breed.codeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {!selectedSpecies && (
                      <FormHelperText>Select a species first</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Color */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Color (Optional)"
                    fullWidth
                    inputProps={{ maxLength: 30 }}
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/pets')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}