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
import { ownersApi } from '../../api/owners';
import type { OwnerCreateDto } from '../../types/owner';

export default function OwnerCreate() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerCreateDto>({
    defaultValues: {
      firstName: '',
      lastName: '',
      tcKimlikNo: '',
      address: '',
      phoneNumber: '',
      emergencyPerson: '',
      emergencyPhone: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: ownersApi.create,
    onSuccess: () => {
      navigate('/owners');
    },
    onError: (error: any) => {
      console.error('Full error:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
    },
  });

  const onSubmit = (data: OwnerCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Owner
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create owner. Please try again.'}
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
                  required: 'First name is required',
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
                  required: 'Last name is required',
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
                  required: 'TC Kimlik No is required',
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
                  required: 'Phone number is required',
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
                    placeholder="05XXXXXXXXX"
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
                  required: 'Address is required',
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