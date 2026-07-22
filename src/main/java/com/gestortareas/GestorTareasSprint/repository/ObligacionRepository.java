package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Obligacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ObligacionRepository extends JpaRepository<Obligacion, Long> {

    List<Obligacion> findByActivoTrue();

    List<Obligacion> findByUsuarioId(Long usuarioId);

    List<Obligacion> findByActivoTrueAndUsuarioId(Long usuarioId);

    Optional<Obligacion> findByIdAndUsuarioId(Long id, Long usuarioId);

    Optional<Obligacion> findByNombreIgnoreCase(String nombre);

    Optional<Obligacion> findByNombreIgnoreCaseAndActivoTrue(String nombre);

    Optional<Obligacion> findByNombreIgnoreCaseAndActivoTrueAndUsuarioId(String nombre, Long usuarioId);

    @Modifying
    @Query("UPDATE Obligacion o SET o.usuarioId = :userId WHERE o.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM Obligacion o WHERE o.usuarioId = :uid")
    void deleteByUsuarioId(@Param("uid") Long uid);
}
