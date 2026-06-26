package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class PresupuestoDTO {

    @NotBlank(message = "El mes/año no puede estar vacío")
    @Pattern(regexp = "^\\d{4}-\\d{2}$", message = "El formato debe ser yyyy-MM (ej: 2026-06)")
    private String mesAno;

    @NotNull(message = "El salario total es obligatorio")
    @DecimalMin(value = "0.01", message = "El salario debe ser mayor a 0")
    @Digits(integer = 10, fraction = 2, message = "Máximo 10 enteros y 2 decimales")
    private BigDecimal salarioTotal;

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }
    public BigDecimal getSalarioTotal() { return salarioTotal; }
    public void setSalarioTotal(BigDecimal salarioTotal) { this.salarioTotal = salarioTotal; }
}
