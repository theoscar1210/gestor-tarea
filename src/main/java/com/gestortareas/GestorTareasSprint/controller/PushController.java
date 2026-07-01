package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.PushSubscription;
import com.gestortareas.GestorTareasSprint.repository.PushSubscriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final PushSubscriptionRepository repo;

    public PushController(PushSubscriptionRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        String p256dh   = body.get("p256dh");
        String auth     = body.get("auth");

        if (endpoint == null || p256dh == null || auth == null) {
            return ResponseEntity.badRequest().build();
        }

        repo.findByEndpoint(endpoint).ifPresentOrElse(
            existing -> { /* ya registrada */ },
            () -> {
                PushSubscription sub = new PushSubscription();
                sub.setEndpoint(endpoint);
                sub.setP256dh(p256dh);
                sub.setAuth(auth);
                repo.save(sub);
            }
        );
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/subscribe")
    public ResponseEntity<Void> unsubscribe(@RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint != null) repo.deleteByEndpoint(endpoint);
        return ResponseEntity.ok().build();
    }
}
