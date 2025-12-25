import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Pets as PetsIcon,
  Vaccines as VaccinesIcon,
  LocalHospital as LocalHospitalIcon,
} from '@mui/icons-material';

const stats = [
  { title: 'Total Owners', value: '120', icon: <PeopleIcon />, color: '#1976d2' },
  { title: 'Total Pets', value: '85', icon: <PetsIcon />, color: '#dc004e' },
  { title: 'Vaccines', value: '450', icon: <VaccinesIcon />, color: '#2e7d32' },
  { title: 'Records', value: '15', icon: <LocalHospitalIcon />, color: '#ed6c02' },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Welcome to VAXVET Management System
      </Typography>

      {/* Grid yerine Box ve Flexbox kullanıyoruz*/}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {stats.map((stat, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: { xs: '100%', sm: '48%', md: '23%' }, // Mobilde tam, tablette yarım, pc'de çeyrek ekran
              flexGrow: 1 
            }}
          >
            <Card>
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
                      alignItems: 'center'
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a menu item from the sidebar to get started.
        </Typography>
      </Paper>
    </Box>
  );
}