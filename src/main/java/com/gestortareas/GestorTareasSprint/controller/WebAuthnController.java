package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.WebAuthnCredential;
import com.gestortareas.GestorTareasSprint.repository.WebAuthnCredentialRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/webauthn")
public class WebAuthnController {

    private final WebAuthnCredentialRepository repo;
    private final ConcurrentHashMap<String, Long> challenges = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public WebAuthnController(WebAuthnCredentialRepository repo) {
        this.repo = repo;
    }

    /** Endpoint público: devuelve challenge aleatorio + credentialId guardado (si existe) */
    @GetMapping("/challenge")
    public ResponseEntity<Map<String, Object>> challenge() {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String challenge = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        // Guardar challenge con timestamp para validez de 5 minutos
        challenges.put(challenge, System.currentTimeMillis());
        challenges.entrySet().removeIf(e -> System.currentTimeMillis() - e.getValue() > 300_000);

        List<WebAuthnCredential> creds = repo.findAll();
        String credentialId = creds.isEmpty() ? null : creds.get(0).getCredentialId();

        Map<String, Object> resp = new HashMap<>();
        resp.put("challenge", challenge);
        resp.put("credentialId", credentialId);
        resp.put("registered", credentialId != null);
        return ResponseEntity.ok(resp);
    }

    /** Endpoint protegido: registra un nuevo credentialId (requiere Basic auth) */
    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody Map<String, String> body) {
        String credentialId = body.get("credentialId");
        if (credentialId == null || credentialId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        repo.deleteAll();
        WebAuthnCredential cred = new WebAuthnCredential();
        cred.setCredentialId(credentialId);
        repo.save(cred);
        return ResponseEntity.ok().build();
    }

    /** Endpoint protegido: elimina el registro de huella */
    @DeleteMapping("/register")
    public ResponseEntity<Void> unregister() {
        repo.deleteAll();
        return ResponseEntity.ok().build();
    }
}
