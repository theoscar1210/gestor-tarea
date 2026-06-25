package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.ListaMercadoDTO;
import com.gestortareas.GestorTareasSprint.model.ListaMercado;
import com.gestortareas.GestorTareasSprint.repository.ListaMercadoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ListaMercadoService {

    private final ListaMercadoRepository repository;
    private final VozIAService vozIAService;

    public ListaMercadoService(ListaMercadoRepository repository, VozIAService vozIAService) {
        this.repository    = repository;
        this.vozIAService  = vozIAService;
    }

    public List<ListaMercado> obtenerTodos() {
        return repository.findAll();
    }

    public ListaMercado agregar(ListaMercadoDTO dto) {
        String nombre = dto.getNombre().toLowerCase().trim();
        Optional<ListaMercado> existente = repository.findByNombreIgnoreCase(nombre);

        if (existente.isPresent()) {
            // Si ya existe, incrementa la cantidad
            ListaMercado item = existente.get();
            int cantActual  = item.getCantidad()  == null ? 1 : item.getCantidad();
            int incremento  = dto.getCantidad()   == null || dto.getCantidad() < 1 ? 1 : dto.getCantidad();
            item.setCantidad(cantActual + incremento);
            return repository.save(item);
        }

        ListaMercado item = new ListaMercado();
        item.setNombre(nombre);
        item.setCantidad(dto.getCantidad() == null || dto.getCantidad() < 1 ? 1 : dto.getCantidad());
        item.setUnidad(dto.getUnidad() == null || dto.getUnidad().isBlank() ? "unidad" : dto.getUnidad());
        item.setComprado(false);
        item.setFechaAgregado(LocalDateTime.now());
        return repository.save(item);
    }

    public List<ListaMercado> agregarPorVoz(String texto) throws Exception {
        List<String> productos = vozIAService.extraerProductos(texto);
        for (String nombre : productos) {
            ListaMercadoDTO dto = new ListaMercadoDTO();
            dto.setNombre(nombre);
            dto.setCantidad(1);
            dto.setUnidad("unidad");
            agregar(dto);
        }
        return repository.findAll();
    }

    public ListaMercado marcarComprado(Long id) {
        ListaMercado item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado: " + id));
        item.setComprado(!Boolean.TRUE.equals(item.getComprado()));
        return repository.save(item);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
