package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Obligacion;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.HistorialPagoRepository;
import com.gestortareas.GestorTareasSprint.repository.ObligacionRepository;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);
    private static final DateTimeFormatter MES_FMT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final TareaRepository tareaRepo;
    private final ObligacionRepository obligacionRepo;
    private final HistorialPagoRepository historialRepo;
    private final WebPushService pushService;

    public NotificationScheduler(TareaRepository tareaRepo,
                                  ObligacionRepository obligacionRepo,
                                  HistorialPagoRepository historialRepo,
                                  WebPushService pushService) {
        this.tareaRepo   = tareaRepo;
        this.obligacionRepo = obligacionRepo;
        this.historialRepo  = historialRepo;
        this.pushService    = pushService;
    }

    // Todos los días a las 8 AM hora Colombia (UTC-5 → 13:00 UTC)
    @Scheduled(cron = "0 0 13 * * *")
    public void enviarRecordatorios() {
        log.info("[Scheduler] Enviando recordatorios push...");
        notificarTareas();
        notificarObligaciones();
    }

    private void notificarTareas() {
        Date hoy   = startOfDay(0);
        Date pasado = startOfDay(2);
        List<Tarea> proximas = tareaRepo.findPendientesVencimientoEntre(hoy, pasado);
        if (proximas.isEmpty()) return;

        long hoy0 = startOfDay(0).getTime();
        long hoy1 = startOfDay(1).getTime();

        long vencenHoy    = proximas.stream().filter(t -> t.getVencimiento().getTime() < hoy1).count();
        long vencenManana = proximas.stream().filter(t -> t.getVencimiento().getTime() >= hoy1).count();

        String cuerpo = construirCuerpoTareas(vencenHoy, vencenManana);
        pushService.enviarATodos("📋 FIN TASK — Tareas pendientes", cuerpo, "/tareas");
    }

    private void notificarObligaciones() {
        LocalDate hoy = LocalDate.now();
        String mesActual = hoy.format(MES_FMT);
        int diaHoy = hoy.getDayOfMonth();

        Set<Long> pagadasIds = historialRepo.findByMesAnoAndPagadoTrue(mesActual)
                .stream().map(h -> h.getObligacion().getId()).collect(Collectors.toSet());

        List<Obligacion> proximas = obligacionRepo.findByActivoTrue().stream()
                .filter(o -> !pagadasIds.contains(o.getId()))
                .filter(o -> {
                    int dia = o.getDiaVencimiento();
                    return dia >= diaHoy && dia <= diaHoy + 3;
                })
                .collect(Collectors.toList());

        if (proximas.isEmpty()) return;

        String nombres = proximas.stream().limit(2).map(Obligacion::getNombre).collect(Collectors.joining(", "));
        String cuerpo  = proximas.size() == 1
                ? "\"" + nombres + "\" vence en los próximos días"
                : proximas.size() + " obligaciones próximas: " + nombres + (proximas.size() > 2 ? " y más" : "");

        pushService.enviarATodos("💳 FIN TASK — Pagos pendientes", cuerpo, "/pagos");
    }

    private String construirCuerpoTareas(long hoy, long manana) {
        if (hoy > 0 && manana > 0) return hoy + " vencen hoy y " + manana + " mañana";
        if (hoy > 0) return hoy == 1 ? "1 tarea vence hoy" : hoy + " tareas vencen hoy";
        return manana == 1 ? "1 tarea vence mañana" : manana + " tareas vencen mañana";
    }

    private Date startOfDay(int plusDays) {
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DATE, plusDays);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }
}
