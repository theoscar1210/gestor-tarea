package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.GastoDTO;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

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
    private static final DateTimeFormatter    FORMATO_MES = DateTimeFormatter.ofPattern("yyyy-MM");

    public PresupuestoService(PresupuestoMensualRepository presupuestoRepo,
                               CategoriaGastoRepository categoriaRepo,
                               GastoRepository gastoRepo) {
        this.presupuestoRepo = presupuestoRepo;
        this.categoriaRepo   = categoriaRepo;
        this.gastoRepo       = gastoRepo;
    }

    // Seed de categorías 50/30/20 si la tabla está vacía
    @PostConstruct
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

    public List<CategoriaGasto> obtenerCategorias() {
        return categoriaRepo.findAll();
    }

    public PresupuestoMensual crearPresupuesto(String mesAno, BigDecimal salario) {
        PresupuestoMensual p = presupuestoRepo.findByMesAno(mesAno)
                .orElse(new PresupuestoMensual());
        p.setMesAno(mesAno);
        p.setSalarioTotal(salario);
        p.setCreatedAt(java.time.LocalDateTime.now());
        return presupuestoRepo.save(p);
    }

    public Map<String, Object> obtenerResumen(String mesAno) {
        PresupuestoMensual p = presupuestoRepo.findByMesAno(mesAno)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para: " + mesAno));

        List<Gasto> gastos = gastoRepo.findByPresupuestoId(p.getId());
        BigDecimal totalGastado = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal disponible    = p.getSalarioTotal().subtract(totalGastado);
        BigDecimal porcentajeEjec = p.getSalarioTotal().compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : totalGastado.divide(p.getSalarioTotal(), 4, RoundingMode.HALF_UP)
                              .multiply(BigDecimal.valueOf(100));

        // Agrupación por categoría
        Map<String, BigDecimal> porCategoria = gastos.stream().collect(
                Collectors.groupingBy(
                        g -> g.getCategoria().getNombre(),
                        Collectors.reducing(BigDecimal.ZERO, Gasto::getMonto, BigDecimal::add)
                ));

        // Proyección de ahorro al cierre del mes
        BigDecimal ahorroProyectado = proyectarAhorro(p, gastos);

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("presupuesto",     p);
        resumen.put("gastos",          gastos);
        resumen.put("totalGastado",    totalGastado);
        resumen.put("disponible",      disponible);
        resumen.put("porcentajeEjec",  porcentajeEjec);
        resumen.put("porCategoria",    porCategoria);
        resumen.put("ahorroProyectado",ahorroProyectado);
        return resumen;
    }

    public Gasto agregarGasto(Long presupuestoId, GastoDTO dto) {
        PresupuestoMensual p = presupuestoRepo.findById(presupuestoId)
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

    public Map<String, Object> obtenerProyeccion(String mesAno) {
        PresupuestoMensual p = presupuestoRepo.findByMesAno(mesAno)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado para: " + mesAno));
        List<Gasto> gastos = gastoRepo.findByPresupuestoId(p.getId());

        LocalDate hoy        = LocalDate.now();
        int diasMes          = hoy.lengthOfMonth();
        int diaActual        = hoy.getDayOfMonth();

        BigDecimal gastadoHoy = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal gastoDiarioPromedio = diaActual > 0
                ? gastadoHoy.divide(BigDecimal.valueOf(diaActual), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal proyeccionTotal = gastoDiarioPromedio.multiply(BigDecimal.valueOf(diasMes));
        BigDecimal ahorroProyectado = p.getSalarioTotal().subtract(proyeccionTotal);

        // Puntos para la gráfica (día → gasto acumulado real)
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

    private BigDecimal proyectarAhorro(PresupuestoMensual p, List<Gasto> gastos) {
        LocalDate hoy      = LocalDate.now();
        int diaActual      = hoy.getDayOfMonth();
        int diasMes        = hoy.lengthOfMonth();
        if (diaActual == 0) return p.getSalarioTotal();

        BigDecimal gastadoHoy = gastos.stream()
                .map(Gasto::getMonto)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal diario = gastadoHoy.divide(BigDecimal.valueOf(diaActual), 2, RoundingMode.HALF_UP);
        BigDecimal proyeccionMes = diario.multiply(BigDecimal.valueOf(diasMes));
        return p.getSalarioTotal().subtract(proyeccionMes);
    }
}
