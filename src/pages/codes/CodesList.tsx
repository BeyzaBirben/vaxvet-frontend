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
  Category as CategoryIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { codesApi } from '../../api/codes'; 
import type { Code, CodeSearchDto } from '../../types/codes'; 

export default function CodeList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<Code | null>(null);
  
  // Active search that triggers the query
  const [activeSearch, setActiveSearch] = useState<CodeSearchDto>({
    codeType: '',
    codeName: '',
  });

  // Form states - What user is typing
  const [searchForm, setSearchForm] = useState<CodeSearchDto>({
    codeType: '',
    codeName: '',
  });

  // Fetch data - only depends on activeSearch
  const { data: codes, isLoading, error } = useQuery({
    queryKey: ['codes', activeSearch],
    queryFn: async () => {
      const hasSearchCriteria = 
        (activeSearch.codeType && activeSearch.codeType.trim() !== '') ||
        (activeSearch.codeName && activeSearch.codeName.trim() !== '');

      if (hasSearchCriteria) {
        return await codesApi.search(activeSearch);
      }
      return await codesApi.getAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: codesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['codes'] });
      setDeleteDialogOpen(false);
      setSelectedCode(null);
    },
  });

  const handleDelete = (code: Code) => {
    setSelectedCode(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCode) {
      deleteMutation.mutate(selectedCode.id);
    }
  };

  const handleSearch = () => {
    // Copy form values to active search to trigger query
    setActiveSearch({ ...searchForm });
  };

  const handleClearSearch = () => {
    const emptySearch: CodeSearchDto = {
      codeType: '',
      codeName: '',
    };
    setSearchForm(emptySearch);
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
        Failed to load codes. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">System Codes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/codes/create')}
        >
          Add Code
        </Button>
      </Box>

      {/* Search Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Code Type"
              value={searchForm.codeType || ''}
              onChange={(e) => setSearchForm(prev => ({ 
                ...prev, 
                codeType: e.target.value 
              }))}
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
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Code Name"
              value={searchForm.codeName || ''}
              onChange={(e) => setSearchForm(prev => ({ 
                ...prev, 
                codeName: e.target.value 
              }))}
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
          <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              fullWidth
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearSearch}
              fullWidth
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Parent ID</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box py={4}>
                      <CategoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No codes found. {Object.values(activeSearch).some(v => v) ? 'Try different search criteria.' : 'Click "Add Code" to create one.'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                codes?.map((code) => (
                  <TableRow key={code.id} hover>
                    <TableCell>{code.id}</TableCell>
                    <TableCell>{code.codeType}</TableCell>
                    <TableCell>{code.codeName}</TableCell>
                    <TableCell>{code.parentId || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/codes/edit/${code.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(code)}
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
          Are you sure you want to delete code{' '}
          <strong>
            {selectedCode?.codeName}
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