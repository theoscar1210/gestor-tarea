package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.GastoDTO;
import com.gestortareas.GestorTareasSprint.dto.PresupuestoDTO;
import com.gestortareas.GestorTareasSprint.model.CategoriaGasto;
import com.gestortareas.GestorTareasSprint.model.Gasto;
import com.gestortareas.GestorTareasSprint.model.PresupuestoMensual;
import com.gestortareas.GestorTareasSprint.repository.GastoRepository;
import com.gestortareas.GestorTareasSprint.service.PresupuestoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/presupuesto")
public class PresupuestoController {

    private final PresupuestoService service;
    private final GastoRepository    gastoRepo;
    private static final DateTimeFormatter FORMATO_MES = DateTimeFormatter.ofPattern("yyyy-MM");

    public PresupuestoController(PresupuestoService service, GastoRepository gastoRepo) {
        this.service   = service;
        this.gastoRepo = gastoRepo;
    }

    @GetMapping("/categorias")
    public List<CategoriaGasto> obtenerCategorias() {
        return service.obtenerCategorias();
    }

    @PostMapping
    public PresupuestoMensual crearPresupuesto(@Valid @RequestBody PresupuestoDTO dto) {
        return service.crearPresupuesto(dto.getMesAno(), dto.getSalarioTotal());
    }

    @GetMapping("/actual")
    public Map<String, Object> obtenerActual() {
        String mesActual = LocalDate.now().format(FORMATO_MES);
        return service.obtenerResumen(mesActual);
    }

    @GetMapping("/{mesAno}")
    public Map<String, Object> obtenerPorMes(
            @PathVariable
            @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "Formato debe ser yyyy-MM")
            String mesAno) {
        return service.obtenerResumen(mesAno);
    }

    @PostMapping("/{id}/gastos")
    public Gasto agregarGasto(@PathVariable Long id, @Valid @RequestBody GastoDTO dto) {
        return service.agregarGasto(id, dto);
    }

    @GetMapping("/proyeccion")
    public Map<String, Object> obtenerProyeccion() {
        String mesActual = LocalDate.now().format(FORMATO_MES);
        return service.obtenerProyeccion(mesActual);
    }

    @GetMapping("/historial")
    public List<Map<String, Object>> obtenerHistorial(
            @RequestParam(defaultValue = "6") int meses) {
        return service.obtenerHistorial(meses);
    }

    @DeleteMapping("/gastos/{id}")
    public ResponseEntity<Void> eliminarGasto(@PathVariable Long id) {
        if (!gastoRepo.existsById(id)) return ResponseEntity.notFound().build();
        gastoRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
