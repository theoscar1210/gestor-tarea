package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.GastoDTO;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import com.gestortareas.config.SecurityUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PresupuestoService {

    private final PresupuestoMensualRepository presupuestoRepo;
    private final CategoriaGastoRepository    categoriaRepo;
    private final GastoRepository             gastoRepo;
    private final IngresoRepository           ingresoRepo;
    private static final DateTimeFormatter    FORMATO_MES = DateTimeFormatter.ofPattern("yyyy-MM");

    public PresupuestoService(PresupuestoMensualRepository presupuestoRepo,
                               CategoriaGastoRepository categoriaRepo,
                               GastoRepository gastoRepo,
                               IngresoRepository ingresoRepo) {
        this.presupuestoRepo = presupuestoRepo;
        this.categoriaRepo   = categoriaRepo;
        this.gastoRepo       = gastoRepo;
        this.ingresoRepo     = ingresoRepo;
    }

    @PostConstruct
    @Transactional
    public void seedCategorias() {
        if (categoriaRepo.count() > 0) return;

        List<Object[]> seed = List.of(
            new Object[]{"Vivienda / Arriendo",     TipoCategoria.fijo,     30.00, "#4f46e5"},
            new Object[]{"Servicios Públicos",      TipoCategoria.fijo,     10.00, "#7c3aed"},
            new Object[]{"Alimentación",            TipoCategoria.fijo,      8.00, "#059669"},
            new Object[]{"Transporte",              TipoCategoria.fijo,      7.00, "#0891b2"},
            new Object[]{"Salud",                   TipoCategoria.fijo,      5.00, "#dc2626"},
            new Object[]{"Entretenimiento",         TipoCategoria.variable, 10.00, "#f59e0b"},
            new Object[]{"Restaurantes / Salidas",  TipoCategoria.variable,  8.00, "#d97706"},
            new Object[]{"Ropa / Calzado",          TipoCategoria.variable,  6.00, "#7c3aed"},
            new Object[]{"Hobbies / Suscripciones", TipoCategoria.variable,  6.00, "#6366f1"},
            new Object[]{"Fondo de Emergencia",     TipoCategoria.ahorro,   10.00, "#10b981"},
            new Object[]{"Ahorro Metas",            TipoCategoria.ahorro,    5.00, "#34d399"},
            new Object[]{"Inversión",               TipoCategoria.inversion,  5.00, "#06b6d4"}
        );

        seed.forEach(row -> {
            CategoriaGasto c = new CategoriaGasto();
            c.setNombre((String) row[0]);
            c.setTipo((TipoCategoria) row[1]);
            c.setPorcentajeSugerido(BigDecimal.valueOf((Double) row[2]));
            c.setColor((String) row[3]);
            categoriaRepo.save(c);
        });
    }

    @Transactional(readOnly = true)
    public List<CategoriaGasto> obtenerCategorias() {
        return categoriaRepo.findAll();
    }

    @Transactional
    public PresupuestoMensual crearPresupuesto(String mesAno, BigDecimal salario) {
        Long userId = SecurityUtils.getCurrentUserId();
        PresupuestoMensual p = presupuestoRepo.findByMesAnoAndUsuarioId(mesAno, userId)
                .orElse(new PresupuestoMensual());
        boolean esNuevo = p.getId() == null;
        p.setMesAno(mesAno);
        p.setSalarioTotal(salario);
        p.setCreatedAt(java.time.LocalDateTime.now());
        p.setUsuarioId(userId);
        if (esNuevo) {
            List<PresupuestoMensual> anteriores = presupuestoRepo.findByUsuarioIdOrderByMesAnoDesc(userId);
            if (!anteriores.isEmpty()) {
                PresupuestoMensual ant = anteriores.get(0);
                p.setPorcentajeAhorro(ant.getPorcentajeAhorro());
                p.setPorcentajeFondoEmergencia(ant.getPorcentajeFondoEmergencia());
            }
        }
        return presupuestoRepo.save(p);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerResumen(String mesAno) {
        Long userId = SecurityUtils.getCurrentUserId();
        PresupuestoMensual p = presupuestoRepo.findByMesAnoAndUsuarioId(mesAno, userId)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para: " + mesAno));

        List<Gasto> gastos = gastoRepo.findByPresupuestoId(p.getId());
        BigDecimal totalGastado = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ingresosExplicitos = ingresoRepo.findByMesAnoAndUsuarioId(mesAno, userId).stream()
                .map(Ingreso::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal salarioBase = p.getSalarioTotal() != null ? p.getSalarioTotal() : BigDecimal.ZERO;
        BigDecimal ingresosEfectivos = salarioBase.add(ingresosExplicitos);

        BigDecimal pAhorro = p.getPorcentajeAhorro() != null ? p.getPorcentajeAhorro() : BigDecimal.TEN;
        BigDecimal pFondo  = p.getPorcentajeFondoEmergencia() != null ? p.getPorcentajeFondoEmergencia() : new BigDecimal("5.00");

        BigDecimal montoAhorro = ingresosEfectivos.multiply(pAhorro)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal montoFondo  = ingresosEfectivos.multiply(pFondo)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal presupuestoDisponible = ingresosEfectivos.subtract(montoAhorro).subtract(montoFondo);
        BigDecimal saldoReal = presupuestoDisponible.subtract(totalGastado);

        BigDecimal porcentajeEjec = presupuestoDisponible.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalGastado.divide(presupuestoDisponible, 4, RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100))
                              .min(BigDecimal.valueOf(100));

        Map<String, BigDecimal> porCategoria = gastos.stream().collect(
                Collectors.groupingBy(
                        g -> g.getCategoria().getNombre(),
                        Collectors.reducing(BigDecimal.ZERO, Gasto::getMonto, BigDecimal::add)
                ));

        BigDecimal ahorroProyectado = proyectarAhorro(p, gastos);

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("presupuesto",           p);
        resumen.put("gastos",                gastos);
        resumen.put("totalGastado",          totalGastado);
        resumen.put("ingresosEfectivos",     ingresosEfectivos);
        resumen.put("montoAhorro",           montoAhorro);
        resumen.put("montoFondoEmergencia",  montoFondo);
        resumen.put("presupuestoDisponible", presupuestoDisponible);
        resumen.put("saldoReal",             saldoReal);
        resumen.put("disponible",            saldoReal);
        resumen.put("porcentajeEjec",        porcentajeEjec);
        resumen.put("porCategoria",          porCategoria);
        resumen.put("ahorroProyectado",      ahorroProyectado);
        return resumen;
    }

    @Transactional
    public Gasto agregarGasto(Long presupuestoId, GastoDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        PresupuestoMensual p = presupuestoRepo.findById(presupuestoId)
                .filter(pm -> userId.equals(pm.getUsuarioId()))
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado: " + presupuestoId));
        CategoriaGasto c = categoriaRepo.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + dto.getCategoriaId()));

        Gasto g = new Gasto();
        g.setPresupuesto(p);
        g.setCategoria(c);
        g.setDescripcion(dto.getDescripcion());
        g.setMonto(dto.getMonto());
        g.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        return gastoRepo.save(g);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerProyeccion(String mesAno) {
        Long userId = SecurityUtils.getCurrentUserId();
        PresupuestoMensual p = presupuestoRepo.findByMesAnoAndUsuarioId(mesAno, userId)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para: " + mesAno));
        List<Gasto> gastos = gastoRepo.findByPresupuestoId(p.getId());

        LocalDate hoy     = LocalDate.now();
        int diasMes       = hoy.lengthOfMonth();
        int diaActual     = hoy.getDayOfMonth();

        BigDecimal gastadoHoy = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal gastoDiarioPromedio = diaActual > 0
                ? gastadoHoy.divide(BigDecimal.valueOf(diaActual), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal proyeccionTotal  = gastoDiarioPromedio.multiply(BigDecimal.valueOf(diasMes));
        BigDecimal ahorroProyectado = p.getSalarioTotal() != null
                ? p.getSalarioTotal().subtract(proyeccionTotal) : BigDecimal.ZERO;

        Map<Integer, BigDecimal> gastoAcumuladoPorDia = new TreeMap<>();
        BigDecimal acum = BigDecimal.ZERO;
        for (int dia = 1; dia <= diaActual; dia++) {
            final int d = dia;
            BigDecimal gastoDelDia = gastos.stream()
                    .filter(g -> g.getFecha().getDayOfMonth() == d)
                    .map(Gasto::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            acum = acum.add(gastoDelDia);
            gastoAcumuladoPorDia.put(dia, acum);
        }

        Map<String, Object> proyeccion = new LinkedHashMap<>();
        proyeccion.put("salario",             p.getSalarioTotal());
        proyeccion.put("gastadoHasta",        gastadoHoy);
        proyeccion.put("gastoDiarioPromedio", gastoDiarioPromedio);
        proyeccion.put("proyeccionTotal",     proyeccionTotal);
        proyeccion.put("ahorroProyectado",    ahorroProyectado);
        proyeccion.put("diasTranscurridos",   diaActual);
        proyeccion.put("diasTotales",         diasMes);
        proyeccion.put("gastoAcumulado",      gastoAcumuladoPorDia);
        return proyeccion;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerHistorial(int meses) {
        Long userId = SecurityUtils.getCurrentUserId();
        TreeSet<String> todosMeses = new TreeSet<>(Comparator.reverseOrder());
        presupuestoRepo.findByUsuarioIdOrderByMesAnoDesc(userId).forEach(p -> todosMeses.add(p.getMesAno()));
        todosMeses.addAll(ingresoRepo.findDistinctMesAnoDescByUsuarioId(userId));

        return todosMeses.stream().limit(meses).map(mesAno -> {
            BigDecimal totalIngresos = ingresoRepo.findByMesAnoAndUsuarioId(mesAno, userId).stream()
                    .map(Ingreso::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add);

            Optional<PresupuestoMensual> pOpt = presupuestoRepo.findByMesAnoAndUsuarioId(mesAno, userId);
            BigDecimal totalGastos = pOpt.map(p ->
                    gastoRepo.findByPresupuestoId(p.getId()).stream()
                            .map(Gasto::getMonto).reduce(BigDecimal.ZERO, BigDecimal::add)
            ).orElse(BigDecimal.ZERO);

            BigDecimal salarioBase = pOpt
                    .map(p -> p.getSalarioTotal() != null ? p.getSalarioTotal() : BigDecimal.ZERO)
                    .orElse(BigDecimal.ZERO);

            BigDecimal ingresosEfectivos = salarioBase.add(totalIngresos);

            BigDecimal pA = pOpt.map(p -> p.getPorcentajeAhorro() != null ? p.getPorcentajeAhorro() : BigDecimal.TEN)
                    .orElse(BigDecimal.TEN);
            BigDecimal pF = pOpt.map(p -> p.getPorcentajeFondoEmergencia() != null ? p.getPorcentajeFondoEmergencia() : new BigDecimal("5.00"))
                    .orElse(new BigDecimal("5.00"));

            BigDecimal montoAhorro = ingresosEfectivos.multiply(pA).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal montoFondo  = ingresosEfectivos.multiply(pF).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal presupuestoDisponible = ingresosEfectivos.subtract(montoAhorro).subtract(montoFondo);
            BigDecimal saldoReal = presupuestoDisponible.subtract(totalGastos);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("mesAno",               mesAno);
            row.put("totalIngresos",         ingresosEfectivos);
            row.put("montoAhorro",           montoAhorro);
            row.put("montoFondoEmergencia",  montoFondo);
            row.put("presupuestoDisponible", presupuestoDisponible);
            row.put("totalGastos",           totalGastos);
            row.put("saldo",                 ingresosEfectivos.subtract(totalGastos));
            row.put("saldoReal",             saldoReal);
            row.put("porcentajeAhorro",      pA);
            row.put("porcentajeFondo",       pF);
            row.put("tieneIngresosDetallados", totalIngresos.compareTo(BigDecimal.ZERO) > 0);
            return row;
        }).collect(Collectors.toList());
    }

    private BigDecimal proyectarAhorro(PresupuestoMensual p, List<Gasto> gastos) {
        if (p.getSalarioTotal() == null) return BigDecimal.ZERO;
        LocalDate hoy  = LocalDate.now();
        int diaActual  = hoy.getDayOfMonth();
        int diasMes    = hoy.lengthOfMonth();
        if (diaActual == 0) return p.getSalarioTotal();

        BigDecimal gastadoHoy = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diario = gastadoHoy.divide(BigDecimal.valueOf(diaActual), 2, RoundingMode.HALF_UP);
        BigDecimal proyeccionMes = diario.multiply(BigDecimal.valueOf(diasMes));
        return p.getSalarioTotal().subtract(proyeccionMes);
    }
}
