package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.ObligacionDTO;
import com.gestortareas.GestorTareasSprint.model.HistorialPago;
import com.gestortareas.GestorTareasSprint.model.Obligacion;
import com.gestortareas.GestorTareasSprint.repository.HistorialPagoRepository;
import com.gestortareas.GestorTareasSprint.repository.ObligacionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ObligacionesService {

    private final ObligacionRepository obligacionRepo;
    private final HistorialPagoRepository historialRepo;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    public ObligacionesService(ObligacionRepository obligacionRepo, HistorialPagoRepository historialRepo) {
        this.obligacionRepo = obligacionRepo;
        this.historialRepo  = historialRepo;
    }

    public List<Obligacion> obtenerTodas() {
        return obligacionRepo.findByActivoTrue();
    }

    public Obligacion crear(ObligacionDTO dto) {
        // Avisa si ya existe una con el mismo nombre
        obligacionRepo.findByNombreIgnoreCase(dto.getNombre()).ifPresent(o -> {
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

    public Obligacion actualizar(Long id, ObligacionDTO dto) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));
        o.setNombre(dto.getNombre());
        o.setTipo(dto.getTipo());
        o.setMonto(dto.getMonto());
        o.setDiaVencimiento(dto.getDiaVencimiento());
        return obligacionRepo.save(o);
    }

    public void eliminar(Long id) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));
        o.setActivo(false);
        obligacionRepo.save(o);
    }

    public List<Obligacion> obtenerProximas(int dias) {
        LocalDate hoy = LocalDate.now();
        int diaHoy = hoy.getDayOfMonth();
        int limite = hoy.plusDays(dias).getDayOfMonth();

        return obligacionRepo.findByActivoTrue().stream()
                .filter(o -> {
                    int dv = o.getDiaVencimiento();
                    // Vence este mes y dentro del rango
                    if (diaHoy <= limite) {
                        return dv >= diaHoy && dv <= limite;
                    }
                    // El rango cruza al mes siguiente
                    return dv >= diaHoy || dv <= limite;
                })
                .collect(Collectors.toList());
    }

    public HistorialPago registrarPago(Long id) {
        Obligacion o = obligacionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Obligación no encontrada: " + id));

        String mesActual = LocalDate.now().format(FORMATTER);
        HistorialPago historial = historialRepo
                .findByObligacionIdAndMesAno(id, mesActual)
                .orElse(new HistorialPago());

        historial.setObligacion(o);
        historial.setMesAno(mesActual);
        historial.setPagado(true);
        historial.setFechaPago(LocalDate.now());
        historial.setMontoPagado(o.getMonto());
        return historialRepo.save(historial);
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
}
