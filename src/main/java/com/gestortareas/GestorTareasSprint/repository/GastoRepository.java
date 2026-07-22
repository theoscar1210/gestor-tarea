package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GastoRepository extends JpaRepository<Gasto, Long> {
    List<Gasto> findByPresupuestoId(Long presupuestoId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM gasto WHERE presupuesto_id IN :ids", nativeQuery = true)
    void deleteByPresupuestoIdIn(@Param("ids") java.util.List<Long> ids);
}
