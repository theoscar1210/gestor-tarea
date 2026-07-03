package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.PorcentajesDTO;
import com.gestortareas.GestorTareasSprint.dto.RetiroFondoDTO;
import com.gestortareas.GestorTareasSprint.model.MovimientoFondo;
import com.gestortareas.GestorTareasSprint.model.PresupuestoMensual;
import com.gestortareas.GestorTareasSprint.service.FondosService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fondos")
public class FondosController {

    private final FondosService service;

    public FondosController(FondosService service) {
        this.service = service;
    }

    /** Balance acumulado histórico de ambos fondos */
    @GetMapping("/balance")
    public Map<String, Object> obtenerBalance() {
        return service.obtenerBalance();
    }

    /** Lista todos los movimientos (retiros) */
    @GetMapping("/movimientos")
    public List<MovimientoFondo> obtenerMovimientos() {
        return service.obtenerBalance().containsKey("movimientos")
                ? (List<MovimientoFondo>) service.obtenerBalance().get("movimientos")
                : List.of();
    }

    /** Registra un retiro del fondo de ahorro o emergencia */
    @PostMapping("/retiro")
    public ResponseEntity<?> registrarRetiro(@Valid @RequestBody RetiroFondoDTO dto) {
        try {
            return ResponseEntity.ok(service.registrarRetiro(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** Actualiza los porcentajes de ahorro y fondo para un mes */
    @PatchMapping("/porcentajes/{mesAno}")
    public PresupuestoMensual actualizarPorcentajes(
            @PathVariable String mesAno,
            @Valid @RequestBody PorcentajesDTO dto) {
        return service.actualizarPorcentajes(mesAno, dto);
    }
}
