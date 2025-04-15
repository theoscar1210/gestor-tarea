package com.gestortareas.GestorTareasSprint.service;



import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;

    public TareaService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    public Tarea crearTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    public List<Tarea> listarTareas() {
        return tareaRepository.findAll();
    }

    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }
}
