package com.gestortareas.GestorTareasSprint.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class GastoDTO {
    private Long categoriaId;
    private String descripcion;
    private BigDecimal monto;
    private LocalDate fecha;

    public GastoDTO() {}

    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}
