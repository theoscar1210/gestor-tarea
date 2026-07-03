package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.PorcentajesDTO;
import com.gestortareas.GestorTareasSprint.dto.RetiroFondoDTO;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
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

    private final MovimientoFondoRepository movimientoRepo;
    private final PresupuestoMensualRepository presupuestoRepo;
    private final IngresoRepository ingresoRepo;

    public FondosService(MovimientoFondoRepository movimientoRepo,
                         PresupuestoMensualRepository presupuestoRepo,
                         IngresoRepository ingresoRepo) {
        this.movimientoRepo  = movimientoRepo;
        this.presupuestoRepo = presupuestoRepo;
        this.ingresoRepo     = ingresoRepo;
    }

    /** Calcula el balance acumulado histórico de ahorro y fondo de emergencia */
    @Transactional(readOnly = true)
    public Map<String, Object> obtenerBalance() {
        List<PresupuestoMensual> meses = presupuestoRepo.findAllByOrderByMesAnoDesc();

        BigDecimal totalAhorroGenerado = BigDecimal.ZERO;
        BigDecimal totalFondoGenerado  = BigDecimal.ZERO;

        for (PresupuestoMensual p : meses) {
            BigDecimal ingresos = ingresosEfectivos(p);
            BigDecimal pA = safe(p.getPorcentajeAhorro(), BigDecimal.TEN);
            BigDecimal pF = safe(p.getPorcentajeFondoEmergencia(), new BigDecimal("5.00"));

            totalAhorroGenerado = totalAhorroGenerado.add(
                    ingresos.multiply(pA).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
            totalFondoGenerado = totalFondoGenerado.add(
                    ingresos.multiply(pF).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP));
        }

        BigDecimal retiradoAhorro    = movimientoRepo.sumByTipo("AHORRO_RETIRO");
        BigDecimal retiradoEmergencia = movimientoRepo.sumByTipo("EMERGENCIA_RETIRO");

        Map<String, Object> balance = new LinkedHashMap<>();
        balance.put("saldoAhorro",           totalAhorroGenerado.subtract(retiradoAhorro));
        balance.put("saldoFondoEmergencia",  totalFondoGenerado.subtract(retiradoEmergencia));
        balance.put("totalGeneradoAhorro",   totalAhorroGenerado);
        balance.put("totalGeneradoFondo",    totalFondoGenerado);
        balance.put("totalRetiradoAhorro",   retiradoAhorro);
        balance.put("totalRetiradoFondo",    retiradoEmergencia);
        balance.put("movimientos",           movimientoRepo.findAllByOrderByFechaDesc());
        return balance;
    }

    /** Registra un retiro del fondo de ahorro o emergencia */
    @Transactional
    public MovimientoFondo registrarRetiro(RetiroFondoDTO dto) {
        if (!dto.getTipo().equals("AHORRO_RETIRO") && !dto.getTipo().equals("EMERGENCIA_RETIRO")) {
            throw new IllegalArgumentException("Tipo inválido: " + dto.getTipo());
        }
        MovimientoFondo m = new MovimientoFondo();
        m.setTipo(dto.getTipo());
        m.setMonto(dto.getMonto());
        m.setDescripcion(dto.getDescripcion());
        m.setFecha(LocalDate.now());
        m.setMesAno(dto.getMesAno() != null ? dto.getMesAno() : LocalDate.now().format(FORMATO_MES));
        return movimientoRepo.save(m);
    }

    /** Actualiza los porcentajes de ahorro y fondo del mes indicado */
    @Transactional
    public PresupuestoMensual actualizarPorcentajes(String mesAno, PorcentajesDTO dto) {
        PresupuestoMensual p = presupuestoRepo.findByMesAno(mesAno)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado: " + mesAno));
        p.setPorcentajeAhorro(dto.getPorcentajeAhorro());
        p.setPorcentajeFondoEmergencia(dto.getPorcentajeFondoEmergencia());
        return presupuestoRepo.save(p);
    }

    /** Ingresos efectivos de un mes: suma explícita o salario base */
    public BigDecimal ingresosEfectivos(PresupuestoMensual p) {
        BigDecimal explicitos = ingresoRepo.findByMesAno(p.getMesAno()).stream()
                .map(Ingreso::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        return explicitos.compareTo(BigDecimal.ZERO) > 0
                ? explicitos
                : safe(p.getSalarioTotal(), BigDecimal.ZERO);
    }

    private BigDecimal safe(BigDecimal val, BigDecimal fallback) {
        return val != null ? val : fallback;
    }
}
