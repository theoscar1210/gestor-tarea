package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    List<Tarea> findByUsuarioId(Long usuarioId);

    Optional<Tarea> findByIdAndUsuarioId(Long id, Long usuarioId);

    boolean existsByIdAndUsuarioId(Long id, Long usuarioId);

    @Query("SELECT t FROM Tarea t WHERE t.usuarioId = :uid AND t.realizado = false " +
           "AND t.vencimiento IS NOT NULL AND t.vencimiento >= :inicio AND t.vencimiento < :fin")
    List<Tarea> findPendientesVencimientoEntreAndUsuarioId(
            @Param("inicio") Date inicio, @Param("fin") Date fin, @Param("uid") Long uid);

    @Query("SELECT t FROM Tarea t WHERE t.realizado = false " +
           "AND t.vencimiento IS NOT NULL AND t.vencimiento >= :inicio AND t.vencimiento < :fin")
    List<Tarea> findPendientesVencimientoEntre(
            @Param("inicio") Date inicio, @Param("fin") Date fin);

    @Modifying
    @Query("UPDATE Tarea t SET t.usuarioId = :userId WHERE t.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Tarea t WHERE t.usuarioId = :uid")
    void deleteByUsuarioId(@Param("uid") Long uid);
}
