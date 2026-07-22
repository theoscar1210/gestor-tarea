package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.AuthResponse;
import com.gestortareas.GestorTareasSprint.dto.LoginRequest;
import com.gestortareas.GestorTareasSprint.dto.RegisterRequest;
import com.gestortareas.GestorTareasSprint.model.Usuario;
import com.gestortareas.GestorTareasSprint.repository.UsuarioRepository;
import com.gestortareas.GestorTareasSprint.service.PasswordResetService;
import com.gestortareas.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository   usuarioRepo;
    private final PasswordEncoder     passwordEncoder;
    private final JwtService          jwtService;
    private final PasswordResetService resetService;

    public AuthController(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          PasswordResetService resetService) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService      = jwtService;
        this.resetService    = resetService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return usuarioRepo.findByUsername(req.getUsername() != null ? req.getUsername().toLowerCase().trim() : "")
                .filter(u -> passwordEncoder.matches(req.getPassword(), u.getPassword()))
                .filter(Usuario::isEnabled)
                .map(u -> ResponseEntity.ok((Object) new AuthResponse(
                        jwtService.generarToken(u.getUsername(), u.getId()),
                        u.getUsername(), u.getId())))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Usuario o contraseña incorrectos")));
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegisterRequest req) {
        if (req.getUsername() == null || req.getUsername().isBlank() ||
                req.getPassword() == null || req.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Usuario mínimo 1 carácter y contraseña mínimo 6"));
        }

        String email = req.getEmail();
        if (email == null || email.isBlank() || !email.contains("@") || !email.contains(".")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ingresa un correo electrónico válido"));
        }
        email = email.toLowerCase().trim();

        String username = req.getUsername().toLowerCase().trim();

        if (usuarioRepo.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        if (usuarioRepo.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Ese correo ya está registrado en otra cuenta"));
        }

        Usuario u = new Usuario();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setEmail(email);
        usuarioRepo.save(u);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(jwtService.generarToken(u.getUsername(), u.getId()),
                        u.getUsername(), u.getId()));
    }

    /** Solicitar código de recuperación vía email (sin JWT) */
    @PostMapping("/solicitar-reset")
    public ResponseEntity<?> solicitarReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requerido"));
        }
        resetService.solicitarReset(email);
        return ResponseEntity.ok(Map.of("mensaje", "Si el email existe, recibirás un código en tu correo"));
    }

    /** Confirmar reset con código + nueva contraseña (sin JWT) */
    @PostMapping("/confirmar-reset")
    public ResponseEntity<?> confirmarReset(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String codigo   = body.get("codigo");
        String nueva    = body.get("passwordNueva");
        if (email == null || codigo == null || nueva == null || nueva.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Datos incompletos o contraseña demasiado corta"));
        }
        boolean ok = resetService.confirmarReset(email, codigo, nueva);
        if (!ok) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Código inválido o expirado"));
        }
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida. Ya puedes iniciar sesión."));
    }
}
