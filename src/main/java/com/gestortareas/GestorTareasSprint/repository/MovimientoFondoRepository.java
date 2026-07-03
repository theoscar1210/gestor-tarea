package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.MovimientoFondo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MovimientoFondoRepository extends JpaRepository<MovimientoFondo, Long> {

    List<MovimientoFondo> findAllByOrderByFechaDesc();

    List<MovimientoFondo> findByTipo(String tipo);

    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM MovimientoFondo m WHERE m.tipo = :tipo")
    BigDecimal sumByTipo(@Param("tipo") String tipo);
}
