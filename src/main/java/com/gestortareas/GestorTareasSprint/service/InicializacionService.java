package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.model.Usuario;
import com.gestortareas.GestorTareasSprint.repository.*;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InicializacionService {

    private final UsuarioRepository           usuarioRepo;
    private final PasswordEncoder             passwordEncoder;
    private final TareaRepository             tareaRepo;
    private final ObligacionRepository        obligacionRepo;
    private final PresupuestoMensualRepository presupuestoRepo;
    private final IngresoRepository           ingresoRepo;
    private final MovimientoFondoRepository   movimientoRepo;
    private final ListaMercadoRepository      mercadoRepo;

    public InicializacionService(UsuarioRepository usuarioRepo,
                                 PasswordEncoder passwordEncoder,
                                 TareaRepository tareaRepo,
                                 ObligacionRepository obligacionRepo,
                                 PresupuestoMensualRepository presupuestoRepo,
                                 IngresoRepository ingresoRepo,
                                 MovimientoFondoRepository movimientoRepo,
                                 ListaMercadoRepository mercadoRepo) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.tareaRepo       = tareaRepo;
        this.obligacionRepo  = obligacionRepo;
        this.presupuestoRepo = presupuestoRepo;
        this.ingresoRepo     = ingresoRepo;
        this.movimientoRepo  = movimientoRepo;
        this.mercadoRepo     = mercadoRepo;
    }

    @PostConstruct
    @Transactional
    public void inicializar() {
        // Crear usuario admin si no existe ningún usuario
        Usuario admin;
        if (!usuarioRepo.existsByUsername("admin")) {
            admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("gestor2026"));
            admin.setEmail("admin@gestor.com");
            admin = usuarioRepo.save(admin);
        } else {
            admin = usuarioRepo.findByUsername("admin").orElseThrow();
        }

        Long adminId = admin.getId();

        // Migrar datos huérfanos (usuario_id IS NULL) al usuario admin
        try {
            tareaRepo.migrarNuloAAdmin(adminId);
            obligacionRepo.migrarNuloAAdmin(adminId);
            presupuestoRepo.migrarNuloAAdmin(adminId);
            ingresoRepo.migrarNuloAAdmin(adminId);
            movimientoRepo.migrarNuloAAdmin(adminId);
            mercadoRepo.migrarNuloAAdmin(adminId);
        } catch (Exception e) {
            // Las columnas usuario_id pueden no existir aún (antes de correr el SQL de migración)
            // El sistema igual arranca; ejecutar el SQL de migración antes de desplegar
        }
    }
}
