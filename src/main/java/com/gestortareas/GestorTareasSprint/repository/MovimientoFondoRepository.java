package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.MovimientoFondo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MovimientoFondoRepository extends JpaRepository<MovimientoFondo, Long> {

    List<MovimientoFondo> findAllByOrderByFechaDesc();

    List<MovimientoFondo> findByUsuarioIdOrderByFechaDesc(Long usuarioId);

    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM MovimientoFondo m WHERE m.tipo = :tipo")
    BigDecimal sumByTipo(@Param("tipo") String tipo);

    @Query("SELECT COALESCE(SUM(m.monto), 0) FROM MovimientoFondo m WHERE m.tipo = :tipo AND m.usuarioId = :uid")
    BigDecimal sumByTipoAndUsuarioId(@Param("tipo") String tipo, @Param("uid") Long uid);

    @Modifying
    @Query("UPDATE MovimientoFondo m SET m.usuarioId = :userId WHERE m.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM MovimientoFondo m WHERE m.usuarioId = :uid")
    void deleteByUsuarioId(@Param("uid") Long uid);
}
