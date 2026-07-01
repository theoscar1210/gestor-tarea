package com.gestortareas.GestorTareasSprint.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IngresoDTO {
    private String descripcion;
    private BigDecimal monto;
    private LocalDate fecha;
    private String tipo;

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
