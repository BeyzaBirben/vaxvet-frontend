import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
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
import type { PetCreateDto,  } from '../../types/pet';

export default function PetCreate() {
  const navigate = useNavigate();
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PetCreateDto>({
    defaultValues: {
      name: '',
      microchipNumber: '',
      petPassportNumber: '',
      gender: 1,
      color: '',
      speciesId: 0,
      breedId: 0,
      ownerId: 0,
    },
  });

  // Watch species changes
  const watchSpecies = watch('speciesId');

  useEffect(() => {
    if (watchSpecies && watchSpecies !== selectedSpecies) {
      setSelectedSpecies(watchSpecies);
      setValue('breedId', 0); // Reset breed when species changes
    }
  }, [watchSpecies, selectedSpecies, setValue]);

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

  // Fetch breeds based on selected species
  const { data: breeds } = useQuery({
    queryKey: ['breeds', selectedSpecies],
    queryFn: () => codesApi.getBreedsBySpecies(selectedSpecies!),
    enabled: !!selectedSpecies && selectedSpecies > 0,
  });

  const createMutation = useMutation({
    mutationFn: petsApi.create,
    onSuccess: () => {
      navigate('/pets');
    },
  });

  const onSubmit = (data: PetCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Pet
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create pet. Please try again.'}
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
                  required: 'Pet name is required',
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
                  required: 'Microchip number is required',
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
                rules={{ required: 'Gender is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.gender}>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value={1}>Female</MenuItem>
                      <MenuItem value={2}>Male</MenuItem>
                    </Select>
                    {errors.gender && (
                      <FormHelperText>{errors.gender.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Owner */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="ownerId"
                control={control}
                rules={{ 
                  required: 'Owner is required',
                  min: { value: 1, message: 'Please select an owner' }
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.ownerId}>
                    <InputLabel>Owner</InputLabel>
                    <Select {...field} label="Owner">
                      <MenuItem value={0}>-- Select Owner --</MenuItem>
                      {owners?.map((owner) => (
                        <MenuItem key={owner.id} value={owner.id}>
                          {owner.firstName} {owner.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.ownerId && (
                      <FormHelperText>{errors.ownerId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Species */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="speciesId"
                control={control}
                rules={{ 
                  required: 'Species is required',
                  min: { value: 1, message: 'Please select a species' }
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.speciesId}>
                    <InputLabel>Species</InputLabel>
                    <Select {...field} label="Species">
                      <MenuItem value={0}>-- Select Species --</MenuItem>
                      {speciesOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.speciesId && (
                      <FormHelperText>{errors.speciesId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Breed */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="breedId"
                control={control}
                rules={{ 
                  required: 'Breed is required',
                  min: { value: 1, message: 'Please select a breed' }
                }}
                render={({ field }) => (
                  <FormControl 
                    fullWidth 
                    error={!!errors.breedId}
                    disabled={!selectedSpecies || selectedSpecies === 0}
                  >
                    <InputLabel>Breed</InputLabel>
                    <Select {...field} label="Breed">
                      <MenuItem value={0}>-- Select Breed --</MenuItem>
                      {breeds?.map((breed) => (
                        <MenuItem key={breed.id} value={breed.id}>
                          {breed.codeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.breedId && (
                      <FormHelperText>{errors.breedId.message}</FormHelperText>
                    )}
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
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}