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

    public PresupuestoMensual() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMesAno() { return mesAno; }
    public void setMesAno(String mesAno) { this.mesAno = mesAno; }

    public BigDecimal getSalarioTotal() { return salarioTotal; }
    public void setSalarioTotal(BigDecimal salarioTotal) { this.salarioTotal = salarioTotal; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
