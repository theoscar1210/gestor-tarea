package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.TareaDTO;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaRepository tareaRepository;

    public TareaController(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findAll();
    }

    @PostMapping
    public Tarea agregarTarea(@Valid @RequestBody TareaDTO dto) {
        return tareaRepository.save(mapearDto(dto, new Tarea()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerTarea(@PathVariable Long id) {
        return tareaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> editarTarea(@PathVariable Long id, @Valid @RequestBody TareaDTO dto) {
        return tareaRepository.findById(id)
                .map(tarea -> ResponseEntity.ok(tareaRepository.save(mapearDto(dto, tarea))))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        if (!tareaRepository.existsById(id)) return ResponseEntity.notFound().build();
        tareaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Tarea mapearDto(TareaDTO dto, Tarea tarea) {
        tarea.setTitulo(dto.getTitulo());
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setVencimiento(dto.getVencimiento());
        tarea.setCategoria(dto.getCategoria());
        tarea.setPrioridad(dto.getPrioridad());
        tarea.setRealizado(dto.isRealizado());
        return tarea;
    }
}
