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
import { ownersApi } from '../../api/owners';
import type { OwnerUpdateDto } from '../../types/owner';

export default function OwnerEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const ownerId = parseInt(id || '0');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OwnerUpdateDto>();

  // Fetch owner
  const { data: owner, isLoading } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownersApi.getById(ownerId),
    enabled: ownerId > 0,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: OwnerUpdateDto) => ownersApi.update(ownerId, data),
    onSuccess: () => {
      navigate('/owners');
    },
  });

  // Set form values when owner data loads
  useEffect(() => {
    if (owner) {
      reset({
        firstName: owner.firstName,
        lastName: owner.lastName,
        tcKimlikNo: owner.tcKimlikNo,
        address: owner.address,
        phoneNumber: owner.phoneNumber,
        emergencyPerson: owner.emergencyPerson || '',
        emergencyPhone: owner.emergencyPhone || '',
        version: owner.version,
      });
    }
  }, [owner, reset]);

  const onSubmit = (data: OwnerUpdateDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!owner) {
    return <Alert severity="error">Owner not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Owner
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update owner. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Box ve Flexbox kullanıyoruz */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* First Name */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Box>

            {/* Last Name */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="lastName"
                control={control}
                rules={{
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Box>

            {/* TC Kimlik No */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="tcKimlikNo"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{11}$/,
                    message: 'TC Kimlik No must be 11 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="TC Kimlik No"
                    fullWidth
                    error={!!errors.tcKimlikNo}
                    helperText={errors.tcKimlikNo?.message}
                    inputProps={{ maxLength: 11 }}
                  />
                )}
              />
            </Box>

            {/* Phone Number */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Phone must be 10-11 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </Box>

            {/* Address */}
            <Box sx={{ width: '100%' }}>
              <Controller
                name="address"
                control={control}
                rules={{
                  minLength: { value: 10, message: 'Minimum 10 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Box>

            {/* Emergency Person */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="emergencyPerson"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Contact Person (Optional)"
                    fullWidth
                  />
                )}
              />
            </Box>

            {/* Emergency Phone */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="emergencyPhone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Phone must be 10-11 digits',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Emergency Phone (Optional)"
                    fullWidth
                    error={!!errors.emergencyPhone}
                    helperText={errors.emergencyPhone?.message}
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/owners')}
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