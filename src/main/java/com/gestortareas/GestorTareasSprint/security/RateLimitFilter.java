package com.gestortareas.GestorTareasSprint.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    // Endpoints IA: límite estricto para proteger costos de API
    private static final int  MAX_IA  = 20;
    // Endpoints generales: límite para proteger fuerza bruta en autenticación
    private static final int  MAX_API = 120;
    private static final long VENTANA_MS = 60_000;

    private final ConcurrentHashMap<String, LinkedList<Long>> registrosIA  = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LinkedList<Long>> registrosAPI = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        String uri = request.getRequestURI();
        if (uri.startsWith("/api/")) {
            String ip   = obtenerIp(request);
            boolean esIA = esEndpointIA(uri);
            ConcurrentHashMap<String, LinkedList<Long>> registros = esIA ? registrosIA : registrosAPI;
            int limite = esIA ? MAX_IA : MAX_API;

            if (excedeLimite(ip, registros, limite)) {
                response.setStatus(429);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"Demasiadas solicitudes. Intenta más tarde.\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }

    private boolean esEndpointIA(String uri) {
        return uri.contains("/api/agente") || uri.contains("/api/lista-mercado/voz");
    }

    private String obtenerIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        return (xff != null && !xff.isBlank()) ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }

    private synchronized boolean excedeLimite(String ip,
                                               ConcurrentHashMap<String, LinkedList<Long>> registros,
                                               int limite) {
        long ahora = System.currentTimeMillis();
        registros.putIfAbsent(ip, new LinkedList<>());
        LinkedList<Long> tiempos = registros.get(ip);
        tiempos.removeIf(t -> ahora - t > VENTANA_MS);
        if (tiempos.size() >= limite) return true;
        tiempos.add(ahora);
        return false;
    }
}
