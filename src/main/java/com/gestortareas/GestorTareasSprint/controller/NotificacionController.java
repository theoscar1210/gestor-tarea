package com.gestortareas.GestorTareasSprint.controller;

// src/main/java/com/tuapp/controller/NotificacionController.java

import com.gestortareas.GestorTareasSprint.model.Notificacion;
import com.gestortareas.GestorTareasSprint.service.NotificacionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*") // o tu dominio
public class NotificacionController {

    private final NotificacionService service;

    public NotificacionController(NotificacionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Notificacion> obtenerTodas() {
        return service.obtenerTodas();
    }

    @PostMapping
    public Notificacion crear(@RequestBody Notificacion notificacion) {
        return service.guardar(notificacion);
    }
}
