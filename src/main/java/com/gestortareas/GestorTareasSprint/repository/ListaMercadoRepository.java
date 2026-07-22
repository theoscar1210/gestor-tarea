package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.ListaMercado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ListaMercadoRepository extends JpaRepository<ListaMercado, Long> {

    Optional<ListaMercado> findByNombreIgnoreCase(String nombre);

    List<ListaMercado> findByUsuarioId(Long usuarioId);

    Optional<ListaMercado> findByNombreIgnoreCaseAndUsuarioId(String nombre, Long usuarioId);

    Optional<ListaMercado> findByIdAndUsuarioId(Long id, Long usuarioId);

    @Modifying
    @Query("UPDATE ListaMercado l SET l.usuarioId = :userId WHERE l.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM lista_mercado WHERE usuario_id = :uid", nativeQuery = true)
    void deleteByUsuarioId(@Param("uid") Long uid);
}
