package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IngresoRepository extends JpaRepository<Ingreso, Long> {
    List<Ingreso> findByMesAno(String mesAno);
    List<Ingreso> findByMesAnoOrderByFechaDesc(String mesAno);

    @Query("SELECT DISTINCT i.mesAno FROM Ingreso i ORDER BY i.mesAno DESC")
    List<String> findDistinctMesAnoDesc();
}
