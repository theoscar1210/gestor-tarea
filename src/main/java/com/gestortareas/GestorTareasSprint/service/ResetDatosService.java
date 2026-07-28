package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.repository.*;
import com.gestortareas.config.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResetDatosService {

    private static final Logger log = LoggerFactory.getLogger(ResetDatosService.class);

    private final GastoRepository                 gastoRepo;
    private final HistorialPagoRepository         historialPagoRepo;
    private final IngresoRepository               ingresoRepo;
    private final MovimientoFondoRepository       movimientoRepo;
    private final PresupuestoMensualRepository    presupuestoRepo;
    private final ObligacionRepository            obligacionRepo;
    private final TareaRepository                 tareaRepo;
    private final ListaMercadoRepository          mercadoRepo;
    private final SubTareaRepository              subTareaRepo;
    private final ContactoRepository              contactoRepo;
    private final PlantillaRutinaRepository       plantillaRepo;
    private final UbicacionRecordatorioRepository ubicacionRepo;

    public ResetDatosService(GastoRepository gastoRepo,
                             HistorialPagoRepository historialPagoRepo,
                             IngresoRepository ingresoRepo,
                             MovimientoFondoRepository movimientoRepo,
                             PresupuestoMensualRepository presupuestoRepo,
                             ObligacionRepository obligacionRepo,
                             TareaRepository tareaRepo,
                             ListaMercadoRepository mercadoRepo,
                             SubTareaRepository subTareaRepo,
                             ContactoRepository contactoRepo,
                             PlantillaRutinaRepository plantillaRepo,
                             UbicacionRecordatorioRepository ubicacionRepo) {
        this.gastoRepo         = gastoRepo;
        this.historialPagoRepo = historialPagoRepo;
        this.ingresoRepo       = ingresoRepo;
        this.movimientoRepo    = movimientoRepo;
        this.presupuestoRepo   = presupuestoRepo;
        this.obligacionRepo    = obligacionRepo;
        this.tareaRepo         = tareaRepo;
        this.mercadoRepo       = mercadoRepo;
        this.subTareaRepo      = subTareaRepo;
        this.contactoRepo      = contactoRepo;
        this.plantillaRepo     = plantillaRepo;
        this.ubicacionRepo     = ubicacionRepo;
    }

    @Transactional
    public void resetearTodo() {
        Long uid = SecurityUtils.getCurrentUserId();
        log.warn("[Reset] Usuario {} solicitó borrado completo de datos", uid);

        // Gastos hijos de presupuestos
        List<Long> presupuestoIds = presupuestoRepo.findByUsuarioIdOrderByMesAnoDesc(uid)
                .stream().map(p -> p.getId()).toList();
        if (!presupuestoIds.isEmpty()) gastoRepo.deleteByPresupuestoIdIn(presupuestoIds);

        // Historial de pagos hijos de obligaciones
        List<Long> obligacionIds = obligacionRepo.findByUsuarioId(uid)
                .stream().map(o -> o.getId()).toList();
        if (!obligacionIds.isEmpty()) historialPagoRepo.deleteByObligacionIdIn(obligacionIds);

        // Subtareas (FK a tarea, borrar antes que tareas)
        subTareaRepo.deleteByUsuarioId(uid);

        // Tablas con usuario_id directo
        ingresoRepo.deleteByUsuarioId(uid);
        movimientoRepo.deleteByUsuarioId(uid);
        presupuestoRepo.deleteByUsuarioId(uid);
        obligacionRepo.deleteByUsuarioId(uid);
        tareaRepo.deleteByUsuarioId(uid);
        mercadoRepo.deleteByUsuarioId(uid);
        contactoRepo.deleteByUsuarioId(uid);
        plantillaRepo.deleteByUsuarioId(uid);
        ubicacionRepo.deleteByUsuarioId(uid);

        log.warn("[Reset] Borrado completo finalizado para usuario {}", uid);
    }
}
