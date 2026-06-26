package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;
import java.util.Date;

public class TareaDTO {

    @NotBlank(message = "El título no puede estar vacío")
    @Size(max = 200, message = "El título no puede superar 200 caracteres")
    private String titulo;

    @Size(max = 1000, message = "La descripción no puede superar 1000 caracteres")
    private String descripcion;

    private Date vencimiento;

    @Size(max = 100, message = "La categoría no puede superar 100 caracteres")
    private String categoria;

    @Pattern(regexp = "^(alta|media|baja)$", message = "La prioridad debe ser 'alta', 'media' o 'baja'")
    private String prioridad;

    private boolean realizado;

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Date getVencimiento() { return vencimiento; }
    public void setVencimiento(Date vencimiento) { this.vencimiento = vencimiento; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }
    public boolean isRealizado() { return realizado; }
    public void setRealizado(boolean realizado) { this.realizado = realizado; }
}
