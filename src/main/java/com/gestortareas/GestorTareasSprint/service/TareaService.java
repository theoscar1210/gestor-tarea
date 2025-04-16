package com.gestortareas.GestorTareasSprint.service;



import com.gestortareas.GestorTareasSprint.model.Tarea;


import java.util.List;

public interface TareaService {
    List<Tarea> obtenerTodas();
    Tarea guardar(Tarea tarea);
    void eliminar(Long id);
}
