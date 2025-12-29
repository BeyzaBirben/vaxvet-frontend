import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Vaccines as VaccinesIcon,
} from '@mui/icons-material';
import { vaccinesApi } from '../../api/vaccines';
import type { Vaccine } from '../../types/vaccine';

export default function VaccineList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);

  const { data: vaccines, isLoading, error } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: vaccinesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      setDeleteDialogOpen(false);
      setSelectedVaccine(null);
    },
  });

  const handleDelete = (vaccine: Vaccine) => {
    setSelectedVaccine(vaccine);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedVaccine) {
      deleteMutation.mutate(selectedVaccine.id);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load vaccines. Please try again later.</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Vaccines</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vaccines/create')}
        >
          Add Vaccine
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vaccines?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box py={4}>
                      <VaccinesIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No vaccines found. Click "Add Vaccine" to create one.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                vaccines?.map((vaccine) => (
                  <TableRow key={vaccine.id} hover>
                    <TableCell>{vaccine.id}</TableCell>
                    <TableCell>{vaccine.name}</TableCell>
                    <TableCell>{vaccine.manufacturer}</TableCell>
                    <TableCell>
                      {vaccine.createdAt
                        ? new Date(vaccine.createdAt).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/vaccines/edit/${vaccine.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(vaccine)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete vaccine <strong>{selectedVaccine?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}