import { useEffect, useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { codesApi } from '../../api/codes';
import type { CodeUpdateDto } from '../../types/codes';

export default function CodesEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const codeId = parseInt(id || '0');
  const [, setSelectedCodeType] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CodeUpdateDto>();

  const codeType = watch('codeType');

  // Fetch code
  const { data: code, isLoading } = useQuery({
    queryKey: ['code', codeId],
    queryFn: () => codesApi.getById(codeId),
    enabled: codeId > 0,
  });

  // Fetch species for parent dropdown
  const { data: species } = useQuery({
    queryKey: ['codes-species'],
    queryFn: async () => {
      const codes = await codesApi.getAll();
      return codes.filter(c => c.codeType === 'Species');
    },
    enabled: codeType === 'Breed',
  });

  const updateMutation = useMutation({
    mutationFn: (data: CodeUpdateDto) => codesApi.update(codeId, data),
    onSuccess: () => {
      navigate('/codes');
    },
  });

  useEffect(() => {
    if (code) {
      reset({
        codeType: code.codeType,
        codeName: code.codeName,
        parentId: code.parentId,
      });
      setSelectedCodeType(code.codeType);
    }
  }, [code, reset]);

  const onSubmit = (data: CodeUpdateDto) => {
    // If not Breed, clear parentId
    if (data.codeType !== 'Breed') {
      data.parentId = undefined;
    }
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!code) {
    return <Alert severity="error">Code not found</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Code
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(updateMutation.error as any)?.response?.data?.message ||
            'Failed to update code. Please try again.'}
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

            {/* Warning if changing code type */}
            {codeType !== code.codeType && (
              <Alert severity="warning">
                Warning: Changing the code type may affect related records!
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