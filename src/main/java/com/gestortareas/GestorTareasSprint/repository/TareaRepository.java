package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

// Interfaz que extiende JpaRepository para acceder a las operaciones CRUD básicas de la entidad Tarea.
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    
    // Aquí puedes definir consultas personalizadas si lo deseas.
    // JpaRepository ya proporciona métodos como save(), findAll(), findById(), delete() y otros.
}
