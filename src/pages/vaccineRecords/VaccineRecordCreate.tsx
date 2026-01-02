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
import { vaccineRecordsApi } from '../../api/vaccineRecords';
import { petsApi } from '../../api/pets';
import { vaccinesApi } from '../../api/vaccines';
import { vaccineStocksApi } from '../../api/vaccineStocks';
import { veterinariansApi } from '../../api/veterinarians';
import type { VaccineRecordCreateDto } from '../../types/vaccine';


export default function VaccineRecordCreate() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccineRecordCreateDto>({
    defaultValues: {
      petId: 0,
      vaccineId: 0,
      veterinarianId: '',
      vaccineStockId: 0,
      vaccinationDate: new Date().toISOString().split('T')[0],
      nextDueDate: '',
    },
  });

  // Fetch data for dropdowns
  const { data: pets } = useQuery({
    queryKey: ['pets'],
    queryFn: petsApi.getAll,
  });

  const { data: vaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  const { data: vaccineStocks } = useQuery({
    queryKey: ['vaccine-stocks'],
    queryFn: vaccineStocksApi.getAll,
  });

  const { data: veterinarians } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: veterinariansApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: vaccineRecordsApi.create,
    onSuccess: () => {
      navigate('/vaccine-records');
    },
  });

  const onSubmit = (data: VaccineRecordCreateDto) => {
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Vaccine Record
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create vaccine record. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Pet */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="petId"
                control={control}
                rules={{
                  required: 'Pet is required',
                  min: { value: 1, message: 'Please select a pet' },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.petId}>
                    <InputLabel>Pet</InputLabel>
                    <Select {...field} label="Pet">
                      <MenuItem value={0}>-- Select Pet --</MenuItem>
                      {pets && pets.length > 0 ? (
                        pets.map((pet) => (
                          <MenuItem key={pet.id} value={pet.id}>
                            {pet.name}
                            {pet.owner && ` (${pet.owner.firstName} ${pet.owner.lastName})`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0} disabled>
                          No pets available
                        </MenuItem>
                      )}
                    </Select>
                    {errors.petId && (
                      <FormHelperText>{errors.petId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

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
                      {vaccines && vaccines.length > 0 ? (
                        vaccines.map((vaccine) => (
                          <MenuItem key={vaccine.id} value={vaccine.id}>
                            {vaccine.name} - {vaccine.manufacturer}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0} disabled>
                          No vaccines available
                        </MenuItem>
                      )}
                    </Select>
                    {errors.vaccineId && (
                      <FormHelperText>{errors.vaccineId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Veterinarian */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="veterinarianId"
                control={control}
                rules={{ required: 'Veterinarian is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.veterinarianId}>
                    <InputLabel>Veterinarian</InputLabel>
                    <Select {...field} label="Veterinarian">
                      <MenuItem value="">-- Select Veterinarian --</MenuItem>
                      {veterinarians && veterinarians.length > 0 ? (
                        veterinarians.map((vet: any) => (
                          <MenuItem key={vet.id} value={vet.id}>
                            {vet.firstName} {vet.lastName}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No veterinarians available
                        </MenuItem>
                      )}
                    </Select>
                    {errors.veterinarianId && (
                      <FormHelperText>{errors.veterinarianId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Vaccine Stock */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccineStockId"
                control={control}
                rules={{
                  required: 'Vaccine stock is required',
                  min: { value: 1, message: 'Please select a vaccine stock' },
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.vaccineStockId}>
                    <InputLabel>Vaccine Stock</InputLabel>
                    <Select {...field} label="Vaccine Stock">
                      <MenuItem value={0}>-- Select Vaccine Stock --</MenuItem>
                      {vaccineStocks && vaccineStocks.length > 0 ? (
                        vaccineStocks.map((stock) => (
                          <MenuItem key={stock.id} value={stock.id}>
                            {stock.vaccine?.name || 'Unknown'} - Serial: {stock.serialId} (Qty: {stock.quantity})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={0} disabled>
                          No vaccine stocks available
                        </MenuItem>
                      )}
                    </Select>
                    {errors.vaccineStockId && (
                      <FormHelperText>{errors.vaccineStockId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Vaccination Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccinationDate"
                control={control}
                rules={{ required: 'Vaccination date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vaccination Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.vaccinationDate}
                    helperText={errors.vaccinationDate?.message}
                  />
                )}
              />
            </Box>

            {/* Next Due Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="nextDueDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Next Due Date (Optional)"
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
                onClick={() => navigate('/vaccine-records')}
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