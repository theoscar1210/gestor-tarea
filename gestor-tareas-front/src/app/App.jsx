import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import TareasPage from "../pages/TareasPage";
import MercadoPage from "../pages/MercadoPage";
import PagosPage from "../pages/PagosPage";
import PresupuestoPage from "../pages/PresupuestoPage";
import Navbar from "../shared/ui/Navbar";
import AgentBubble from "../features/agent/ui/AgentBubble";

const App = () => {
  // sessionStorage persiste la sesión mientras el tab esté abierto
  const [autenticado, setAutenticado] = useState(
    () => !!sessionStorage.getItem("auth")
  );

  const handleLogin = () => setAutenticado(true);

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    setAutenticado(false);
  };

  if (!autenticado) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/tareas"      element={<TareasPage />} />
        <Route path="/mercado"     element={<MercadoPage />} />
        <Route path="/pagos"       element={<PagosPage />} />
        <Route path="/presupuesto" element={<PresupuestoPage />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
      <AgentBubble />
    </BrowserRouter>
  );
};

export default App;
