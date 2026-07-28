package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class NotificacionTareasService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionTareasService.class);

    private final TareaRepository tareaRepo;
    private final WebPushService  webPushService;

    // Evita enviar el mismo recordatorio en cascada varias veces por el mismo evento
    private final Set<String> notificados15min = ConcurrentHashMap.newKeySet();
    private final Set<String> notificados2h    = ConcurrentHashMap.newKeySet();

    public NotificacionTareasService(TareaRepository tareaRepo, WebPushService webPushService) {
        this.tareaRepo      = tareaRepo;
        this.webPushService = webPushService;
    }

    /** 8:00 AM — resumen diario: "Hoy tienes 3 cosas: cita 10am, pago vence, …" */
    @Scheduled(cron = "0 0 8 * * *")
    public void notificarResumenDiario() {
        Date inicio = inicioDeHoy();
        Date fin    = sumarHoras(inicio, 24);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(inicio, fin);
        if (tareas.isEmpty()) return;

        long eventos = tareas.stream().filter(t -> "EVENTO".equals(t.getTipo())).count();
        long alta    = tareas.stream().filter(t -> "alta".equalsIgnoreCase(t.getPrioridad())).count();

        StringBuilder cuerpo = new StringBuilder("Hoy tienes " + tareas.size() + " cosa(s)");
        if (eventos > 0) cuerpo.append(": ").append(eventos).append(" evento(s) con hora fija");
        if (alta > 0)    cuerpo.append(", ").append(alta).append(" de prioridad alta");

        // Primeros 2 títulos
        tareas.stream()
              .filter(t -> "EVENTO".equals(t.getTipo()) && t.getHoraInicio() != null)
              .limit(2)
              .forEach(t -> cuerpo.append(". ").append(t.getHoraInicio()).append(" ").append(t.getTitulo()));

        log.info("[Push] Resumen diario: {} tareas hoy", tareas.size());
        webPushService.enviarATodos("📋 Resumen del día", cuerpo.toString(), "/tareas");

        // Limpiar sets de deduplicación del día anterior
        notificados15min.clear();
        notificados2h.clear();
    }

    /** Cada 5 min — 15 minutos antes del evento (solo EVENTO con hora) */
    @Scheduled(cron = "0 */5 * * * *")
    public void notificarEventoEn15min() {
        Date ahora  = new Date();
        Date en15   = sumarMinutos(ahora, 15);
        Date en20   = sumarMinutos(ahora, 20);
        List<Tarea> proximos = tareaRepo.findPendientesVencimientoEntre(en15, en20)
                .stream()
                .filter(t -> "EVENTO".equals(t.getTipo()) && t.getHoraInicio() != null)
                .toList();
        for (Tarea t : proximos) {
            String key = t.getId() + "-15min-" + t.getHoraInicio();
            if (notificados15min.add(key)) {
                log.info("[Push] 15min antes: {}", t.getTitulo());
                webPushService.enviarATodos(
                    "⏰ En 15 minutos: " + t.getTitulo(),
                    t.getHoraInicio() + " — " + (t.getDescripcion() != null ? t.getDescripcion() : ""),
                    "/tareas"
                );
            }
        }
    }

    /** Cada hora — 2 horas antes de tareas/eventos de prioridad alta */
    @Scheduled(cron = "0 0 * * * *")
    public void notificarEn2h() {
        Date ahora = new Date();
        Date en2h  = sumarHoras(ahora, 2);
        Date en2h5 = sumarMinutos(en2h, 5);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(en2h, en2h5)
                .stream()
                .filter(t -> "alta".equalsIgnoreCase(t.getPrioridad())
                          || "URGENTE".equalsIgnoreCase(t.getEtiqueta()))
                .toList();
        for (Tarea t : tareas) {
            String key = t.getId() + "-2h";
            if (notificados2h.add(key)) {
                log.info("[Push] 2h antes urgente: {}", t.getTitulo());
                webPushService.enviarATodos(
                    "⚠️ En 2 horas: " + t.getTitulo(),
                    "Prioridad alta — no olvides prepararte",
                    "/tareas"
                );
            }
        }
    }

    /** 8:00 PM — avance de mañana */
    @Scheduled(cron = "0 0 20 * * *")
    public void notificarManana() {
        Date inicio = sumarHoras(inicioDeHoy(), 24);
        Date fin    = sumarHoras(inicio, 24);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(inicio, fin)
                .stream()
                .filter(t -> "alta".equalsIgnoreCase(t.getPrioridad())
                          || "media".equalsIgnoreCase(t.getPrioridad())
                          || "URGENTE".equalsIgnoreCase(t.getEtiqueta())
                          || "IMPORTANTE".equalsIgnoreCase(t.getEtiqueta()))
                .toList();
        if (tareas.isEmpty()) return;

        String lista = tareas.stream()
                .limit(3)
                .map(t -> (t.getHoraInicio() != null ? t.getHoraInicio() + " " : "") + t.getTitulo())
                .reduce((a, b) -> a + " · " + b)
                .orElse("");

        log.info("[Push] Resumen mañana: {} tareas", tareas.size());
        webPushService.enviarATodos(
            "🗓️ Mañana tienes " + tareas.size() + " tarea(s)",
            lista,
            "/tareas"
        );
    }

    // ── Helpers ───────────────────────────────────────────────

    private static Date inicioDeHoy() {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    private static Date sumarHoras(Date base, int horas) {
        return new Date(base.getTime() + (long) horas * 3_600_000L);
    }

    private static Date sumarMinutos(Date base, int minutos) {
        return new Date(base.getTime() + (long) minutos * 60_000L);
    }
}
