// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/login/login';
import Register from '../components/login/register';
import Dashboard from '../components/dashboard/dashboard';
import TabsExpedientesPage from '../components/expedientes/TabsExpedientesPage';
import NuevoExpedientePage from '../components/expedientes/NuevoExpedientePage';
import ActualizarExpediente from '../components/expedientes/ExpedienteActualizado';
import LayoutConNavbar from '../layouts/LayoutConNavbar';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas que incluyen el navbar */}
      <Route element={<LayoutConNavbar />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expedientes" element={<TabsExpedientesPage />} />
        <Route path="/expedientes/nuevoexpediente" element={<NuevoExpedientePage />} />
        <Route path="/expedientes/:tipo/:id" element={<ActualizarExpediente />} />
      </Route>

      {/* Ruta por defecto si no se encuentra ninguna */}
      <Route path="*" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
