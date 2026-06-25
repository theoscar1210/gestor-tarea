package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "categoria_gasto")
public class CategoriaGasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;

    private BigDecimal porcentajeSugerido;
    private String color;

    public CategoriaGasto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public TipoCategoria getTipo() { return tipo; }
    public void setTipo(TipoCategoria tipo) { this.tipo = tipo; }

    public BigDecimal getPorcentajeSugerido() { return porcentajeSugerido; }
    public void setPorcentajeSugerido(BigDecimal porcentajeSugerido) { this.porcentajeSugerido = porcentajeSugerido; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
