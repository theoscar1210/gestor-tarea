import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../shared/ui/Navbar";
import DashboardPage from "../pages/DashboardPage";
import TareasPage from "../pages/TareasPage";
import MercadoPage from "../pages/MercadoPage";
import PagosPage from "../pages/PagosPage";
import PresupuestoPage from "../pages/PresupuestoPage";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/tareas"      element={<TareasPage />} />
        <Route path="/mercado"     element={<MercadoPage />} />
        <Route path="/pagos"       element={<PagosPage />} />
        <Route path="/presupuesto" element={<PresupuestoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
