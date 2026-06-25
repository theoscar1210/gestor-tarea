package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.ListaMercadoDTO;
import com.gestortareas.GestorTareasSprint.model.ListaMercado;
import com.gestortareas.GestorTareasSprint.service.ListaMercadoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lista-mercado")
@CrossOrigin(origins = "http://localhost:3000")
public class ListaMercadoController {

    private final ListaMercadoService service;

    public ListaMercadoController(ListaMercadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ListaMercado> obtenerTodos() {
        return service.obtenerTodos();
    }

    @PostMapping
    public ListaMercado agregar(@RequestBody ListaMercadoDTO dto) {
        return service.agregar(dto);
    }

    @PostMapping("/voz")
    public ResponseEntity<List<ListaMercado>> agregarPorVoz(@RequestBody Map<String, String> body) {
        try {
            List<ListaMercado> lista = service.agregarPorVoz(body.get("texto"));
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/comprado")
    public ListaMercado marcarComprado(@PathVariable Long id) {
        return service.marcarComprado(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
