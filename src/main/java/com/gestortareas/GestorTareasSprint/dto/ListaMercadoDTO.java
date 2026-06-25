package com.gestortareas.GestorTareasSprint.dto;

public class ListaMercadoDTO {
    private String nombre;
    private Integer cantidad;
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
