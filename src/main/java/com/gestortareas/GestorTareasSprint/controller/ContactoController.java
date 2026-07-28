package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.model.Contacto;
import com.gestortareas.GestorTareasSprint.repository.ContactoRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoController {

    private final ContactoRepository repo;

    public ContactoController(ContactoRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Contacto> listar() {
        return repo.findByUsuarioIdOrderByNombre(SecurityUtils.getCurrentUserId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contacto agregar(@RequestBody Contacto c) {
        c.setId(null);
        c.setUsuarioId(SecurityUtils.getCurrentUserId());
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contacto> editar(@PathVariable Long id, @RequestBody Contacto body) {
        return repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId())
                .map(c -> {
                    c.setNombre(body.getNombre());
                    c.setTelefono(body.getTelefono());
                    c.setEmail(body.getEmail());
                    return ResponseEntity.ok(repo.save(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        repo.findByIdAndUsuarioId(id, SecurityUtils.getCurrentUserId()).ifPresent(repo::delete);
    }
}
