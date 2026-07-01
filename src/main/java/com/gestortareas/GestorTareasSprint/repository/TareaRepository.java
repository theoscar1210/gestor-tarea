package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    @Query("SELECT t FROM Tarea t WHERE t.realizado = false AND t.vencimiento IS NOT NULL AND t.vencimiento >= :inicio AND t.vencimiento < :fin")
    List<Tarea> findPendientesVencimientoEntre(@Param("inicio") Date inicio, @Param("fin") Date fin);
}
