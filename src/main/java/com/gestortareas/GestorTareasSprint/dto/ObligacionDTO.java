package com.gestortareas.GestorTareasSprint.dto;

import com.gestortareas.GestorTareasSprint.model.TipoObligacion;
import java.math.BigDecimal;

public class ObligacionDTO {
    private String nombre;
    private TipoObligacion tipo;
    private BigDecimal monto;
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
