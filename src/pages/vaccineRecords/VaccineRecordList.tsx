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
  LocalHospital as LocalHospitalIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { vaccineRecordsApi } from '../../api/vaccineRecords';
import { petsApi } from '../../api/pets';
import { vaccinesApi } from '../../api/vaccines';
import type { VaccineRecord, VaccineRecordSearchDto } from '../../types/vaccine';

export default function VaccineRecordList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VaccineRecord | null>(null);

  // Active search - null means load all
  const [activeSearch, setActiveSearch] = useState<VaccineRecordSearchDto | null>(null);

  // Form states
  const [searchForm, setSearchForm] = useState<VaccineRecordSearchDto>({
    petId: undefined,
    vaccineId: undefined,
  });

  const { data: pets } = useQuery({ queryKey: ['pets'], queryFn: petsApi.getAll });
  const { data: vaccines } = useQuery({ queryKey: ['vaccines'], queryFn: vaccinesApi.getAll });

  const { data: records, isLoading, error } = useQuery({
    queryKey: ['vaccine-records', activeSearch],
    queryFn: async () => {
      // If activeSearch is null OR has no criteria, use getAll
      if (!activeSearch || 
          (!activeSearch.petId && !activeSearch.vaccineId && !activeSearch.id && 
           !activeSearch.veterinarianId && !activeSearch.vaccineStockId)) {
        console.log('Loading all records with getAll()');
        return await vaccineRecordsApi.getAll();
      }
      
      // Otherwise use search
      console.log('Searching with criteria:', activeSearch);
      return await vaccineRecordsApi.search(activeSearch);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: vaccineRecordsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccine-records'] });
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
    },
  });

  const handleDelete = (record: VaccineRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRecord) deleteMutation.mutate(selectedRecord.id);
  };

  const handleSearch = () => {
    // Only set activeSearch if there are actual criteria
    const hasCriteria = searchForm.petId || searchForm.vaccineId;
    setActiveSearch(hasCriteria ? { ...searchForm } : null);
  };

  const handleClearSearch = () => {
    const emptySearch: VaccineRecordSearchDto = {
      petId: undefined,
      vaccineId: undefined,
    };
    setSearchForm(emptySearch);
    setActiveSearch(null); // This will trigger getAll()
  };

  const isDue = (date?: string) => {
    if (!date) return false;
    const d = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return d >= 0 && d <= 7;
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load records: {String(error)}</Alert>;
  }

  console.log('Records loaded:', records);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Vaccine Records</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/vaccine-records/create')}
        >
          Add Record
        </Button>
      </Box>

      {/* Search Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Search Filters</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Pet</InputLabel>
              <Select
                value={searchForm.petId || ''}
                onChange={(e) => setSearchForm(prev => ({ 
                  ...prev, 
                  petId: e.target.value ? Number(e.target.value) : undefined 
                }))}
                label="Pet"
              >
                <MenuItem value="">All Pets</MenuItem>
                {pets?.map((pet) => (
                  <MenuItem key={pet.id} value={pet.id}>
                    {pet.name} {pet.owner ? `(${pet.owner.firstName} ${pet.owner.lastName})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Vaccine</InputLabel>
              <Select
                value={searchForm.vaccineId || ''}
                onChange={(e) => setSearchForm(prev => ({ 
                  ...prev, 
                  vaccineId: e.target.value ? Number(e.target.value) : undefined 
                }))}
                label="Vaccine"
              >
                <MenuItem value="">All Vaccines</MenuItem>
                {vaccines?.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                <TableCell>Pet</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Vaccine</TableCell>
                <TableCell>Veterinarian</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Box py={4} textAlign="center">
                      <LocalHospitalIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography color="text.secondary">No records found.</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                records?.map((record) => {
                  console.log('Record:', record.id, 'Pet:', record.pet, 'Owner:', record.pet?.owner);
                  return (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.id}</TableCell>
                      <TableCell>{record.pet?.name || '-'}</TableCell>
                      <TableCell>
                        {record.pet?.owner 
                          ? `${record.pet.owner.firstName} ${record.pet.owner.lastName}` 
                          : '-'}
                      </TableCell>
                      <TableCell>{record.vaccine?.name || '-'}</TableCell>
                      <TableCell>
                        {record.veterinarian 
                          ? `${record.veterinarian.firstName} ${record.veterinarian.lastName}` 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(record.vaccinationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {record.nextDueDate 
                          ? new Date(record.nextDueDate).toLocaleDateString() 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {record.nextDueDate ? (
                          isOverdue(record.nextDueDate) 
                            ? <Chip label="Overdue" color="error" size="small" /> 
                            : isDue(record.nextDueDate) 
                            ? <Chip label="Due Soon" color="warning" size="small" /> 
                            : <Chip label="Up to Date" color="success" size="small" />
                        ) : (
                          <Chip label="No Follow-up" color="default" size="small" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/vaccine-records/edit/${record.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(record)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this vaccine record?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}