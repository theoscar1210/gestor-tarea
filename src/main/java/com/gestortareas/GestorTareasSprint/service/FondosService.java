package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.PorcentajesDTO;
import com.gestortareas.GestorTareasSprint.dto.RetiroFondoDTO;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import com.gestortareas.config.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class FondosService {

    private static final DateTimeFormatter FORMATO_MES = DateTimeFormatter.ofPattern("yyyy-MM");

    private final MovimientoFondoRepository    movimientoRepo;
    private final PresupuestoMensualRepository presupuestoRepo;
    private final IngresoRepository            ingresoRepo;

    public FondosService(MovimientoFondoRepository movimientoRepo,
                         PresupuestoMensualRepository presupuestoRepo,
                         IngresoRepository ingresoRepo) {
        this.movimientoRepo  = movimientoRepo;
        this.presupuestoRepo = presupuestoRepo;
        this.ingresoRepo     = ingresoRepo;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerBalance() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<PresupuestoMensual> meses = presupuestoRepo.findByUsuarioIdOrderByMesAnoDesc(userId);

        BigDecimal totalAhorroGenerado = BigDecimal.ZERO;
        BigDecimal totalFondoGenerado  = BigDecimal.ZERO;

        for (PresupuestoMensual p : meses) {
            BigDecimal ingresos = ingresosEfectivos(p, userId);
            BigDecimal pA = safe(p.getPorcentajeAhorro(), BigDecimal.TEN);
            BigDecimal pF = safe(p.getPorcentajeFondoEmergencia(), new BigDecimal("5.00"));

            totalAhorroGenerado = totalAhorroGenerado.add(
                    ingresos.multiply(pA).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            totalFondoGenerado = totalFondoGenerado.add(
                    ingresos.multiply(pF).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        }

        BigDecimal retiradoAhorro     = movimientoRepo.sumByTipoAndUsuarioId("AHORRO_RETIRO",     userId);
        BigDecimal retiradoEmergencia = movimientoRepo.sumByTipoAndUsuarioId("EMERGENCIA_RETIRO", userId);

        Map<String, Object> balance = new LinkedHashMap<>();
        balance.put("saldoAhorro",          totalAhorroGenerado.subtract(retiradoAhorro));
        balance.put("saldoFondoEmergencia", totalFondoGenerado.subtract(retiradoEmergencia));
        balance.put("totalGeneradoAhorro",  totalAhorroGenerado);
        balance.put("totalGeneradoFondo",   totalFondoGenerado);
        balance.put("totalRetiradoAhorro",  retiradoAhorro);
        balance.put("totalRetiradoFondo",   retiradoEmergencia);
        balance.put("movimientos",          movimientoRepo.findByUsuarioIdOrderByFechaDesc(userId));
        return balance;
    }

    @Transactional
    public MovimientoFondo registrarRetiro(RetiroFondoDTO dto) {
        if (!dto.getTipo().equals("AHORRO_RETIRO") && !dto.getTipo().equals("EMERGENCIA_RETIRO")) {
            throw new IllegalArgumentException("Tipo inválido: " + dto.getTipo());
        }
        Long userId = SecurityUtils.getCurrentUserId();
        MovimientoFondo m = new MovimientoFondo();
        m.setTipo(dto.getTipo());
        m.setMonto(dto.getMonto());
        m.setDescripcion(dto.getDescripcion());
        m.setFecha(LocalDate.now());
        m.setMesAno(dto.getMesAno() != null ? dto.getMesAno() : LocalDate.now().format(FORMATO_MES));
        m.setUsuarioId(userId);
        return movimientoRepo.save(m);
    }

    @Transactional
    public PresupuestoMensual actualizarPorcentajes(String mesAno, PorcentajesDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        PresupuestoMensual p = presupuestoRepo.findByMesAnoAndUsuarioId(mesAno, userId)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado: " + mesAno));
        p.setPorcentajeAhorro(dto.getPorcentajeAhorro());
        p.setPorcentajeFondoEmergencia(dto.getPorcentajeFondoEmergencia());
        return presupuestoRepo.save(p);
    }

    public BigDecimal ingresosEfectivos(PresupuestoMensual p, Long userId) {
        BigDecimal explicitos = ingresoRepo.findByMesAnoAndUsuarioId(p.getMesAno(), userId).stream()
                .map(Ingreso::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        return safe(p.getSalarioTotal(), BigDecimal.ZERO).add(explicitos);
    }

    private BigDecimal safe(BigDecimal val, BigDecimal fallback) {
        return val != null ? val : fallback;
    }
}
