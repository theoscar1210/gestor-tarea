package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Obligacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ObligacionRepository extends JpaRepository<Obligacion, Long> {
    List<Obligacion> findByActivoTrue();
    Optional<Obligacion> findByNombreIgnoreCase(String nombre);
    Optional<Obligacion> findByNombreIgnoreCaseAndActivoTrue(String nombre);
}
