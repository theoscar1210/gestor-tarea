package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import java.util.List;

// Esta interfaz define los métodos del servicio para manejar tareas.
public interface TareaService {
    
    // Método para obtener todas las tareas.
    List<Tarea> obtenerTodas();
    
    // Método para guardar una nueva tarea o actualizar una existente.
    Tarea guardar(Tarea tarea);
    
    // Método para eliminar una tarea por su id.
    void eliminar(Long id);
}
