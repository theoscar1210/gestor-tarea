package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.UbicacionRecordatorio;
import com.gestortareas.GestorTareasSprint.repository.UbicacionRecordatorioRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ubicaciones")
public class UbicacionRecordatorioController {

    private final UbicacionRecordatorioRepository repo;

    public UbicacionRecordatorioController(UbicacionRecordatorioRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<UbicacionRecordatorio> listar() {
        return repo.findByUsuarioIdAndActivaTrue(SecurityUtils.getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UbicacionRecordatorio crear(@RequestBody UbicacionRecordatorio u) {
        u.setId(null);
        u.setUsuarioId(SecurityUtils.getCurrentUserId());
        return repo.save(u);
    }

    @PatchMapping("/{id}/activa")
    public ResponseEntity<UbicacionRecordatorio> toggleActiva(@PathVariable Long id,
                                                               @RequestBody Map<String, Boolean> body) {
        return repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(u -> {
                    u.setActiva(body.getOrDefault("activa", !u.isActiva()));
                    return ResponseEntity.ok(repo.save(u));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId()).ifPresent(repo::delete);
    }
}
