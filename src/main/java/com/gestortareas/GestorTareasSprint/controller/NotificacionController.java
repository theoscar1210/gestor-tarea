package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.NotificacionDTO;
import com.gestortareas.GestorTareasSprint.model.Notificacion;
import com.gestortareas.GestorTareasSprint.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
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
    public Notificacion crear(@Valid @RequestBody NotificacionDTO dto) {
        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje(dto.getMensaje());
        notificacion.setTipo(dto.getTipo());
        return service.guardar(notificacion);
    }
}
