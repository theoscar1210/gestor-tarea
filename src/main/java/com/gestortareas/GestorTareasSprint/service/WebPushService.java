package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.PushSubscription;
import com.gestortareas.GestorTareasSprint.repository.PushSubscriptionRepository;
import jakarta.annotation.PostConstruct;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Security;
import java.util.List;

@Service
public class WebPushService {

    private static final Logger log = LoggerFactory.getLogger(WebPushService.class);

    @Value("${vapid.public.key:}")
    private String vapidPublicKey;

    @Value("${vapid.private.key:}")
    private String vapidPrivateKey;

    private PushService pushService;
    private final PushSubscriptionRepository repo;

    public WebPushService(PushSubscriptionRepository repo) {
        this.repo = repo;
    }

    @PostConstruct
    public void init() {
        if (vapidPublicKey.isBlank() || vapidPrivateKey.isBlank()) {
            log.warn("[Push] VAPID keys no configuradas — notificaciones push deshabilitadas");
            return;
        }
        try {
            Security.addProvider(new BouncyCastleProvider());
            pushService = new PushService(vapidPublicKey, vapidPrivateKey, "mailto:admin@fintask.app");
            log.info("[Push] PushService inicializado correctamente");
        } catch (Exception e) {
            log.error("[Push] Error al inicializar PushService: {}", e.getMessage());
        }
    }

    public void enviarATodos(String titulo, String cuerpo, String url) {
        if (pushService == null) return;
        List<PushSubscription> subs = repo.findAll();
        if (subs.isEmpty()) return;

        String payload = String.format(
            "{\"title\":\"%s\",\"body\":\"%s\",\"icon\":\"/ia.png\",\"tag\":\"fintask-recordatorio\",\"url\":\"%s\"}",
            titulo.replace("\"", "'"), cuerpo.replace("\"", "'"), url
        );

        for (PushSubscription sub : subs) {
            try {
                Notification notif = new Notification(sub.getEndpoint(), sub.getP256dh(), sub.getAuth(), payload.getBytes());
                pushService.send(notif);
            } catch (Exception e) {
                log.warn("[Push] Fallo al enviar a {}: {} — eliminando suscripción", sub.getEndpoint(), e.getMessage());
                repo.delete(sub);
            }
        }
    }
}
