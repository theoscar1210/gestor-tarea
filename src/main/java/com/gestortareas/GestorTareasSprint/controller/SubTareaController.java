package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.SubTarea;
import com.gestortareas.GestorTareasSprint.repository.SubTareaRepository;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tareas/{tareaId}/subtareas")
public class SubTareaController {

    private final SubTareaRepository subRepo;
    private final TareaRepository tareaRepo;

    public SubTareaController(SubTareaRepository subRepo, TareaRepository tareaRepo) {
        this.subRepo  = subRepo;
        this.tareaRepo = tareaRepo;
    }

    @GetMapping
    public ResponseEntity<List<SubTarea>> listar(@PathVariable Long tareaId) {
        Long uid = SecurityUtils.getCurrentUserId();
        if (tareaRepo.findByIdAndUsuarioId(tareaId, uid).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subRepo.findByTareaIdAndUsuarioIdOrderByOrden(tareaId, uid));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<SubTarea> agregar(@PathVariable Long tareaId,
                                             @RequestBody Map<String, Object> body) {
        Long uid = SecurityUtils.getCurrentUserId();
        if (tareaRepo.findByIdAndUsuarioId(tareaId, uid).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        SubTarea s = new SubTarea();
        s.setTareaId(tareaId);
        s.setDescripcion((String) body.get("descripcion"));
        s.setOrden(body.containsKey("orden") ? ((Number) body.get("orden")).intValue() : 0);
        s.setUsuarioId(uid);
        return ResponseEntity.status(HttpStatus.CREATED).body(subRepo.save(s));
    }

    @PatchMapping("/{id}/completada")
    public ResponseEntity<SubTarea> marcar(@PathVariable Long tareaId,
                                            @PathVariable Long id,
                                            @RequestBody Map<String, Boolean> body) {
        Long uid = SecurityUtils.getCurrentUserId();
        return subRepo.findByIdAndUsuarioId(id, uid)
                .filter(s -> s.getTareaId().equals(tareaId))
                .map(s -> {
                    s.setCompletada(body.containsKey("completada") ? body.get("completada") : !s.isCompletada());
                    return ResponseEntity.ok(subRepo.save(s));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long tareaId, @PathVariable Long id) {
        Long uid = SecurityUtils.getCurrentUserId();
        subRepo.findByIdAndUsuarioId(id, uid)
               .filter(s -> s.getTareaId().equals(tareaId))
               .ifPresent(subRepo::delete);
    }

    @Transactional
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarTodas(@PathVariable Long tareaId) {
        Long uid = SecurityUtils.getCurrentUserId();
        if (tareaRepo.findByIdAndUsuarioId(tareaId, uid).isPresent()) {
            subRepo.deleteByTareaIdAndUsuarioId(tareaId, uid);
        }
    }
}
