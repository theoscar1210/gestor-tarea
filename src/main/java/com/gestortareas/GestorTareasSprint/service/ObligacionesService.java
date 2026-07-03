package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.ObligacionDTO;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ObligacionesService {

    private final ObligacionRepository        obligacionRepo;
    private final HistorialPagoRepository     historialRepo;
    private final PresupuestoMensualRepository presupuestoRepo;
    private final GastoRepository             gastoRepo;
    private final CategoriaGastoRepository    categoriaRepo;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    public ObligacionesService(ObligacionRepository obligacionRepo,
                               HistorialPagoRepository historialRepo,
                               PresupuestoMensualRepository presupuestoRepo,
                               GastoRepository gastoRepo,
                               CategoriaGastoRepository categoriaRepo) {
        this.obligacionRepo  = obligacionRepo;
        this.historialRepo   = historialRepo;
        this.presupuestoRepo = presupuestoRepo;
        this.gastoRepo       = gastoRepo;
        this.categoriaRepo   = categoriaRepo;
    }

    @Transactional(readOnly = true)
    public List<Obligacion> obtenerTodas() {
        return obligacionRepo.findByActivoTrue();
    }

    @Transactional
    public Obligacion crear(ObligacionDTO dto) {
        obligacionRepo.findByNombreIgnoreCaseAndActivoTrue(dto.getNombre()).ifPresent(o -> {
            throw new IllegalArgumentException("Ya existe una obligación con el nombre: " + dto.getNombre());
        });

        Obligacion o = new Obligacion();
        o.setNombre(dto.getNombre());
        o.setTipo(dto.getTipo());
        o.setMonto(dto.getMonto());
        o.setDiaVencimiento(dto.getDiaVencimiento());
        o.setActivo(true);
        o.setCreatedAt(java.time.LocalDateTime.now());
        return obligacionRepo.save(o);
    }

    @Transactional
    public Obligacion actualizar(Long id, ObligacionDTO dto) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));
        o.setNombre(dto.getNombre());
        o.setTipo(dto.getTipo());
        o.setMonto(dto.getMonto());
        o.setDiaVencimiento(dto.getDiaVencimiento());
        return obligacionRepo.save(o);
    }

    @Transactional
    public void eliminar(Long id) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));
        o.setActivo(false);
        obligacionRepo.save(o);
    }

    @Transactional(readOnly = true)
    public List<Obligacion> obtenerProximas(int dias) {
        LocalDate hoy  = LocalDate.now();
        int diaHoy     = hoy.getDayOfMonth();
        int limite     = hoy.plusDays(dias).getDayOfMonth();

        return obligacionRepo.findByActivoTrue().stream()
                .filter(o -> {
                    int dv = o.getDiaVencimiento();
                    if (diaHoy <= limite) return dv >= diaHoy && dv <= limite;
                    return dv >= diaHoy || dv <= limite;
                })
                .collect(Collectors.toList());
    }

    // @Transactional garantiza atomicidad: si gastoRepo.save() falla,
    // el historialRepo.save() también se revierte.
    @Transactional
    public HistorialPago registrarPago(Long id) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));

        String mesActual = LocalDate.now().format(FORMATTER);

        HistorialPago historial = historialRepo
                .findByObligacionIdAndMesAno(id, mesActual)
                .orElse(new HistorialPago());

        boolean yaEstabaPagado = Boolean.TRUE.equals(historial.getPagado());

        historial.setObligacion(o);
        historial.setMesAno(mesActual);
        historial.setPagado(true);
        historial.setFechaPago(LocalDate.now());
        historial.setMontoPagado(o.getMonto());
        HistorialPago saved = historialRepo.save(historial);

        if (!yaEstabaPagado) {
            try {
                presupuestoRepo.findByMesAno(mesActual).ifPresent(presupuesto -> {
                    CategoriaGasto cat = resolverCategoria(o.getTipo());
                    Gasto gasto = new Gasto();
                    gasto.setPresupuesto(presupuesto);
                    gasto.setCategoria(cat);
                    gasto.setDescripcion("Pago: " + o.getNombre());
                    gasto.setMonto(o.getMonto());
                    gasto.setFecha(LocalDate.now());
                    gastoRepo.save(gasto);
                });
            } catch (Exception e) {
                // El pago queda registrado aunque no se pueda vincular al presupuesto
            }
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> estadoPagoMes(Long obligacionId) {
        String mesActual = LocalDate.now().format(FORMATTER);
        var h = historialRepo.findByObligacionIdAndMesAno(obligacionId, mesActual);
        Map<String, Object> estado = new java.util.LinkedHashMap<>();
        estado.put("pagadoEsteMes", h.map(hp -> Boolean.TRUE.equals(hp.getPagado())).orElse(false));
        estado.put("fechaPago",     h.map(hp -> hp.getFechaPago()).orElse(null));
        return estado;
    }

    @Transactional(readOnly = true)
    public List<HistorialPago> obtenerPagosMes() {
        String mesActual = LocalDate.now().format(FORMATTER);
        return historialRepo.findByMesAnoAndPagadoTrue(mesActual);
    }

    public int calcularDiasRestantes(Obligacion o) {
        LocalDate hoy  = LocalDate.now();
        LocalDate venc = hoy.withDayOfMonth(
                Math.min(o.getDiaVencimiento(), hoy.lengthOfMonth()));
        if (venc.isBefore(hoy)) {
            venc = venc.plusMonths(1);
            venc = venc.withDayOfMonth(Math.min(o.getDiaVencimiento(), venc.lengthOfMonth()));
        }
        return (int) hoy.until(venc, java.time.temporal.ChronoUnit.DAYS);
    }

    private CategoriaGasto resolverCategoria(TipoObligacion tipo) {
        String nombre = switch (tipo) {
            case arriendo         -> "Vivienda / Arriendo";
            case servicio_publico -> "Servicios Públicos";
            case tarjeta_credito  -> "Servicios Públicos";
            case suscripcion      -> "Hobbies / Suscripciones";
            case otro             -> "Servicios Públicos";
        };

        return categoriaRepo.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> categoriaRepo.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("No hay categorías de gasto disponibles")));
    }
}
