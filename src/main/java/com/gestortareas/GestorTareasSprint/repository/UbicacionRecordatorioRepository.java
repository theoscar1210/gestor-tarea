package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.UbicacionRecordatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UbicacionRecordatorioRepository extends JpaRepository<UbicacionRecordatorio, Long> {

    List<UbicacionRecordatorio> findByUsuarioIdAndActivaTrue(Long usuarioId);

    List<UbicacionRecordatorio> findByUsuarioId(Long usuarioId);

    Optional<UbicacionRecordatorio> findByIdAndUsuarioId(Long id, Long usuarioId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM ubicacion_recordatorio WHERE usuario_id = :uid", nativeQuery = true)
    void deleteByUsuarioId(@Param("uid") Long uid);
}
