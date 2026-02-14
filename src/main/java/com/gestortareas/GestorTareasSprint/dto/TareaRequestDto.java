package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class TareaRequestDto {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 120, message = "El título no puede superar 120 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 600, message = "La descripción no puede superar 600 caracteres")
    private String descripcion;

    private LocalDate vencimiento;

    @Size(max = 40, message = "La categoría no puede superar 40 caracteres")
    private String categoria;

    @Size(max = 20, message = "La prioridad no puede superar 20 caracteres")
    private String prioridad;

    private Boolean realizado;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDate getVencimiento() {
        return vencimiento;
    }

    public void setVencimiento(LocalDate vencimiento) {
        this.vencimiento = vencimiento;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public Boolean getRealizado() {
        return realizado;
    }

    public void setRealizado(Boolean realizado) {
        this.realizado = realizado;
    }
}
