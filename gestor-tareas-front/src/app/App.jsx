import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TareasPage from "../pages/TareasPage";
import MercadoPage from "../pages/MercadoPage";
import PagosPage from "../pages/PagosPage";
import PresupuestoPage from "../pages/PresupuestoPage";
import Navbar from "../shared/ui/Navbar";
import AgentBubble from "../features/agent/ui/AgentBubble";
import ProtectedRoute from "../components/ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary";
import { usePushNotifications } from "../features/notifications/hooks/usePushNotifications";

const App = () => {
  const { isAuthenticated } = useAuth();
  usePushNotifications();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/"            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/tareas"      element={<ProtectedRoute><TareasPage /></ProtectedRoute>} />
          <Route path="/mercado"     element={<ProtectedRoute><MercadoPage /></ProtectedRoute>} />
          <Route path="/pagos"       element={<ProtectedRoute><PagosPage /></ProtectedRoute>} />
          <Route path="/presupuesto" element={<ProtectedRoute><PresupuestoPage /></ProtectedRoute>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
      <AgentBubble />
    </BrowserRouter>
  );
};

export default App;
