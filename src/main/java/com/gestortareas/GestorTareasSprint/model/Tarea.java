package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(length = 1000)
    private String descripcion;

    private Date vencimiento;

    @Column(length = 100)
    private String categoria;

    @Column(length = 10)
    private String prioridad; // alta | media | baja

    private boolean realizado;

    @Column(name = "usuario_id")
    private Long usuarioId;

    // ── Campos v2 ─────────────────────────────────────────────

    /** EVENTO (hora fija) o TAREA (flexible) */
    @Column(length = 10)
    private String tipo = "TAREA";

    /** Hora de inicio "HH:MM" — solo para tipo EVENTO */
    @Column(name = "hora_inicio", length = 5)
    private String horaInicio;

    /** Hora de fin "HH:MM" — para detectar conflictos */
    @Column(name = "hora_fin", length = 5)
    private String horaFin;

    /** URGENTE | IMPORTANTE | PERSONAL | TRABAJO */
    @Column(length = 20)
    private String etiqueta;

    /** NINGUNA | DIARIA | SEMANAL | MENSUAL | PERSONALIZADA */
    @Column(length = 20)
    private String recurrencia = "NINGUNA";

    /** Días del intervalo cuando recurrencia = PERSONALIZADA */
    @Column(name = "intervalo_recurrencia")
    private Integer intervaloRecurrencia;

    /** Texto original que el usuario escribió (NLP) */
    @Column(name = "texto_natural", length = 500)
    private String textoNatural;

    /** Contacto vinculado al evento */
    @Column(name = "contacto_id")
    private Long contactoId;

    /** Snooze: no mostrar recordatorio hasta esta fecha/hora */
    @Column(name = "snoozed_until")
    private Date snoozedUntil;

    // ── Getters / Setters ──────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

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

    public Date getSnoozedUntil() { return snoozedUntil; }
    public void setSnoozedUntil(Date snoozedUntil) { this.snoozedUntil = snoozedUntil; }
}
