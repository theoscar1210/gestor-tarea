package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PorcentajesDTO {

    @NotNull
    @DecimalMin("0.0") @DecimalMax("50.0")
    private BigDecimal porcentajeAhorro;

    @NotNull
    @DecimalMin("0.0") @DecimalMax("30.0")
    private BigDecimal porcentajeFondoEmergencia;

    public BigDecimal getPorcentajeAhorro() { return porcentajeAhorro; }
    public void setPorcentajeAhorro(BigDecimal v) { this.porcentajeAhorro = v; }

    public BigDecimal getPorcentajeFondoEmergencia() { return porcentajeFondoEmergencia; }
    public void setPorcentajeFondoEmergencia(BigDecimal v) { this.porcentajeFondoEmergencia = v; }
}
