// src/main/java/com/tuapp/model/Notificacion.java
package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mensaje;

    private String tipo;

    private LocalDateTime fecha = LocalDateTime.now();

    // Getters y Setters
    // (puedes usar Lombok si quieres simplificar)
}
