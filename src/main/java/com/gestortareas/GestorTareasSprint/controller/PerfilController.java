package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.Usuario;
import com.gestortareas.GestorTareasSprint.repository.UsuarioRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;

    public PerfilController(UsuarioRepository usuarioRepo, PasswordEncoder passwordEncoder) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PatchMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> body) {
        String actual = body.get("passwordActual");
        String nueva  = body.get("passwordNueva");
        if (actual == null || nueva == null || nueva.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La nueva contraseña debe tener al menos 6 caracteres"));
        }
        Long userId = SecurityUtils.getCurrentUserId();
        Usuario u = usuarioRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(actual, u.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "La contraseña actual es incorrecta"));
        }
        u.setPassword(passwordEncoder.encode(nueva));
        usuarioRepo.save(u);
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
    }
}
