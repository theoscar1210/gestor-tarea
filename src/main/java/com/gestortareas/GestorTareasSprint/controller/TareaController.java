package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.TareaRequestDto;
import com.gestortareas.GestorTareasSprint.exception.ResourceNotFoundException;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<Tarea> agregarTarea(@Valid @RequestBody TareaRequestDto request) {
        Tarea tarea = mapToEntity(new Tarea(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(tareaRepository.save(tarea));
    }

    @GetMapping("/{id}")
    public Tarea obtenerTarea(@PathVariable Long id) {
        return tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la tarea con id " + id));
    }

    @PutMapping("/{id}")
    public Tarea editarTarea(@PathVariable Long id, @Valid @RequestBody TareaRequestDto request) {
        Tarea existente = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la tarea con id " + id));

        Tarea actualizada = mapToEntity(existente, request);
        actualizada.setId(id);
        return tareaRepository.save(actualizada);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarTarea(@PathVariable Long id) {
        Tarea existente = tareaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la tarea con id " + id));
        tareaRepository.delete(existente);
    }

    private Tarea mapToEntity(Tarea target, TareaRequestDto request) {
        target.setTitulo(request.getTitulo().trim());
        target.setDescripcion(request.getDescripcion().trim());
        target.setCategoria(request.getCategoria());
        target.setRealizado(Boolean.TRUE.equals(request.getRealizado()));

        if (request.getVencimiento() != null) {
            target.setVencimiento(Date.valueOf(request.getVencimiento()));
        } else {
            target.setVencimiento(null);
        }

        return target;
    }
}
