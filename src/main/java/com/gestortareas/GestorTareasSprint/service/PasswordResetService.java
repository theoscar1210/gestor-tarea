package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Usuario;
import com.gestortareas.GestorTareasSprint.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private record ResetEntry(String codigo, Instant expira) {}

    private final Map<String, ResetEntry> codigos = new ConcurrentHashMap<>();
    private static final long TTL_SEGUNDOS = 900; // 15 minutos
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;
    private final JavaMailSender    mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public PasswordResetService(UsuarioRepository usuarioRepo,
                                PasswordEncoder passwordEncoder,
                                JavaMailSender mailSender) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.mailSender      = mailSender;
    }

    public void solicitarReset(String email) {
        Optional<Usuario> opt = usuarioRepo.findByEmail(email.trim().toLowerCase());
        if (opt.isEmpty()) {
            // No revelamos si el email existe o no (seguridad)
            return;
        }
        String codigo = String.format("%06d", RANDOM.nextInt(1_000_000));
        codigos.put(email.trim().toLowerCase(),
                new ResetEntry(codigo, Instant.now().plusSeconds(TTL_SEGUNDOS)));
        enviarEmail(email, codigo);
    }

    public boolean confirmarReset(String email, String codigo, String nuevaPassword) {
        String key = email.trim().toLowerCase();
        ResetEntry entry = codigos.get(key);
        if (entry == null || Instant.now().isAfter(entry.expira())) {
            codigos.remove(key);
            return false;
        }
        if (!entry.codigo().equals(codigo)) {
            return false;
        }
        Optional<Usuario> opt = usuarioRepo.findByEmail(key);
        if (opt.isEmpty()) return false;

        Usuario u = opt.get();
        u.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepo.save(u);
        codigos.remove(key);
        return true;
    }

    private void enviarEmail(String destinatario, String codigo) {
        if (mailFrom == null || mailFrom.isBlank()) return;
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(destinatario);
            msg.setSubject("FIN TASK — Código de recuperación");
            msg.setText(
                "Tu código para restablecer la contraseña es:\n\n" +
                "  " + codigo + "\n\n" +
                "Este código es válido por 15 minutos.\n" +
                "Si no solicitaste este cambio, ignora este mensaje."
            );
            mailSender.send(msg);
        } catch (Exception ignored) {
            // Si el correo no está configurado, el flujo continúa silenciosamente
        }
    }
}
