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
  TextField,
  InputAdornment,
  Grid, 
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { ownersApi } from '../../api/owners';
import type { Owner, OwnerSearchDto } from '../../types/owner';

export default function OwnerList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  
  // Search states
  const [searchCriteria, setSearchCriteria] = useState<OwnerSearchDto>({
    firstName: '',
    lastName: '',
    tcKimlikNo: '',
    phoneNumber: '',
  });
  
  // Active search (only updated when Search button is clicked)
  const [activeSearch, setActiveSearch] = useState<OwnerSearchDto>({
    firstName: '',
    lastName: '',
    tcKimlikNo: '',
    phoneNumber: '',
  });

  // Fetch owners with search
  const { data: owners, isLoading, error } = useQuery({
    queryKey: ['owners', activeSearch],
    queryFn: async () => {
      // If any search field is filled, use search endpoint
      if (Object.values(activeSearch).some(val => val && val.trim() !== '')) {
        return await ownersApi.search(activeSearch);
      }
      // Otherwise get all
      return await ownersApi.getAll();
    },
  });

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

  const handleSearch = () => {
    setActiveSearch({ ...searchCriteria });
  };

  const handleClearSearch = () => {
    const emptySearch = {
      firstName: '',
      lastName: '',
      tcKimlikNo: '',
      phoneNumber: '',
    };
    setSearchCriteria(emptySearch);
    setActiveSearch(emptySearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
        <Typography variant="h4">Owners</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/owners/create')}
        >
          Add Owner
        </Button>
      </Box>

      {/* Search Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          {/* First Name */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="First Name"
              value={searchCriteria.firstName}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, firstName: e.target.value }))}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Last Name */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Last Name"
              value={searchCriteria.lastName}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, lastName: e.target.value }))}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* TC Kimlik */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="TC Kimlik No"
              value={searchCriteria.tcKimlikNo}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, tcKimlikNo: e.target.value }))}
              onKeyPress={handleKeyPress}
              inputProps={{ maxLength: 11 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          {/* Phone Number */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={searchCriteria.phoneNumber}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, phoneNumber: e.target.value }))}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        </Box>
      </Paper>

      {/* Results */}
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
                      No owners found. {Object.values(activeSearch).some(v => v) ? 'Try different search criteria.' : 'Click "Add Owner" to create one.'}
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
                        color="info"
                        onClick={() => navigate(`/owners/${owner.id}`)}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/owners/edit/${owner.id}`)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(owner)}
                        size="small"
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