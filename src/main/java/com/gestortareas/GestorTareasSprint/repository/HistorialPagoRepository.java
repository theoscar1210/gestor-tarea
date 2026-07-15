package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.HistorialPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HistorialPagoRepository extends JpaRepository<HistorialPago, Long> {

    Optional<HistorialPago> findByObligacionIdAndMesAno(Long obligacionId, String mesAno);

    List<HistorialPago> findByMesAnoAndPagadoTrue(String mesAno);

    @Query("SELECT h FROM HistorialPago h WHERE h.mesAno = :mesAno AND h.pagado = true " +
           "AND h.obligacion.usuarioId = :uid")
    List<HistorialPago> findByMesAnoAndPagadoTrueAndUsuarioId(
            @Param("mesAno") String mesAno, @Param("uid") Long uid);
}
