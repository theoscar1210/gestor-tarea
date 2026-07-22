package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificacionTareasService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionTareasService.class);

    private final TareaRepository tareaRepo;
    private final WebPushService  webPushService;

    public NotificacionTareasService(TareaRepository tareaRepo, WebPushService webPushService) {
        this.tareaRepo      = tareaRepo;
        this.webPushService = webPushService;
    }

    /** Cada mañana a las 8:00 — notifica tareas que vencen hoy */
    @Scheduled(cron = "0 0 8 * * *")
    public void notificarTareasDeHoy() {
        Date inicio = inicioDeHoy();
        Date fin    = manana(inicio);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(inicio, fin);
        if (tareas.isEmpty()) return;

        long alta  = tareas.stream().filter(t -> "alta".equalsIgnoreCase(t.getPrioridad())).count();
        String cuerpo = alta > 0
            ? alta + " de prioridad alta · " + tareas.size() + " en total"
            : tareas.size() + " tarea(s) vencen hoy";

        log.info("[Push] Enviando recordatorio diario: {} tareas hoy", tareas.size());
        webPushService.enviarATodos("📋 Tareas de hoy", cuerpo, "/tareas");
    }

    /** Cada hora — notifica tareas con prioridad alta que vencen en las próximas 2 h */
    @Scheduled(cron = "0 0 * * * *")
    public void notificarTareasAlta2h() {
        Date ahora = new Date();
        Date en2h  = new Date(ahora.getTime() + 2L * 3600_000);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(ahora, en2h)
                .stream()
                .filter(t -> "alta".equalsIgnoreCase(t.getPrioridad()))
                .toList();
        if (tareas.isEmpty()) return;

        String titulos = tareas.stream()
                .map(Tarea::getTitulo)
                .limit(2)
                .reduce((a, b) -> a + ", " + b)
                .orElse("");
        if (tareas.size() > 2) titulos += " y " + (tareas.size() - 2) + " más";

        log.info("[Push] Urgente: {} tareas alta prioridad vencen en 2 h", tareas.size());
        webPushService.enviarATodos("⚠️ Tarea(s) urgente(s)", titulos, "/tareas");
    }

    /** Cada día a las 20:00 — aviso de mañana para tareas de prioridad media/alta */
    @Scheduled(cron = "0 0 20 * * *")
    public void notificarManana() {
        Date inicio = manana(inicioDeHoy());
        Date fin    = manana(inicio);
        List<Tarea> tareas = tareaRepo.findPendientesVencimientoEntre(inicio, fin)
                .stream()
                .filter(t -> "alta".equalsIgnoreCase(t.getPrioridad())
                          || "media".equalsIgnoreCase(t.getPrioridad()))
                .toList();
        if (tareas.isEmpty()) return;

        log.info("[Push] Recordatorio nocturno: {} tareas mañana", tareas.size());
        webPushService.enviarATodos("🗓️ Tareas para mañana",
                tareas.size() + " tarea(s) con prioridad media/alta vencen mañana", "/tareas");
    }

    private static Date inicioDeHoy() {
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.set(java.util.Calendar.HOUR_OF_DAY, 0);
        cal.set(java.util.Calendar.MINUTE, 0);
        cal.set(java.util.Calendar.SECOND, 0);
        cal.set(java.util.Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    private static Date manana(Date hoy) {
        return new Date(hoy.getTime() + 86_400_000L);
    }
}
