package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

// Anotación que marca esta clase como una entidad JPA (Java Persistence API),
// lo que significa que esta clase será mapeada a una tabla en la base de datos.
@Entity
public class Tarea {

    // Anotación que indica que este campo es la clave primaria de la entidad.
    @Id
    // Anotación que especifica que el valor de la clave primaria se generará automáticamente.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Atributos de la clase Tarea
    private String titulo; // Título de la tarea
    private String descripcion; // Descripción de la tarea

    // Método getter para obtener el valor de 'id'
    public Long getId() {
        return id;
    }

    // Método setter para establecer el valor de 'id'
    public void setId(Long id) {
        this.id = id;
    }

    // Método getter para obtener el valor de 'titulo'
    public String getTitulo() {
        return titulo;
    }

    // Método setter para establecer el valor de 'titulo'
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    // Método getter para obtener el valor de 'descripcion'
    public String getDescripcion() {
        return descripcion;
    }

    // Método setter para establecer el valor de 'descripcion'
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
