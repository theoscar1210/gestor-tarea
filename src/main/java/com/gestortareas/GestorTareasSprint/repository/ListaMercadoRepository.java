package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.ListaMercado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListaMercadoRepository extends JpaRepository<ListaMercado, Long> {
    Optional<ListaMercado> findByNombreIgnoreCase(String nombre);
}
