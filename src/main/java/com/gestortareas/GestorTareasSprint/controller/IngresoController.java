package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.IngresoDTO;
import com.gestortareas.GestorTareasSprint.model.Ingreso;
import com.gestortareas.GestorTareasSprint.model.TipoIngreso;
import com.gestortareas.GestorTareasSprint.repository.IngresoRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/ingresos")
public class IngresoController {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM");
    private final IngresoRepository repo;

    public IngresoController(IngresoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Ingreso> listar(@RequestParam(required = false) String mes) {
        Long userId = SecurityUtils.getCurrentUserId();
        String mesAno = mes != null ? mes : LocalDate.now().format(FMT);
        return repo.findByMesAnoAndUsuarioIdOrderByFechaDesc(mesAno, userId);
    }

    @PostMapping
    public ResponseEntity<Ingreso> crear(@RequestBody IngresoDTO dto) {
        if (dto.getDescripcion() == null || dto.getMonto() == null || dto.getTipo() == null) {
            return ResponseEntity.badRequest().build();
        }
        Long userId = SecurityUtils.getCurrentUserId();
        Ingreso ingreso = new Ingreso();
        ingreso.setDescripcion(dto.getDescripcion());
        ingreso.setMonto(dto.getMonto());
        LocalDate fecha = dto.getFecha() != null ? dto.getFecha() : LocalDate.now();
        ingreso.setFecha(fecha);
        ingreso.setTipo(TipoIngreso.valueOf(dto.getTipo()));
        ingreso.setMesAno(fecha.format(FMT));
        ingreso.setUsuarioId(userId);
        return ResponseEntity.ok(repo.save(ingreso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        Ingreso ing = repo.findById(id).get();
        if (!userId.equals(ing.getUsuarioId())) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
