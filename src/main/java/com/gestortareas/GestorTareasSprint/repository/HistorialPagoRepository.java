package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.HistorialPago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HistorialPagoRepository extends JpaRepository<HistorialPago, Long> {
    Optional<HistorialPago> findByObligacionIdAndMesAno(Long obligacionId, String mesAno);
    List<HistorialPago> findByMesAnoAndPagadoTrue(String mesAno);
}
