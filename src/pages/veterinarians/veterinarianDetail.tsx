import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { veterinariansApi } from '../../api/veterinarians';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';

export default function VeterinarianDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: vet, isLoading, error } = useQuery({
    queryKey: ['veterinarian', id],
    queryFn: () => veterinariansApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <CircularProgress />;
  if (error || !vet) return <Alert severity="error">Veterinarian not found</Alert>;

  return (
    <Box>
      <Button variant="outlined" onClick={() => navigate('/veterinarians')}>
        Back
      </Button>

      <Typography variant="h4" mt={2}>
        {vet.firstName} {vet.lastName}
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography><strong>Username:</strong> {vet.userName}</Typography>
        <Typography><strong>License Number:</strong> {vet.licenseNumber || "Not provided"}</Typography>
        <Typography><strong>ID:</strong> {vet.id}</Typography>
        <Typography><strong>Version:</strong> {vet.version}</Typography>
      </Paper>
    </Box>
  );
}
