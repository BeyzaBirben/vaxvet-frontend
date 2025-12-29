import { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { codesApi } from '../../api/codes';
import type { CodeCreateDto } from '../../types/codes';

export default function CodesCreate() {
  const navigate = useNavigate();
  const [selectedCodeType, setSelectedCodeType] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CodeCreateDto>({
    defaultValues: {
      codeType: '',
      codeName: '',
      parentId: undefined,
    },
  });

  const codeType = watch('codeType');

  // Fetch species for parent dropdown (when creating breeds)
  const { data: species } = useQuery({
    queryKey: ['codes-species'],
    queryFn: async () => {
      const codes = await codesApi.getAll();
      return codes.filter(c => c.codeType === 'Species');
    },
    enabled: codeType === 'Breed',
  });

  const createMutation = useMutation({
    mutationFn: codesApi.create,
    onSuccess: () => {
      navigate('/codes');
    },
  });

  const onSubmit = (data: CodeCreateDto) => {
    // If not Breed, clear parentId
    if (data.codeType !== 'Breed') {
      data.parentId = undefined;
    }
    createMutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Code
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(createMutation.error as any)?.response?.data?.message ||
            'Failed to create code. Please try again.'}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Code Type */}
            <Controller
              name="codeType"
              control={control}
              rules={{ required: 'Code type is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.codeType}>
                  <InputLabel>Code Type</InputLabel>
                  <Select
                    {...field}
                    label="Code Type"
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedCodeType(e.target.value);
                    }}
                  >
                    <MenuItem value="Species">Species</MenuItem>
                    <MenuItem value="Breed">Breed</MenuItem>
                    <MenuItem value="Gender">Gender</MenuItem>
                  </Select>
                  {errors.codeType && (
                    <FormHelperText>{errors.codeType.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Code Name */}
            <Controller
              name="codeName"
              control={control}
              rules={{
                required: 'Code name is required',
                minLength: { value: 2, message: 'Minimum 2 characters' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Code Name"
                  fullWidth
                  error={!!errors.codeName}
                  helperText={errors.codeName?.message}
                />
              )}
            />

            {/* Parent Species (only for Breed) */}
            {codeType === 'Breed' && (
              <Controller
                name="parentId"
                control={control}
                rules={{
                  required: 'Parent species is required for breeds',
                }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.parentId}>
                    <InputLabel>Parent Species</InputLabel>
                    <Select {...field} label="Parent Species">
                      <MenuItem value="">-- Select Species --</MenuItem>
                      {species?.map((sp) => (
                        <MenuItem key={sp.id} value={sp.id}>
                          {sp.codeName}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.parentId && (
                      <FormHelperText>{errors.parentId.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            )}

            {/* Info Messages */}
            {codeType === 'Species' && (
              <Alert severity="info">
                Species codes are used to categorize pets (e.g., Dog, Cat, Bird)
              </Alert>
            )}
            {codeType === 'Breed' && (
              <Alert severity="info">
                Breed codes must have a parent species (e.g., Golden Retriever belongs to Dog)
              </Alert>
            )}
            {codeType === 'Gender' && (
              <Alert severity="info">
                Gender codes are used for pet gender selection (e.g., Male, Female)
              </Alert>
            )}

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate('/codes')}
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