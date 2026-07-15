package com.gestortareas.GestorTareasSprint.service;

import com.gestortareas.GestorTareasSprint.dto.ListaMercadoDTO;
import com.gestortareas.GestorTareasSprint.model.ListaMercado;
import com.gestortareas.GestorTareasSprint.repository.ListaMercadoRepository;
import com.gestortareas.config.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ListaMercadoService {

    private final ListaMercadoRepository repository;
    private final VozIAService           vozService;

    public ListaMercadoService(ListaMercadoRepository repository, VozIAService vozService) {
        this.repository  = repository;
        this.vozService  = vozService;
    }

    @Transactional(readOnly = true)
    public List<ListaMercado> obtenerTodos() {
        Long userId = SecurityUtils.getCurrentUserId();
        return repository.findByUsuarioId(userId);
    }

    @Transactional
    public ListaMercado agregar(ListaMercadoDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        String nombre = dto.getNombre().toLowerCase().trim();
        Optional<ListaMercado> existente = repository.findByNombreIgnoreCaseAndUsuarioId(nombre, userId);

        if (existente.isPresent()) {
            ListaMercado item = existente.get();
            int cantActual = item.getCantidad() == null ? 1 : item.getCantidad();
            int incremento = dto.getCantidad()  == null || dto.getCantidad() < 1 ? 1 : dto.getCantidad();
            item.setCantidad(cantActual + incremento);
            return repository.save(item);
        }

        ListaMercado item = new ListaMercado();
        item.setNombre(nombre);
        item.setCantidad(dto.getCantidad() == null || dto.getCantidad() < 1 ? 1 : dto.getCantidad());
        item.setUnidad(dto.getUnidad() == null || dto.getUnidad().isBlank() ? "unidad" : dto.getUnidad());
        item.setComprado(false);
        item.setFechaAgregado(LocalDateTime.now());
        item.setUsuarioId(userId);
        return repository.save(item);
    }

    @Transactional
    public List<ListaMercado> agregarPorVoz(String texto) {
        Long userId = SecurityUtils.getCurrentUserId();
        List<String> productos = vozService.extraerProductos(texto);
        for (String nombre : productos) {
            ListaMercadoDTO dto = new ListaMercadoDTO();
            dto.setNombre(nombre);
            dto.setCantidad(1);
            dto.setUnidad("unidad");
            agregar(dto);
        }
        return repository.findByUsuarioId(userId);
    }

    @Transactional
    public ListaMercado marcarComprado(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        ListaMercado item = repository.findByIdAndUsuarioId(id, userId)
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado: " + id));
        item.setComprado(!Boolean.TRUE.equals(item.getComprado()));
        return repository.save(item);
    }

    @Transactional
    public void eliminar(Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        repository.findByIdAndUsuarioId(id, userId)
                .orElseThrow(() -> new RuntimeException("Ítem no encontrado: " + id));
        repository.deleteById(id);
    }
}
