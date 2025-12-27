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
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { ownersApi } from '../../api/owners';
import type { Owner } from '../../types/owner';

export default function OwnerList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);

  // Fetch owners
  const { data: owners, isLoading, error } = useQuery({
    queryKey: ['owners'],
    queryFn: ownersApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ownersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      setDeleteDialogOpen(false);
      setSelectedOwner(null);
    },
  });

  const handleDelete = (owner: Owner) => {
    setSelectedOwner(owner);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOwner) {
      deleteMutation.mutate(selectedOwner.id);
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
    return (
      <Alert severity="error">
        Failed to load owners. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Owners
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/owners/create')}
        >
          Add Owner
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>TC Kimlik No</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary" py={4}>
                      No owners found. Click "Add Owner" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                owners?.map((owner) => (
                  <TableRow key={owner.id} hover>
                    <TableCell>{owner.id}</TableCell>
                    <TableCell>{owner.firstName}</TableCell>
                    <TableCell>{owner.lastName}</TableCell>
                    <TableCell>{owner.tcKimlikNo}</TableCell>
                    <TableCell>{owner.phoneNumber}</TableCell>
                    <TableCell>
                      {owner.address.length > 30
                        ? `${owner.address.substring(0, 30)}...`
                        : owner.address}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/owners/edit/${owner.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(owner)}
                      >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete owner{' '}
          <strong>
            {selectedOwner?.firstName} {selectedOwner?.lastName}
          </strong>
          ?
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