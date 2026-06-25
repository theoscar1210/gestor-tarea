package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.ObligacionDTO;
import com.gestortareas.GestorTareasSprint.model.HistorialPago;
import com.gestortareas.GestorTareasSprint.model.Obligacion;
import com.gestortareas.GestorTareasSprint.service.ObligacionesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/obligaciones")
@CrossOrigin(origins = "http://localhost:3000")
public class ObligacionesController {

    private final ObligacionesService service;

    public ObligacionesController(ObligacionesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> obtenerTodas() {
        return service.obtenerTodas().stream()
                .map(this::enriquecerConDias)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ObligacionDTO dto) {
        try {
            return ResponseEntity.ok(service.crear(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public Obligacion actualizar(@PathVariable Long id, @RequestBody ObligacionDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @GetMapping("/proximas")
    public List<Map<String, Object>> obtenerProximas() {
        return service.obtenerProximas(5).stream()
                .map(this::enriquecerConDias)
                .collect(Collectors.toList());
    }

    @PatchMapping("/{id}/pagar")
    public HistorialPago registrarPago(@PathVariable Long id) {
        return service.registrarPago(id);
    }

    // Añade diasRestantes al JSON de respuesta
    private Map<String, Object> enriquecerConDias(Obligacion o) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id",              o.getId());
        map.put("nombre",          o.getNombre());
        map.put("tipo",            o.getTipo());
        map.put("monto",           o.getMonto());
        map.put("diaVencimiento",  o.getDiaVencimiento());
        map.put("activo",          o.getActivo());
        map.put("createdAt",       o.getCreatedAt());
        map.put("diasRestantes",   service.calcularDiasRestantes(o));
        return map;
    }
}
