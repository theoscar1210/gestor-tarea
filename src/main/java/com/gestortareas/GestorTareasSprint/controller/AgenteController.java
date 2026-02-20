package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.MensajeRequest;
import com.gestortareas.GestorTareasSprint.service.AgenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agente")
@CrossOrigin(origins = "*")
public class AgenteController {

    private final AgenteService agenteService;

    public AgenteController(AgenteService agenteService) {
        this.agenteService = agenteService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody MensajeRequest request) {
        try {
            String respuesta = agenteService.chat(request.getMensaje());
            return ResponseEntity.ok(Map.of("respuesta", respuesta));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("respuesta", "Lo siento, hubo un error al procesar tu mensaje."));
        }
    }
}
