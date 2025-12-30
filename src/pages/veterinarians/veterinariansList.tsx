import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { veterinariansApi } from '../../api/veterinarians';
import type { VeterinarianSearchDto, Veterinarian } from '../../api/veterinarians';

import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Alert,
    Button,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';

import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
} from '@mui/icons-material';

export default function VeterinariansList() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    /* Search Criteria State */
    const [searchCriteria, setSearchCriteria] = useState<VeterinarianSearchDto>({
        userName: '',
        firstName: '',
        lastName: '',
        licenseNumber: '',
    });

    /* Active Search Params */
    const [activeSearch, setActiveSearch] = useState<VeterinarianSearchDto>({
        userName: '',
        firstName: '',
        lastName: '',
        licenseNumber: '',
    });

    /* Fetch Veterinarians List */
    const {
        data: veterinarians,
        isLoading,
        error
    } = useQuery<Veterinarian[]>({
        queryKey: ['veterinarians', activeSearch],
        queryFn: async () => {
            const cleaned = Object.fromEntries(
                Object.entries(activeSearch).filter(([_, v]) => v && v.trim() !== "")
            );
            return Object.keys(cleaned).length > 0
                ? await veterinariansApi.search(cleaned)
                : await veterinariansApi.getAll();
        },
    });

    /* DEACTIVATE */
    const deactivateMutation = useMutation({
        mutationFn: (id: string) => veterinariansApi.deactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["veterinarians"] });
            alert("Veterinarian Deactivated (Account Disabled)");
        },
        onError: (err: any) =>
            alert("Deactivate Error: " + JSON.stringify(err?.response?.data || err))
    });

    /* ACTIVATE */
    const activateMutation = useMutation({
        mutationFn: (id: string) => veterinariansApi.activate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["veterinarians"] });
            alert("Veterinarian Activated");
        },
        onError: (err: any) =>
            alert("Activate Error: " + JSON.stringify(err?.response?.data || err))
    });

    /* Deactivate Button Handler */
    const handleDeactivate = (id: string) => {
        if (window.confirm("Disable this veterinarian account?"))
            deactivateMutation.mutate(id);
    };

    /* Activate Button Handler */
    const handleActivate = (id: string) => {
        if (window.confirm("Activate this veterinarian account?"))
            activateMutation.mutate(id);
    };

    /* Search */
    const handleSearchClick = () => setActiveSearch({ ...searchCriteria });
    const handleClearClick = () => {
        const empty = { userName: '', firstName: '', lastName: '', licenseNumber: '' };
        setSearchCriteria(empty);
        setActiveSearch(empty);
    };
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    /* Loading */
    if (isLoading)
        return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    /* Error */
    if (error)
        return <Alert severity="error" sx={{ mt: 2 }}>Failed to load veterinarians.</Alert>;

    const list = veterinarians || [];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Veterinarians</Typography>

            {/*  SEARCH FILTERS */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Search Filters</Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: "wrap", mb: 2 }}>
                    {["userName", "firstName", "lastName", "licenseNumber"].map((field) => (
                        <TextField
                            key={field}
                            label={field.replace(/^\w/, (c) => c.toUpperCase())}
                            value={(searchCriteria as any)[field] || ''}
                            onChange={(e) =>
                                setSearchCriteria((prev) => ({ ...prev, [field]: e.target.value }))
                            }
                            onKeyPress={handleKeyPress}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start"><SearchIcon /></InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 200 }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearchClick}>
                        Search
                    </Button>
                    <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearClick}>
                        Clear
                    </Button>
                </Box>
            </Paper>

            {/* LIST TABLE */}
            <Paper sx={{ p: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>License</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {list.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No veterinarians found.</TableCell></TableRow>
                        ) : (
                            list.map((vet) => (
                                <TableRow
                                    key={vet.id}
                                    hover
                                    sx={{
                                        backgroundColor: vet.isActive ? "inherit" : "#f5f5f5",
                                        opacity: vet.isActive ? 1 : 0.6
                                    }}
                                >
                                    <TableCell>{vet.userName}</TableCell>
                                    <TableCell>{vet.firstName} {vet.lastName}</TableCell>
                                    <TableCell>{vet.licenseNumber || '-'}</TableCell>
                                    <TableCell>{vet.isActive ? "Active" : "Disabled"}</TableCell>

                                    <TableCell align="right">

                                        <IconButton color="info" size="small"
                                            onClick={() => navigate(`/veterinarians/${vet.id}`)}>
                                            <ViewIcon />
                                        </IconButton>

                                        <IconButton color="primary" size="small"
                                            onClick={() => navigate(`/veterinarians/edit/${vet.id}`)}>
                                            <EditIcon />
                                        </IconButton>

                                        {vet.isActive ? (
                                            <Button color="error" size="small" variant="contained"
                                                onClick={() => handleDeactivate(vet.id)}>
                                                Deactivate
                                            </Button>
                                        ) : (
                                            <Button color="success" size="small" variant="outlined"
                                                onClick={() => handleActivate(vet.id)}>
                                                Activate
                                            </Button>
                                        )}

                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
