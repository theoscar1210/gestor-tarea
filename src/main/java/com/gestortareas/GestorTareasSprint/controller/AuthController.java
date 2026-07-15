package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.AuthResponse;
import com.gestortareas.GestorTareasSprint.dto.LoginRequest;
import com.gestortareas.GestorTareasSprint.dto.RegisterRequest;
import com.gestortareas.GestorTareasSprint.model.Usuario;
import com.gestortareas.GestorTareasSprint.repository.UsuarioRepository;
import com.gestortareas.config.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;
    private final JwtService        jwtService;

    public AuthController(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService      = jwtService;
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

        String username = req.getUsername().toLowerCase().trim();

        if (usuarioRepo.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El nombre de usuario ya está en uso"));
        }

        Usuario u = new Usuario();
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setEmail(req.getEmail());
        usuarioRepo.save(u);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(jwtService.generarToken(u.getUsername(), u.getId()),
                        u.getUsername(), u.getId()));
    }
}
