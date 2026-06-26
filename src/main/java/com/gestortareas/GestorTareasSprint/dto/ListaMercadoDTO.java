package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;

public class ListaMercadoDTO {

    @NotBlank(message = "El nombre del producto no puede estar vacío")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    private String nombre;

    @Min(value = 1, message = "La cantidad mínima es 1")
    @Max(value = 999, message = "La cantidad máxima es 999")
    private Integer cantidad;

    @Size(max = 20, message = "La unidad no puede superar 20 caracteres")
    private String unidad;

    private Boolean comprado;

    public ListaMercadoDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public Boolean getComprado() { return comprado; }
    public void setComprado(Boolean comprado) { this.comprado = comprado; }
}
