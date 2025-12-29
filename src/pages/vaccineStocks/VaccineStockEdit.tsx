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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { vaccineStocksApi } from '../../api/vaccineStocks';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineStockUpdateDto } from '../../types/vaccine';

export default function VaccineStockEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const stockId = parseInt(id || '0');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VaccineStockUpdateDto>();

  const { data: stock, isLoading } = useQuery({
    queryKey: ['vaccine-stock', stockId],
    queryFn: () => vaccineStocksApi.getById(stockId),
    enabled: stockId > 0,
  });

  const { data: vaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: (data: VaccineStockUpdateDto) => vaccineStocksApi.update(stockId, data),
    onSuccess: () => {
      navigate('/vaccine-stocks');
    },
  });

  useEffect(() => {
    if (stock) {
      reset({
        vaccineId: stock.vaccineId,
        stockDate: stock.stockDate.split('T')[0],
        serialId: stock.serialId,
        quantity: stock.quantity,
        unitPrice: stock.unitPrice,
        expirationDate: stock.expirationDate.split('T')[0],
        version: stock.version,
      });
    }
  }, [stock, reset]);

  const onSubmit = (data: VaccineStockUpdateDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!stock) {
    return <Alert severity="error">Vaccine stock not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Vaccine Stock
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update vaccine stock. Please try again.'}
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
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Vaccine</InputLabel>
                    <Select {...field} label="Vaccine">
                      {vaccines?.map((vaccine) => (
                        <MenuItem key={vaccine.id} value={vaccine.id}>
                          {vaccine.name} - {vaccine.manufacturer}
                        </MenuItem>
                      ))}
                    </Select>
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Stock Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Box>

            {/* Expiration Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiration Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
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