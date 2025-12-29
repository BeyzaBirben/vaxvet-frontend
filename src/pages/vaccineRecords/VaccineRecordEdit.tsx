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
import { vaccineRecordsApi } from '../../api/vaccineRecords';
import { petsApi } from '../../api/pets';
import { vaccinesApi } from '../../api/vaccines';
import { vaccineStocksApi } from '../../api/vaccineStocks';
import { veterinariansApi } from '../../api/veterinarians';
import type { VaccineRecordUpdateDto } from '../../types/vaccine';

export default function VaccineRecordEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const recordId = parseInt(id || '0');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VaccineRecordUpdateDto>();

  const { data: record, isLoading } = useQuery({
    queryKey: ['vaccine-record', recordId],
    queryFn: () => vaccineRecordsApi.getById(recordId),
    enabled: recordId > 0,
  });

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

  const updateMutation = useMutation({
    mutationFn: (data: VaccineRecordUpdateDto) => vaccineRecordsApi.update(recordId, data),
    onSuccess: () => {
      navigate('/vaccine-records');
    },
  });

  useEffect(() => {
    if (record) {
      reset({
        petId: record.petId,
        vaccineId: record.vaccineId,
        veterinarianId: record.veterinarianId,
        vaccineStockId: record.vaccineStockId,
        vaccinationDate: record.vaccinationDate.split('T')[0],
        nextDueDate: record.nextDueDate ? record.nextDueDate.split('T')[0] : '',
      });
    }
  }, [record, reset]);

  const onSubmit = (data: VaccineRecordUpdateDto) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return <Alert severity="error">Vaccine record not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Vaccine Record
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update vaccine record. Please try again.'}
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
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Pet</InputLabel>
                    <Select {...field} label="Pet">
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
                  </FormControl>
                )}
              />
            </Box>

            {/* Vaccine */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccineId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Vaccine</InputLabel>
                    <Select {...field} label="Vaccine">
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
                  </FormControl>
                )}
              />
            </Box>

            {/* Veterinarian */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="veterinarianId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Veterinarian</InputLabel>
                    <Select {...field} label="Veterinarian">
                      {veterinarians && veterinarians.length > 0 ? (
                        veterinarians.map((vet) => (
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
                  </FormControl>
                )}
              />
            </Box>

            {/* Vaccine Stock */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccineStockId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Vaccine Stock</InputLabel>
                    <Select {...field} label="Vaccine Stock">
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
                  </FormControl>
                )}
              />
            </Box>

            {/* Vaccination Date */}
            <Box sx={{ width: { xs: '100%', sm: '48%' }, flexGrow: 1 }}>
              <Controller
                name="vaccinationDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Vaccination Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
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