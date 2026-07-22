package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.service.ResetDatosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/datos")
public class ResetDatosController {

    private final ResetDatosService resetService;

    public ResetDatosController(ResetDatosService resetService) {
        this.resetService = resetService;
    }

    @DeleteMapping("/reset")
    public ResponseEntity<?> resetearTodo() {
        resetService.resetearTodo();
        return ResponseEntity.ok(Map.of("mensaje", "Todos los datos fueron eliminados correctamente"));
    }
}
