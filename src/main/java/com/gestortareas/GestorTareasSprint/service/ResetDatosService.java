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

    private final GastoRepository              gastoRepo;
    private final HistorialPagoRepository      historialPagoRepo;
    private final IngresoRepository            ingresoRepo;
    private final MovimientoFondoRepository    movimientoRepo;
    private final PresupuestoMensualRepository presupuestoRepo;
    private final ObligacionRepository         obligacionRepo;
    private final TareaRepository              tareaRepo;
    private final ListaMercadoRepository       mercadoRepo;

    public ResetDatosService(GastoRepository gastoRepo,
                             HistorialPagoRepository historialPagoRepo,
                             IngresoRepository ingresoRepo,
                             MovimientoFondoRepository movimientoRepo,
                             PresupuestoMensualRepository presupuestoRepo,
                             ObligacionRepository obligacionRepo,
                             TareaRepository tareaRepo,
                             ListaMercadoRepository mercadoRepo) {
        this.gastoRepo        = gastoRepo;
        this.historialPagoRepo = historialPagoRepo;
        this.ingresoRepo      = ingresoRepo;
        this.movimientoRepo   = movimientoRepo;
        this.presupuestoRepo  = presupuestoRepo;
        this.obligacionRepo   = obligacionRepo;
        this.tareaRepo        = tareaRepo;
        this.mercadoRepo      = mercadoRepo;
    }

    @Transactional
    public void resetearTodo() {
        Long uid = SecurityUtils.getCurrentUserId();
        log.warn("[Reset] Usuario {} solicitó borrado completo de datos", uid);

        // Paso 1: obtener IDs de presupuestos del usuario → borrar gastos hijos
        List<Long> presupuestoIds = presupuestoRepo.findByUsuarioIdOrderByMesAnoDesc(uid)
                .stream().map(p -> p.getId()).toList();
        if (!presupuestoIds.isEmpty()) {
            gastoRepo.deleteByPresupuestoIdIn(presupuestoIds);
        }

        // Paso 2: obtener IDs de obligaciones del usuario → borrar historial_pagos hijos
        List<Long> obligacionIds = obligacionRepo.findByUsuarioId(uid)
                .stream().map(o -> o.getId()).toList();
        if (!obligacionIds.isEmpty()) {
            historialPagoRepo.deleteByObligacionIdIn(obligacionIds);
        }

        // Paso 3: borrar tablas con columna usuario_id directa (sin FK pendiente)
        ingresoRepo.deleteByUsuarioId(uid);
        movimientoRepo.deleteByUsuarioId(uid);
        presupuestoRepo.deleteByUsuarioId(uid);
        obligacionRepo.deleteByUsuarioId(uid);
        tareaRepo.deleteByUsuarioId(uid);
        mercadoRepo.deleteByUsuarioId(uid);

        log.warn("[Reset] Borrado completo finalizado para usuario {}", uid);
    }
}
