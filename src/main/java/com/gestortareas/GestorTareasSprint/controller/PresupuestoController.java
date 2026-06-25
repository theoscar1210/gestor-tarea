package com.gestortareas.GestorTareasSprint.controller;

import com.gestortareas.GestorTareasSprint.dto.GastoDTO;
import com.gestortareas.GestorTareasSprint.model.CategoriaGasto;
import com.gestortareas.GestorTareasSprint.model.Gasto;
import com.gestortareas.GestorTareasSprint.model.PresupuestoMensual;
import com.gestortareas.GestorTareasSprint.service.PresupuestoService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuesto")
@CrossOrigin(origins = "http://localhost:3000")
public class PresupuestoController {

    private final PresupuestoService service;
    private static final DateTimeFormatter FORMATO_MES = DateTimeFormatter.ofPattern("yyyy-MM");

    public PresupuestoController(PresupuestoService service) {
        this.service = service;
    }

    @GetMapping("/categorias")
    public List<CategoriaGasto> obtenerCategorias() {
        return service.obtenerCategorias();
    }

    @PostMapping
    public PresupuestoMensual crearPresupuesto(@RequestBody Map<String, Object> body) {
        String mesAno  = (String) body.get("mesAno");
        BigDecimal sal = new BigDecimal(body.get("salarioTotal").toString());
        return service.crearPresupuesto(mesAno, sal);
    }

    @GetMapping("/actual")
    public Map<String, Object> obtenerActual() {
        String mesActual = LocalDate.now().format(FORMATO_MES);
        return service.obtenerResumen(mesActual);
    }

    @GetMapping("/{mesAno}")
    public Map<String, Object> obtenerPorMes(@PathVariable String mesAno) {
        return service.obtenerResumen(mesAno);
    }

    @PostMapping("/{id}/gastos")
    public Gasto agregarGasto(@PathVariable Long id, @RequestBody GastoDTO dto) {
        return service.agregarGasto(id, dto);
    }

    @GetMapping("/proyeccion")
    public Map<String, Object> obtenerProyeccion() {
        String mesActual = LocalDate.now().format(FORMATO_MES);
        return service.obtenerProyeccion(mesActual);
    }
}
