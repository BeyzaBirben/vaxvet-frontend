import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OwnerList from './pages/owners/OwnerList';
import OwnerCreate from './pages/owners/OwnerCreate';
import OwnerEdit from './pages/owners/OwnerEdit';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import PetList from './pages/pets/PetList';
import PetCreate from './pages/pets/PetCreate';
import PetEdit from './pages/pets/PetEdit';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="owners" element={<OwnerList />} />
              <Route path="owners/create" element={<OwnerCreate />} />
              <Route path="owners/edit/:id" element={<OwnerEdit />} />
              <Route path="pets" element={<PetList />} />
               <Route path="pets/create" element={<PetCreate />} />
              <Route path="pets/edit/:id" element={<PetEdit />} />
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}



export default App;