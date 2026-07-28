package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.SubTarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubTareaRepository extends JpaRepository<SubTarea, Long> {

    List<SubTarea> findByTareaIdAndUsuarioIdOrderByOrden(Long tareaId, Long usuarioId);

    List<SubTarea> findByUsuarioId(Long usuarioId);

    Optional<SubTarea> findByIdAndUsuarioId(Long id, Long usuarioId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM subtarea WHERE tarea_id = :tareaId AND usuario_id = :uid", nativeQuery = true)
    void deleteByTareaIdAndUsuarioId(@Param("tareaId") Long tareaId, @Param("uid") Long uid);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM subtarea WHERE usuario_id = :uid", nativeQuery = true)
    void deleteByUsuarioId(@Param("uid") Long uid);
}
