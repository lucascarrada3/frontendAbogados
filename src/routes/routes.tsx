// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/login/login';
import Register from '../components/login/register';
import Dashboard from '../components/dashboard/dashboard';
import TabsExpedientesPage from '../components/expedientes/TabsExpedientesPage';
import NuevoExpedientePage from '../components/expedientes/NuevoExpedientePage';
import ActualizarExpediente from '../components/expedientes/ExpedienteActualizado';
import LayoutConNavbar from '../layouts/LayoutConNavbar';
import RutaPrivada from './RutaPrivada';
import { Calendario } from '../components/googleCalendar/Calendario';
// import GoogleCalendarAuth from '../components/googleCalendar/GoogleCalendarAuth';
// import GoogleCalendarDashboard from '../components/googleCalendar/GoogleCalendarDashboard';
// import GoogleCalendarView from '../components/googleCalendar/GoogleCalendarView';


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas que incluyen el navbar */}
      <Route
          element={
            <RutaPrivada>
              <LayoutConNavbar />
            </RutaPrivada>
          }
        >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expedientes" element={<TabsExpedientesPage />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/expedientes/nuevoexpediente" element={<NuevoExpedientePage />} />
        <Route path="/expedientes/:tipo/:id" element={<ActualizarExpediente />} />
        {/* <Route path="/oauth2callback" element={<GoogleCalendarAuth />} />
        <Route path="/calendario" element={<GoogleCalendarDashboard />} /> */}
      </Route>

      {/* Ruta por defecto si no se encuentra ninguna */}
      <Route path="*" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
