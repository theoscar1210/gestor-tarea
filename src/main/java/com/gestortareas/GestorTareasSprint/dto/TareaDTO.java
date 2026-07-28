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

    @Size(max = 100)
    private String categoria;

    @Pattern(regexp = "^(alta|media|baja)$|^$", message = "Prioridad: alta, media o baja")
    private String prioridad;

    private boolean realizado;

    // ── Campos v2 ──────────────────────────────────────────────

    private String tipo;            // EVENTO | TAREA
    private String horaInicio;      // HH:MM
    private String horaFin;         // HH:MM
    private String etiqueta;        // URGENTE | IMPORTANTE | PERSONAL | TRABAJO
    private String recurrencia;     // NINGUNA | DIARIA | SEMANAL | MENSUAL | PERSONALIZADA
    private Integer intervaloRecurrencia;
    private String textoNatural;
    private Long contactoId;

    // ── Getters / Setters ──────────────────────────────────────

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

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getHoraInicio() { return horaInicio; }
    public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }

    public String getHoraFin() { return horaFin; }
    public void setHoraFin(String horaFin) { this.horaFin = horaFin; }

    public String getEtiqueta() { return etiqueta; }
    public void setEtiqueta(String etiqueta) { this.etiqueta = etiqueta; }

    public String getRecurrencia() { return recurrencia; }
    public void setRecurrencia(String recurrencia) { this.recurrencia = recurrencia; }

    public Integer getIntervaloRecurrencia() { return intervaloRecurrencia; }
    public void setIntervaloRecurrencia(Integer intervaloRecurrencia) { this.intervaloRecurrencia = intervaloRecurrencia; }

    public String getTextoNatural() { return textoNatural; }
    public void setTextoNatural(String textoNatural) { this.textoNatural = textoNatural; }

    public Long getContactoId() { return contactoId; }
    public void setContactoId(Long contactoId) { this.contactoId = contactoId; }
}
