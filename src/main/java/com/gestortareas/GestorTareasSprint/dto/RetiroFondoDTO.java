package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class RetiroFondoDTO {

    @NotBlank
    private String tipo; // AHORRO_RETIRO | EMERGENCIA_RETIRO

    @NotNull @DecimalMin("1")
    private BigDecimal monto;

    @NotBlank
    private String descripcion;

    @NotBlank
    private String mesAno;

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }
}
