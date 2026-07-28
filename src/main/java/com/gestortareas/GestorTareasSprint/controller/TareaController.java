package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.TareaDTO;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaRepository tareaRepository;

    public TareaController(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @GetMapping
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findByUsuarioId(SecurityUtils.getCurrentUserId());
    }

    @PostMapping
    public Tarea agregarTarea(@RequestBody TareaDTO dto) {
        Tarea t = new Tarea();
        t.setUsuarioId(SecurityUtils.getCurrentUserId());
        return tareaRepository.save(mapearDto(dto, t));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerTarea(@PathVariable Long id) {
        return tareaRepository.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> editarTarea(@PathVariable Long id, @RequestBody TareaDTO dto) {
        return tareaRepository.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(tarea -> ResponseEntity.ok(tareaRepository.save(mapearDto(dto, tarea))))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/realizado")
    public ResponseEntity<Tarea> marcarRealizado(@PathVariable Long id,
                                                   @RequestBody Map<String, Boolean> body) {
        return tareaRepository.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(t -> {
                    t.setRealizado(body.getOrDefault("realizado", !t.isRealizado()));
                    return ResponseEntity.ok(tareaRepository.save(t));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Posponer recordatorio N minutos (por defecto 30) */
    @PatchMapping("/{id}/snooze")
    public ResponseEntity<Tarea> snooze(@PathVariable Long id,
                                         @RequestBody Map<String, Integer> body) {
        return tareaRepository.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(t -> {
                    int minutos = body.getOrDefault("minutos", 30);
                    t.setSnoozedUntil(new Date(System.currentTimeMillis() + (long) minutos * 60_000));
                    return ResponseEntity.ok(tareaRepository.save(t));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Detecta eventos del usuario que chocan en horario.
     * Retorna pares de tareas conflictivas (misma fecha, hora_inicio solapada).
     */
    @GetMapping("/conflictos")
    public List<Map<String, Object>> detectarConflictos() {
        Long uid = SecurityUtils.getCurrentUserId();

        List<Tarea> eventos = tareaRepository.findByUsuarioId(uid).stream()
                .filter(t -> "EVENTO".equals(t.getTipo())
                          && !t.isRealizado()
                          && t.getHoraInicio() != null
                          && t.getVencimiento() != null)
                .toList();

        List<Map<String, Object>> conflictos = new ArrayList<>();
        for (int i = 0; i < eventos.size(); i++) {
            for (int j = i + 1; j < eventos.size(); j++) {
                Tarea a = eventos.get(i);
                Tarea b = eventos.get(j);
                String fechaA = new java.text.SimpleDateFormat("yyyy-MM-dd").format(a.getVencimiento());
                String fechaB = new java.text.SimpleDateFormat("yyyy-MM-dd").format(b.getVencimiento());
                if (!fechaA.equals(fechaB)) continue;
                if (seSuperponen(a, b)) {
                    conflictos.add(Map.of("tareaA", a, "tareaB", b, "fecha", fechaA));
                }
            }
        }
        return conflictos;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        if (!tareaRepository.existsByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())) {
            return ResponseEntity.notFound().build();
        }
        tareaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ─────────────────────────────────────────────────────────────

    private Tarea mapearDto(TareaDTO dto, Tarea t) {
        t.setTitulo(dto.getTitulo());
        t.setDescripcion(dto.getDescripcion());
        t.setCategoria(dto.getCategoria());
        t.setPrioridad(dto.getPrioridad());
        t.setRealizado(dto.isRealizado());
        t.setTipo(dto.getTipo() != null ? dto.getTipo() : "TAREA");
        t.setHoraInicio(dto.getHoraInicio());
        t.setHoraFin(dto.getHoraFin());
        t.setEtiqueta(dto.getEtiqueta());
        t.setRecurrencia(dto.getRecurrencia() != null ? dto.getRecurrencia() : "NINGUNA");
        t.setIntervaloRecurrencia(dto.getIntervaloRecurrencia());
        t.setTextoNatural(dto.getTextoNatural());
        if (dto.getContactoId() != null) t.setContactoId(dto.getContactoId());

        // Merge fecha + hora en vencimiento para que los @Scheduled queries funcionen
        if (dto.getVencimiento() != null) {
            if (dto.getHoraInicio() != null && !dto.getHoraInicio().isBlank()) {
                try {
                    String[] partes = dto.getHoraInicio().split(":");
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(dto.getVencimiento());
                    cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(partes[0]));
                    cal.set(Calendar.MINUTE, Integer.parseInt(partes[1]));
                    cal.set(Calendar.SECOND, 0);
                    t.setVencimiento(cal.getTime());
                } catch (Exception ignored) {
                    t.setVencimiento(dto.getVencimiento());
                }
            } else {
                t.setVencimiento(dto.getVencimiento());
            }
        }
        return t;
    }

    /** Comprueba si dos eventos se superponen en tiempo (HH:MM strings) */
    private boolean seSuperponen(Tarea a, Tarea b) {
        int inicioA = toMinutos(a.getHoraInicio());
        int finA    = a.getHoraFin() != null ? toMinutos(a.getHoraFin()) : inicioA + 60;
        int inicioB = toMinutos(b.getHoraInicio());
        int finB    = b.getHoraFin() != null ? toMinutos(b.getHoraFin()) : inicioB + 60;
        return inicioA < finB && inicioB < finA;
    }

    private int toMinutos(String hhMM) {
        if (hhMM == null) return 0;
        String[] p = hhMM.split(":");
        return Integer.parseInt(p[0]) * 60 + Integer.parseInt(p[1]);
    }
}
