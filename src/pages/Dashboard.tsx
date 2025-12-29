import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People as PeopleIcon,
  Pets as PetsIcon,
  Vaccines as VaccinesIcon,
  LocalHospital as LocalHospitalIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { ownersApi } from '../api/owners';
import { petsApi } from '../api/pets';
import { vaccinesApi } from '../api/vaccines';
import { vaccineRecordsApi } from '../api/vaccineRecords';
import { vaccineStocksApi } from '../api/vaccineStocks';

export default function Dashboard() {
  const navigate = useNavigate();

  // Fetch all data
  const { data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: ownersApi.getAll,
  });

  const { data: pets } = useQuery({
    queryKey: ['pets'],
    queryFn: petsApi.getAll,
  });

  const { data: vaccines } = useQuery({
    queryKey: ['vaccines'],
    queryFn: vaccinesApi.getAll,
  });

  const { data: records } = useQuery({
    queryKey: ['vaccine-records'],
    queryFn: vaccineRecordsApi.getAll,
  });

  const { data: stocks } = useQuery({
    queryKey: ['vaccine-stocks'],
    queryFn: vaccineStocksApi.getAll,
  });

  // Calculate upcoming vaccinations (next 30 days)
  const upcomingVaccinations = records?.filter(record => {
    if (!record.nextDueDate) return false;
    const daysUntil = Math.floor(
      (new Date(record.nextDueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 30;
  }) || [];

  // Calculate expiring stocks (next 30 days)
  const expiringStocks = stocks?.filter(stock => {
    const daysUntil = Math.floor(
      (new Date(stock.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntil >= 0 && daysUntil <= 30;
  }) || [];

  // Recent records (last 7 days)
  const recentRecords = records?.filter(record => {
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(record.vaccinationDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSince <= 7;
  }).slice(0, 5) || [];

  const stats = [
    {
      title: 'Total Owners',
      value: owners?.length || 0,
      icon: <PeopleIcon />,
      color: '#1976d2',
      link: '/owners',
    },
    {
      title: 'Total Pets',
      value: pets?.length || 0,
      icon: <PetsIcon />,
      color: '#dc004e',
      link: '/pets',
    },
    {
      title: 'Vaccines',
      value: vaccines?.length || 0,
      icon: <VaccinesIcon />,
      color: '#2e7d32',
      link: '/vaccines',
    },
    {
      title: 'Records',
      value: records?.length || 0,
      icon: <LocalHospitalIcon />,
      color: '#ed6c02',
      link: '/vaccine-records',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome to VAXVET Management System
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(stat.link)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" mt={1}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: 2,
                      p: 1.5,
                      color: 'white',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Upcoming Vaccinations */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <WarningIcon color="warning" />
                <Typography variant="h6">
                  Upcoming Vaccinations ({upcomingVaccinations.length})
                </Typography>
              </Box>
            </Box>

            {upcomingVaccinations.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pet</TableCell>
                      <TableCell>Vaccine</TableCell>
                      <TableCell>Due Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingVaccinations.slice(0, 5).map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>{record.pet?.name || '-'}</TableCell>
                        <TableCell>{record.vaccine?.name || '-'}</TableCell>
                        <TableCell>
                          {record.nextDueDate
                            ? new Date(record.nextDueDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="success">No upcoming vaccinations in the next 30 days</Alert>
            )}
          </Paper>
        </Grid>

        {/* Expiring Stocks */}
        {/* item yerine size */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUpIcon color="error" />
                <Typography variant="h6">
                  Expiring Stocks ({expiringStocks.length})
                </Typography>
              </Box>
            </Box>

            {expiringStocks.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vaccine</TableCell>
                      <TableCell>Serial</TableCell>
                      <TableCell>Expires</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expiringStocks.slice(0, 5).map((stock) => (
                      <TableRow key={stock.id} hover>
                        <TableCell>{stock.vaccine?.name || '-'}</TableCell>
                        <TableCell>{stock.serialId}</TableCell>
                        <TableCell>
                          <Chip
                            label={new Date(stock.expirationDate).toLocaleDateString()}
                            color="warning"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="success">No stocks expiring in the next 30 days</Alert>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        {/* item yerine size */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Vaccine Records (Last 7 Days)
            </Typography>

            {recentRecords.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Pet</TableCell>
                      <TableCell>Owner</TableCell>
                      <TableCell>Vaccine</TableCell>
                      <TableCell>Veterinarian</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRecords.map((record) => (
                      <TableRow key={record.id} hover>
                        <TableCell>
                          {new Date(record.vaccinationDate).toLocaleDateString()}
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No vaccine records in the last 7 days</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}