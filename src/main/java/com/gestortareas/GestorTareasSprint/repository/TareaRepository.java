package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // Aquí puedes definir consultas personalizadas si lo deseas
}
