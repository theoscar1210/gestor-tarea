package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plantilla_rutina")
public class PlantillaRutina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    /**
     * JSON array de plantillas de tarea:
     * [{ "titulo": "Revisar correo", "prioridad": "media", "etiqueta": "TRABAJO", "horaInicio": "09:00" }, ...]
     */
    @Column(name = "tareas_json", columnDefinition = "TEXT")
    private String tareasJson;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getTareasJson() { return tareasJson; }
    public void setTareasJson(String tareasJson) { this.tareasJson = tareasJson; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
