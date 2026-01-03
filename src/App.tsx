import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import * as signalR from "@microsoft/signalr";
import { useEffect } from "react";

// Auth & Layout
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Owners
import OwnerList from './pages/owners/OwnerList';
import OwnerCreate from './pages/owners/OwnerCreate';
import OwnerEdit from './pages/owners/OwnerEdit';
import OwnerDetail from './pages/owners/OwnerDetail';

// Pets
import PetList from './pages/pets/PetList';
import PetCreate from './pages/pets/PetCreate';
import PetEdit from './pages/pets/PetEdit';
import PetDetail from './pages/pets/PetDetail';

// Vaccines
import VaccineList from './pages/vaccines/VaccineList';
import VaccineCreate from './pages/vaccines/VaccineCreate';
import VaccineEdit from './pages/vaccines/VaccineEdit';

// Vaccine Stocks
import VaccineStockList from './pages/vaccineStocks/VaccineStockList';
import VaccineStockCreate from './pages/vaccineStocks/VaccineStockCreate';
import VaccineStockEdit from './pages/vaccineStocks/VaccineStockEdit';

// Vaccine Records
import VaccineRecordList from './pages/vaccineRecords/VaccineRecordList';
import VaccineRecordCreate from './pages/vaccineRecords/VaccineRecordCreate';
import VaccineRecordEdit from './pages/vaccineRecords/VaccineRecordEdit';

// Veterinarians
import VeterinariansList from './pages/veterinarians/veterinariansList';
import VeterinarianDetail from './pages/veterinarians/veterinarianDetail';
import VeterinarianEdit from "./pages/veterinarians/veterinarianEdit";



// Codes
import CodesList from './pages/codes/CodesList';
import CodesCreate from './pages/codes/CodesCreate';
import CodesEdit from './pages/codes/CodesEdit';

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
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://vaxvet-backend-api-d3hwe8cpg8ezbmbg.italynorth-01.azurewebsites.net/hubs/notifications"
      )
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (message: string) => {
      alert(message);
    });

    connection
      .start()
      .then(() => console.log("✅ SignalR connected"))
      .catch((err: Error) => console.error("❌ SignalR error", err));

    return () => {
      connection.stop();
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Owners */}
              <Route path="owners" element={<OwnerList />} />
              <Route path="owners/create" element={<OwnerCreate />} />
              <Route path="owners/edit/:id" element={<OwnerEdit />} />
              <Route path="owners/:id" element={<OwnerDetail />} />

              {/* Pets */}
              <Route path="pets" element={<PetList />} />
              <Route path="pets/create" element={<PetCreate />} />
              <Route path="pets/edit/:id" element={<PetEdit />} />
              <Route path="pets/:id" element={<PetDetail />} />

              {/* Vaccines */}
              <Route path="vaccines" element={<VaccineList />} />
              <Route path="vaccines/create" element={<VaccineCreate />} />
              <Route path="vaccines/edit/:id" element={<VaccineEdit />} />

              {/* Vaccine Stocks */}
              <Route path="vaccine-stocks" element={<VaccineStockList />} />
              <Route path="vaccine-stocks/create" element={<VaccineStockCreate />} />
              <Route path="vaccine-stocks/edit/:id" element={<VaccineStockEdit />} />

              {/* Vaccine Records */}
              <Route path="vaccine-records" element={<VaccineRecordList />} />
              <Route path="vaccine-records/create" element={<VaccineRecordCreate />} />
              <Route path="vaccine-records/edit/:id" element={<VaccineRecordEdit />} />

              // Veterinarians
              <Route path="veterinarians" element={<VeterinariansList />} />
              <Route path="veterinarians/:id" element={<VeterinarianDetail />} />
              <Route path="veterinarians/edit/:id" element={<VeterinarianEdit />} />



              {/* Codes */}
              <Route path="codes" element={<CodesList />} />
              <Route path="codes/create" element={<CodesCreate />} />
              <Route path="codes/edit/:id" element={<CodesEdit />} />

              {/* Default redirect */}
              <Route path="" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;