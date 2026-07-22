package com.gestortareas.GestorTareasSprint.repository;

import com.gestortareas.GestorTareasSprint.model.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IngresoRepository extends JpaRepository<Ingreso, Long> {

    List<Ingreso> findByMesAno(String mesAno);

    List<Ingreso> findByMesAnoAndUsuarioId(String mesAno, Long usuarioId);

    List<Ingreso> findByMesAnoOrderByFechaDesc(String mesAno);

    List<Ingreso> findByMesAnoAndUsuarioIdOrderByFechaDesc(String mesAno, Long usuarioId);

    @Query("SELECT DISTINCT i.mesAno FROM Ingreso i ORDER BY i.mesAno DESC")
    List<String> findDistinctMesAnoDesc();

    @Query("SELECT DISTINCT i.mesAno FROM Ingreso i WHERE i.usuarioId = :uid ORDER BY i.mesAno DESC")
    List<String> findDistinctMesAnoDescByUsuarioId(@Param("uid") Long uid);

    @Modifying
    @Query("UPDATE Ingreso i SET i.usuarioId = :userId WHERE i.usuarioId IS NULL")
    void migrarNuloAAdmin(@Param("userId") Long userId);

    @Modifying(clearAutomatically = true)
    @Query(value = "DELETE FROM ingreso WHERE usuario_id = :uid", nativeQuery = true)
    void deleteByUsuarioId(@Param("uid") Long uid);
}
