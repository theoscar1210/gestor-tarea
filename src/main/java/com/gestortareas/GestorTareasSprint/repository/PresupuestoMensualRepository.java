package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.PresupuestoMensual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PresupuestoMensualRepository extends JpaRepository<PresupuestoMensual, Long> {
    Optional<PresupuestoMensual> findByMesAno(String mesAno);
}
