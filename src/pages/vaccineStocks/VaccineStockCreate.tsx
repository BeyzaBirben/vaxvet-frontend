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
import { vaccineStocksApi } from '../../api/vaccineStocks';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineStockCreateDto } from '../../types/vaccine';

export default function VaccineStockCreate() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccineStockCreateDto>({
    defaultValues: {
      vaccineId: 0,
      stockDate: new Date().toISOString().split('T')[0],
      serialId: '',
      quantity: 1,
      unitPrice: 0,
      expirationDate: '',
    },
  });

  // Fetch vaccines for dropdown
  const { data: vaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: vaccineStocksApi.create,
    onSuccess: () => {
      navigate('/vaccine-stocks');
    },
  });

  const onSubmit = (data: VaccineStockCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Vaccine Stock
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create vaccine stock. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Vaccine */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccineId"
                control={control}
                rules={{
                  required: 'Vaccine is required',
                  min: { value: 1, message: 'Please select a vaccine' },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vaccineId}>
                    <InputLabel>Vaccine</InputLabel>
                    <Select {...field} label="Vaccine">
                      <MenuItem value={0}>-- Select Vaccine --</MenuItem>
                      {vaccines?.map((vaccine) => (
                        <MenuItem key={vaccine.id} value={vaccine.id}>
                          {vaccine.name} - {vaccine.manufacturer}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.vaccineId && (
                      <FormHelperText>{errors.vaccineId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Serial ID */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="serialId"
                control={control}
                rules={{
                  required: 'Serial ID is required',
                  minLength: { value: 3, message: 'Minimum 3 characters' },
                  maxLength: { value: 255, message: 'Maximum 255 characters' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Serial ID"
                    fullWidth
                    error={!!errors.serialId}
                    helperText={errors.serialId?.message}
                    inputProps={{ maxLength: 255 }}
                  />
                )}
              />
            </Box>

            {/* Quantity */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="quantity"
                control={control}
                rules={{
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Minimum quantity is 1' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                )}
              />
            </Box>

            {/* Unit Price */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="unitPrice"
                control={control}
                rules={{
                  required: 'Unit price is required',
                  min: { value: 0.01, message: 'Minimum price is 0.01' },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Unit Price"
                    type="number"
                    fullWidth
                    error={!!errors.unitPrice}
                    helperText={errors.unitPrice?.message}
                    inputProps={{ step: '0.01' }}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </Box>

            {/* Stock Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="stockDate"
                control={control}
                rules={{ required: 'Stock date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.stockDate}
                    helperText={errors.stockDate?.message}
                  />
                )}
              />
            </Box>

            {/* Expiration Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="expirationDate"
                control={control}
                rules={{ required: 'Expiration date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.expirationDate}
                    helperText={errors.expirationDate?.message}
                  />
                )}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/vaccine-stocks')}
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