package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.PlantillaRutina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PlantillaRutinaRepository extends JpaRepository<PlantillaRutina, Long> {

    List<PlantillaRutina> findByUsuarioId(Long usuarioId);

    Optional<PlantillaRutina> findByIdAndUsuarioId(Long id, Long usuarioId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM plantilla_rutina WHERE usuario_id = :uid", nativeQuery = true)
    void deleteByUsuarioId(@Param("uid") Long uid);
}
