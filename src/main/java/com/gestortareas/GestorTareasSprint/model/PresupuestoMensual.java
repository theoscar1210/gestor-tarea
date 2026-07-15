package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "presupuesto_mensual")
public class PresupuestoMensual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mes_ano")
    private String mesAno;

    private BigDecimal salarioTotal;
    private LocalDateTime createdAt;

    @Column(name = "porcentaje_ahorro")
    private BigDecimal porcentajeAhorro = new BigDecimal("10.00");

    @Column(name = "porcentaje_fondo_emergencia")
    private BigDecimal porcentajeFondoEmergencia = new BigDecimal("5.00");

    @Column(name = "usuario_id")
    private Long usuarioId;

    public PresupuestoMensual() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }

    public BigDecimal getSalarioTotal() { return salarioTotal; }
    public void setSalarioTotal(BigDecimal salarioTotal) { this.salarioTotal = salarioTotal; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public BigDecimal getPorcentajeAhorro() { return porcentajeAhorro; }
    public void setPorcentajeAhorro(BigDecimal porcentajeAhorro) { this.porcentajeAhorro = porcentajeAhorro; }

    public BigDecimal getPorcentajeFondoEmergencia() { return porcentajeFondoEmergencia; }
    public void setPorcentajeFondoEmergencia(BigDecimal v) { this.porcentajeFondoEmergencia = v; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
