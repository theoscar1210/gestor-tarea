package com.gestortareas.GestorTareasSprint.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestortareas.GestorTareasSprint.model.PlantillaRutina;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.PlantillaRutinaRepository;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/plantillas")
public class PlantillaRutinaController {

    private final PlantillaRutinaRepository repo;
    private final TareaRepository tareaRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public PlantillaRutinaController(PlantillaRutinaRepository repo, TareaRepository tareaRepo) {
        this.repo     = repo;
        this.tareaRepo = tareaRepo;
    }

    @GetMapping
    public List<PlantillaRutina> listar() {
        return repo.findByUsuarioId(SecurityUtils.getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlantillaRutina crear(@RequestBody PlantillaRutina p) {
        p.setId(null);
        p.setUsuarioId(SecurityUtils.getCurrentUserId());
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantillaRutina> editar(@PathVariable Long id, @RequestBody PlantillaRutina body) {
        return repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(p -> {
                    p.setNombre(body.getNombre());
                    p.setDescripcion(body.getDescripcion());
                    p.setTareasJson(body.getTareasJson());
                    return ResponseEntity.ok(repo.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId()).ifPresent(repo::delete);
    }

    /** Aplica la plantilla: crea tareas para la fecha indicada */
    @PostMapping("/{id}/aplicar")
    public ResponseEntity<?> aplicar(@PathVariable Long id,
                                     @RequestBody Map<String, String> body) {
        Long uid = SecurityUtils.getCurrentUserId();
        return repo.findByIdAndUsuarioId(id, uid)
                .map(p -> {
                    try {
                        List<Map<String, Object>> plantillas =
                                mapper.readValue(p.getTareasJson(), new TypeReference<>() {});

                        String fechaStr = body.getOrDefault("fecha", "");
                        Date fecha = fechaStr.isBlank()
                                ? new Date()
                                : new SimpleDateFormat("yyyy-MM-dd").parse(fechaStr);

                        List<Tarea> creadas = new ArrayList<>();
                        for (Map<String, Object> t : plantillas) {
                            Tarea tarea = new Tarea();
                            tarea.setTitulo((String) t.getOrDefault("titulo", "Tarea"));
                            tarea.setPrioridad((String) t.getOrDefault("prioridad", "media"));
                            tarea.setEtiqueta((String) t.get("etiqueta"));
                            tarea.setHoraInicio((String) t.get("horaInicio"));
                            tarea.setTipo(t.get("horaInicio") != null ? "EVENTO" : "TAREA");
                            tarea.setCategoria((String) t.get("categoria"));
                            tarea.setVencimiento(fecha);
                            tarea.setUsuarioId(uid);
                            creadas.add(tareaRepo.save(tarea));
                        }
                        return ResponseEntity.ok(creadas);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                .body(Map.of("error", "Error al parsear plantilla: " + e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
