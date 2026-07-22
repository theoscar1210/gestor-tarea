package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.PresupuestoMensual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PresupuestoMensualRepository extends JpaRepository<PresupuestoMensual, Long> {

    Optional<PresupuestoMensual> findByMesAno(String mesAno);

    Optional<PresupuestoMensual> findByMesAnoAndUsuarioId(String mesAno, Long usuarioId);

    List<PresupuestoMensual> findAllByOrderByMesAnoDesc();

    List<PresupuestoMensual> findByUsuarioIdOrderByMesAnoDesc(Long usuarioId);

    @Modifying
    @Query("UPDATE PresupuestoMensual p SET p.usuarioId = :userId WHERE p.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM PresupuestoMensual p WHERE p.usuarioId = :uid")
    void deleteByUsuarioId(@Param("uid") Long uid);
}
