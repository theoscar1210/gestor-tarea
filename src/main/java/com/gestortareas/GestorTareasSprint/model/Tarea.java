package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Date;

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
    private Date vencimiento; // Fecha de vencimiento de la tarea
    private String categoria; // Categoría de la tarea
    private String prioridad; // Prioridad de la tarea (alta, media, baja)
    private boolean realizado; // Estado de la tarea (realizada o no)
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
    //Metodo setter para establecer el vencimiento
    public Date getVencimiento() {
        return vencimiento;
    }
    // Método setter para establecer la fecha de vencimiento de la tarea
    // Este método recibe un objeto Date que representa la nueva fecha de vencimiento.
    public void setVencimiento(Date vencimiento) {
        this.vencimiento = vencimiento;
    }
    // Método getter para obtener el valor de 'categoria'
    public String getCategoria() {
        return categoria;
    }
// Método setter para establecer la categoría de la tarea
    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
// Método getter para obtener la prioridad de la tarea
    public String getPrioridad() {
        return prioridad;
    }
// Método setter para establecer la prioridad de la tarea
    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }
// Método getter para obtener el valor de 'realizado'
    // Este método devuelve un valor booleano que indica si la tarea ha sido realizada o no.
    public boolean isRealizado() {
        return realizado;
    }
// Método setter para establecer el estado de 'realizado'
    public void setRealizado(boolean realizado) {
        this.realizado = realizado;
}
}
