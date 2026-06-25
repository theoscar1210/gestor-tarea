package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "historial_pagos")
public class HistorialPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "obligacion_id")
    private Obligacion obligacion;

    private LocalDate fechaPago;
    private BigDecimal montoPagado;
    private Boolean pagado;

    @Column(name = "mes_ano")
    private String mesAno;

    public HistorialPago() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Obligacion getObligacion() { return obligacion; }
    public void setObligacion(Obligacion obligacion) { this.obligacion = obligacion; }

    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }

    public BigDecimal getMontoPagado() { return montoPagado; }
    public void setMontoPagado(BigDecimal montoPagado) { this.montoPagado = montoPagado; }

    public Boolean getPagado() { return pagado; }
    public void setPagado(Boolean pagado) { this.pagado = pagado; }

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }
}
