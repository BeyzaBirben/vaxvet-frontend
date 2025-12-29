import { useEffect } from 'react';
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
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineUpdateDto } from '../../types/vaccine';

export default function VaccineEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const vaccineId = parseInt(id || '0');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VaccineUpdateDto>();

  const { data: vaccine, isLoading } = useQuery({
    queryKey: ['vaccine', vaccineId],
    queryFn: () => vaccinesApi.getById(vaccineId),
    enabled: vaccineId > 0,
  });

  const updateMutation = useMutation({
    mutationFn: (data: VaccineUpdateDto) => vaccinesApi.update(vaccineId, data),
    onSuccess: () => {
      navigate('/vaccines');
    },
  });

  useEffect(() => {
    if (vaccine) {
      reset({
        name: vaccine.name,
        manufacturer: vaccine.manufacturer,
      });
    }
  }, [vaccine, reset]);

  const onSubmit = (data: VaccineUpdateDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!vaccine) {
    return <Alert severity="error">Vaccine not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Vaccine
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update vaccine. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Vaccine Name */}
            <Controller
              name="name"
              control={control}
              rules={{
                minLength: { value: 2, message: 'Minimum 2 characters' },
                maxLength: { value: 255, message: 'Maximum 255 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Vaccine Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  inputProps={{ maxLength: 255 }}
                />
              )}
            />

            {/* Manufacturer */}
            <Controller
              name="manufacturer"
              control={control}
              rules={{
                minLength: { value: 2, message: 'Minimum 2 characters' },
                maxLength: { value: 255, message: 'Maximum 255 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Manufacturer"
                  fullWidth
                  error={!!errors.manufacturer}
                  helperText={errors.manufacturer?.message}
                  inputProps={{ maxLength: 255 }}
                />
              )}
            />

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/vaccines')}
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