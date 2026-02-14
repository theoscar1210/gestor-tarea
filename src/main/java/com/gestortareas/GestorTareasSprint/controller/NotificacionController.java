package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.NotificacionRequestDto;
import com.gestortareas.GestorTareasSprint.model.Notificacion;
import com.gestortareas.GestorTareasSprint.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*")
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
    public ResponseEntity<Notificacion> crear(@Valid @RequestBody NotificacionRequestDto request) {
        Notificacion notificacion = new Notificacion();
        notificacion.setMensaje(request.getMensaje().trim());
        notificacion.setTipo(request.getTipo().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.guardar(notificacion));
    }
}
