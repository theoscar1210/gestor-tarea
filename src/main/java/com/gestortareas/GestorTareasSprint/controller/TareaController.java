package com.gestortareas.GestorTareasSprint.controller;


import com.gestortareas.GestorTareasSprint.model.Tarea;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    // Obtener todas las tareas
    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findAll();
    }

    // Crear una nueva tarea
    @PostMapping
    public Tarea agregarTarea(@RequestBody Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Obtener una tarea por ID
    @GetMapping("/{id}")
    public Optional<Tarea> obtenerTarea(@PathVariable Long id) {
        return tareaRepository.findById(id);
    }

    // Editar una tarea existente
    @PutMapping("/{id}")
    public Tarea editarTarea(@PathVariable Long id, @RequestBody Tarea tarea) {
        tarea.setId(id);
        return tareaRepository.save(tarea);
    }

    // Eliminar una tarea
    @DeleteMapping("/{id}")
    public void eliminarTarea(@PathVariable Long id) {
        tareaRepository.deleteById(id);
    }
}
