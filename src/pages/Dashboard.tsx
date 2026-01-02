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
import { veterinariansApi } from '../api/veterinarians';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // 🔑 ROLE STRING
  const roleName = user?.role?.toLowerCase();

  // --- DATA ---
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

  // ❌ Veterinarian ise bu API çağrılmaz
  const { data: veterinarians } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: veterinariansApi.getAll,
    enabled: roleName !== 'veterinarian',
  });

  const { data: records } = useQuery({
    queryKey: ['vaccine-records'],
    queryFn: vaccineRecordsApi.getAll,
  });

  const { data: stocks } = useQuery({
    queryKey: ['vaccine-stocks'],
    queryFn: vaccineStocksApi.getAll,
  });

  // --- BUSINESS LOGIC ---
  const upcomingVaccinations =
    records?.filter(r => {
      if (!r.nextDueDate) return false;
      const days =
        (new Date(r.nextDueDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30;
    }) || [];

  const expiringStocks =
    stocks?.filter(s => {
      const days =
        (new Date(s.expirationDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30;
    }) || [];

  const recentRecords =
    records
      ?.filter(r => {
        const days =
          (Date.now() - new Date(r.vaccinationDate).getTime()) /
          (1000 * 60 * 60 * 24);
        return days <= 7;
      })
      .slice(0, 5) || [];

  // --- STATS CARDS ---
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

    // 🔒 SADECE ADMIN
    roleName !== 'veterinarian'
      ? {
        title: 'Veterinarians',
        value: veterinarians?.length || 0,
        icon: <LocalHospitalIcon />,
        color: '#8e24aa',
        link: '/veterinarians',
      }
      : null,

    {
      title: 'Records',
      value: records?.length || 0,
      icon: <LocalHospitalIcon />,
      color: '#ed6c02',
      link: '/vaccine-records',
    },
  ].filter(Boolean);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome to VAXVET Management System
      </Typography>

      {/* ===== STAT CARDS ===== */}
      <Grid container spacing={3} mb={3}>
        {stats.map((stat: any, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(stat.link)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: 2,
                      p: 1.5,
                      color: 'white',
                      display: 'flex',
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

      {/* ===== TABLES ===== */}
      <Grid container spacing={3}>
        {/* Upcoming Vaccinations */}
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
                    {upcomingVaccinations.slice(0, 5).map(r => (
                      <TableRow key={r.id}>
                        <TableCell>{r.pet?.name || '-'}</TableCell>
                        <TableCell>{r.vaccine?.name || '-'}</TableCell>
                        <TableCell>
                          {new Date(r.nextDueDate!).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="success">
                No upcoming vaccinations in the next 30 days
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Expiring Stocks */}
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
                    {expiringStocks.slice(0, 5).map(s => (
                      <TableRow key={s.id}>
                        <TableCell>{s.vaccine?.name}</TableCell>
                        <TableCell>{s.serialId}</TableCell>
                        <TableCell>
                          <Chip
                            label={new Date(
                              s.expirationDate
                            ).toLocaleDateString()}
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
              <Alert severity="success">No stocks expiring soon</Alert>
            )}
          </Paper>
        </Grid>

        {/* Recent Records */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
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
                    {recentRecords.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>
                          {new Date(r.vaccinationDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{r.pet?.name}</TableCell>
                        <TableCell>
                          {r.pet?.owner
                            ? `${r.pet.owner.firstName} ${r.pet.owner.lastName}`
                            : '-'}
                        </TableCell>
                        <TableCell>{r.vaccine?.name}</TableCell>
                        <TableCell>
                          {r.veterinarian
                            ? `${r.veterinarian.firstName} ${r.veterinarian.lastName}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">No recent vaccine records</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
