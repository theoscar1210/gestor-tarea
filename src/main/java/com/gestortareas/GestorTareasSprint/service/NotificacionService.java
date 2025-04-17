package com.gestortareas.GestorTareasSprint.service;
// src/main/java/com/tuapp/service/NotificacionService.java


import com.gestortareas.GestorTareasSprint.model.Notificacion;
import com.gestortareas.GestorTareasSprint.repository.NotificacionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService {

    private final NotificacionRepository repository;

    public NotificacionService(NotificacionRepository repository) {
        this.repository = repository;
    }

    public List<Notificacion> obtenerTodas() {
        return repository.findAll();
    }

    public Notificacion guardar(Notificacion notificacion) {
        return repository.save(notificacion);
    }
}
