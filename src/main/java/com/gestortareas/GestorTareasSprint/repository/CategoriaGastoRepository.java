package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.CategoriaGasto;
import com.gestortareas.GestorTareasSprint.model.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaGastoRepository extends JpaRepository<CategoriaGasto, Long> {
    Optional<CategoriaGasto> findByNombreIgnoreCase(String nombre);
    Optional<CategoriaGasto> findFirstByTipo(TipoCategoria tipo);
}
