import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineCreateDto } from '../../types/vaccine';

export default function VaccineCreate() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccineCreateDto>({
    defaultValues: {
      name: '',
      manufacturer: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: vaccinesApi.create,
    onSuccess: () => {
      navigate('/vaccines');
    },
  });

  const onSubmit = (data: VaccineCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Vaccine
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create vaccine. Please try again.'}
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
                required: 'Vaccine name is required',
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
                required: 'Manufacturer is required',
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