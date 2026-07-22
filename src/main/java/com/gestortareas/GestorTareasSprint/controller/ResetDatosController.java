package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.service.ResetDatosService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/datos")
public class ResetDatosController {

    private static final Logger log = LoggerFactory.getLogger(ResetDatosController.class);

    private final ResetDatosService resetService;

    public ResetDatosController(ResetDatosService resetService) {
        this.resetService = resetService;
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetearTodo() {
        try {
            resetService.resetearTodo();
            return ResponseEntity.ok(Map.of("mensaje", "Todos los datos fueron eliminados correctamente"));
        } catch (Exception e) {
            log.error("[Reset] Error durante el borrado de datos: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
