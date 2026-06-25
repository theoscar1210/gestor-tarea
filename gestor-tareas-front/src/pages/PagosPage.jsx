import AlertasPagos from "../features/pagos/ui/AlertasPagos";
import FormObligacion from "../features/pagos/ui/FormObligacion";
import ListaObligaciones from "../features/pagos/ui/ListaObligaciones";
import { usePagos } from "../features/pagos/model/usePagos";

const PagosPage = () => {
  const { obligaciones, proximas, crear, actualizar, eliminar, pagar } = usePagos();

  return (
    <main className="app-content">
      <div className="page-header">
        <h1 className="page-header__title">
          <i className="bi bi-calendar-check"></i> Obligaciones y Pagos
        </h1>
        <p className="page-header__sub">
          {obligaciones.length} obligaciones activas · {proximas.length} vencen pronto
        </p>
      </div>

      <AlertasPagos proximas={proximas} onPagar={pagar} />

      <FormObligacion onGuardar={crear} />

      <p className="section-title mt-3">
        <i className="bi bi-list-task me-1"></i>Todas las obligaciones
      </p>
      <ListaObligaciones
        obligaciones={obligaciones}
        onPagar={pagar}
        onActualizar={actualizar}
        onEliminar={eliminar}
      />
    </main>
  );
};

export default PagosPage;
