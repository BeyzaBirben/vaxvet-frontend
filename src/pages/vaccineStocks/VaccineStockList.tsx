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
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { vaccineStocksApi } from '../../api/vaccineStocks';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineStock, VaccineStockSearchDto } from '../../types/vaccine';

export default function VaccineStockList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<VaccineStock | null>(null);

  // Search states - Active search that triggers the query
  const [activeSearch, setActiveSearch] = useState<VaccineStockSearchDto>({
    vaccineId: undefined,
    serialId: '',
    stockDate: undefined,
    expirationDate: undefined,
  });

  // Form states - What user is typing
  const [searchForm, setSearchForm] = useState<VaccineStockSearchDto>({
    vaccineId: undefined,
    serialId: '',
    stockDate: undefined,
    expirationDate: undefined,
  });

  // Fetch vaccines for filter
  const { data: vaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  // Fetch stocks with search - only depends on activeSearch
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ['vaccine-stocks', activeSearch],
    queryFn: async () => {
      const hasSearchCriteria = 
        (activeSearch.vaccineId && activeSearch.vaccineId > 0) ||
        (activeSearch.serialId && activeSearch.serialId.trim() !== '') ||
        activeSearch.stockDate ||
        activeSearch.expirationDate;

      if (hasSearchCriteria) {
        return await vaccineStocksApi.search(activeSearch);
      }
      return await vaccineStocksApi.getAll();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vaccineStocksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-stocks'] });
      setDeleteDialogOpen(false);
      setSelectedStock(null);
    },
  });

  const handleDelete = (stock: VaccineStock) => {
    setSelectedStock(stock);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStock) {
      deleteMutation.mutate(selectedStock.id);
    }
  };

  const handleSearch = () => {
    // Copy form values to active search to trigger query
    setActiveSearch({ ...searchForm });
  };

  const handleClearSearch = () => {
    const emptySearch: VaccineStockSearchDto = {
      vaccineId: undefined,
      serialId: '',
      stockDate: undefined,
      expirationDate: undefined,
    };
    setSearchForm(emptySearch);
    setActiveSearch(emptySearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  const isExpiringSoon = (expirationDate: string) => {
    const daysUntilExpiry = Math.floor(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load vaccine stocks. Please try again later.</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Vaccine Stocks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vaccine-stocks/create')}
        >
          Add Stock
        </Button>
      </Box>

      {/* Search Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Filters
        </Typography>
        <Grid container spacing={2}>
          {/* Vaccine */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Vaccine</InputLabel>
              <Select
                value={searchForm.vaccineId || ''}
                onChange={(e) => setSearchForm(prev => ({ 
                  ...prev, 
                  vaccineId: e.target.value as number || undefined 
                }))}
                label="Vaccine"
              >
                <MenuItem value="">All Vaccines</MenuItem>
                {vaccines?.map((vaccine) => (
                  <MenuItem key={vaccine.id} value={vaccine.id}>
                    {vaccine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Serial ID */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Serial ID"
              value={searchForm.serialId || ''}
              onChange={(e) => setSearchForm(prev => ({ 
                ...prev, 
                serialId: e.target.value 
              }))}
              onKeyPress={handleKeyPress}
            />
          </Grid>

          {/* Stock Date */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Stock Date"
              type="date"
              value={searchForm.stockDate || ''}
              onChange={(e) => setSearchForm(prev => ({ 
                ...prev, 
                stockDate: e.target.value || undefined 
              }))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Expiration Date */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Expiration Date"
              type="date"
              value={searchForm.expirationDate || ''}
              onChange={(e) => setSearchForm(prev => ({ 
                ...prev, 
                expirationDate: e.target.value || undefined 
              }))}
              InputLabelProps={{ shrink: true }}
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
                <TableCell>Vaccine</TableCell>
                <TableCell>Serial ID</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Stock Date</TableCell>
                <TableCell>Expiration Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box py={4}>
                      <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No vaccine stocks found.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                stocks?.map((stock) => (
                  <TableRow key={stock.id} hover>
                    <TableCell>{stock.id}</TableCell>
                    <TableCell>{stock.vaccine?.name || '-'}</TableCell>
                    <TableCell>{stock.serialId}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(stock.stockDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(stock.expirationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {isExpired(stock.expirationDate) ? (
                        <Chip label="Expired" color="error" size="small" />
                      ) : isExpiringSoon(stock.expirationDate) ? (
                        <Chip label="Expiring Soon" color="warning" size="small" />
                      ) : (
                        <Chip label="Active" color="success" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/vaccine-stocks/edit/${stock.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(stock)}>
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this vaccine stock with serial{' '}
          <strong>{selectedStock?.serialId}</strong>?
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