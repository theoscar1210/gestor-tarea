package com.gestortareas.GestorTareasSprint.dto;

import com.gestortareas.GestorTareasSprint.model.TipoObligacion;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class ObligacionDTO {

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @NotNull(message = "El tipo de obligación es obligatorio")
    private TipoObligacion tipo;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    @Digits(integer = 10, fraction = 2, message = "Máximo 10 enteros y 2 decimales")
    private BigDecimal monto;

    @NotNull(message = "El día de vencimiento es obligatorio")
    @Min(value = 1, message = "El día de vencimiento mínimo es 1")
    @Max(value = 31, message = "El día de vencimiento máximo es 31")
    private Integer diaVencimiento;

    public ObligacionDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public TipoObligacion getTipo() { return tipo; }
    public void setTipo(TipoObligacion tipo) { this.tipo = tipo; }
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    public Integer getDiaVencimiento() { return diaVencimiento; }
    public void setDiaVencimiento(Integer diaVencimiento) { this.diaVencimiento = diaVencimiento; }
}
