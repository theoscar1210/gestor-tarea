package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimiento_fondo")
public class MovimientoFondo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** AHORRO_RETIRO | EMERGENCIA_RETIRO */
    @Column(nullable = false, length = 30)
    private String tipo;

    @Column(nullable = false)
    private BigDecimal monto;

    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "mes_ano", nullable = false, length = 7)
    private String mesAno;

    public MovimientoFondo() {}

    public Long getId() { return id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }
}
