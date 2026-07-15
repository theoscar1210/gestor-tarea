package com.gestortareas.GestorTareasSprint.service;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

// Parseo local de texto de voz — sin llamadas a IA externa
@Service
public class VozIAService {

    private static final int MAX_TEXTO_CHARS = 500;

    public List<String> extraerProductos(String textoTranscrito) {
        if (textoTranscrito == null || textoTranscrito.isBlank()) return List.of();

        String texto = textoTranscrito
                .substring(0, Math.min(textoTranscrito.length(), MAX_TEXTO_CHARS))
                .toLowerCase()
                .replaceAll("[\\p{Cntrl}&&[^\n\t\r]]", "")
                .trim();

        // Separar por comas, punto y coma, " y ", "también", "además"
        String[] partes = texto.split("[,;]|\\s+y\\s+|\\btambién\\b|\\bademás\\b");

        return Arrays.stream(partes)
                .map(String::trim)
                .map(p -> p.replaceAll(
                        "^(el |la |los |las |un |una |unos |unas |me falta |me faltan |necesito |comprar |conseguir |agregar |añadir )\\s*", ""))
                .filter(p -> !p.isBlank() && p.length() > 1)
                .map(String::trim)
                .distinct()
                .collect(Collectors.toList());
    }
}
