package com.gestortareas.GestorTareasSprint.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AgenteService {

    private static final String GROQ_URL          = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL             = "llama-3.3-70b-versatile";
    private static final int    MAX_MENSAJE_CHARS = 500;

    private final TareaRepository              tareaRepository;
    private final ListaMercadoRepository       mercadoRepository;
    private final ObligacionRepository         obligacionRepository;
    private final PresupuestoMensualRepository presupuestoRepository;
    private final GastoRepository              gastoRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient   httpClient;

    @Value("${groq.api.key}")
    private String apiKey;

    public AgenteService(TareaRepository tareaRepository,
                         ListaMercadoRepository mercadoRepository,
                         ObligacionRepository obligacionRepository,
                         PresupuestoMensualRepository presupuestoRepository,
                         GastoRepository gastoRepository) {
        this.tareaRepository       = tareaRepository;
        this.mercadoRepository     = mercadoRepository;
        this.obligacionRepository  = obligacionRepository;
        this.presupuestoRepository = presupuestoRepository;
        this.gastoRepository       = gastoRepository;
        this.objectMapper          = new ObjectMapper();
        this.httpClient            = HttpClient.newHttpClient();
    }

    public String chat(String mensajeUsuario) throws Exception {
        String entradaSanitizada = sanitizarEntrada(mensajeUsuario);
        String systemPrompt = buildSystemPrompt();

        GroqRequest groqRequest = new GroqRequest(systemPrompt, entradaSanitizada);
        String requestBody = objectMapper.writeValueAsString(groqRequest);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            return choices.get(0).path("message").path("content")
                    .asText("Lo siento, no pude procesar tu solicitud.");
        }
        return "Lo siento, no pude procesar tu solicitud.";
    }

    private String sanitizarEntrada(String entrada) {
        if (entrada == null) return "";
        String limitada = entrada.length() > MAX_MENSAJE_CHARS
                ? entrada.substring(0, MAX_MENSAJE_CHARS)
                : entrada;
        return limitada.replaceAll("[\\p{Cntrl}&&[^\n\t\r]]", "").trim();
    }

    // Solo envía conteos, títulos y porcentajes a Groq. Nunca montos ni salario.
    private String buildSystemPrompt() throws Exception {
        String hoy       = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String mesActual = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        // TAREAS: solo conteos y los 5 primeros títulos pendientes
        List<Tarea> todasTareas = tareaRepository.findAll();
        long pendientes = todasTareas.stream().filter(t -> !t.isRealizado()).count();
        long vencidas   = todasTareas.stream()
                .filter(t -> !t.isRealizado() && t.getVencimiento() != null
                        && t.getVencimiento().before(new java.util.Date()))
                .count();
        List<String> titulos = todasTareas.stream()
                .filter(t -> !t.isRealizado())
                .limit(5)
                .map(Tarea::getTitulo)
                .collect(Collectors.toList());

        // MERCADO: solo los 15 primeros nombres de ítems no comprados
        List<String> mercadoPendiente = mercadoRepository.findAll().stream()
                .filter(m -> !Boolean.TRUE.equals(m.getComprado()))
                .limit(15)
                .map(ListaMercado::getNombre)
                .collect(Collectors.toList());

        // OBLIGACIONES: nombre y día de vencimiento — NUNCA montos
        List<Map<String, Object>> obligacionesResumen = obligacionRepository.findByActivoTrue().stream()
                .limit(10)
                .map(o -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre",          o.getNombre());
                    m.put("tipo",            o.getTipo());
                    m.put("diaVencimiento",  o.getDiaVencimiento());
                    return m;
                })
                .collect(Collectors.toList());

        // PRESUPUESTO: solo porcentaje de ejecución — NUNCA salario ni montos de gastos
        Map<String, Object> presupuestoResumen = new LinkedHashMap<>();
        presupuestoRepository.findByMesAno(mesActual).ifPresentOrElse(p -> {
            List<Gasto> gastos = gastoRepository.findByPresupuestoId(p.getId());
            BigDecimal totalGastado = gastos.stream()
                    .map(Gasto::getMonto)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal porcentajeEjec = p.getSalarioTotal().compareTo(BigDecimal.ZERO) == 0
                    ? BigDecimal.ZERO
                    : totalGastado.divide(p.getSalarioTotal(), 4, RoundingMode.HALF_UP)
                                  .multiply(BigDecimal.valueOf(100))
                                  .setScale(1, RoundingMode.HALF_UP);

            // Agrupación por categoría con porcentajes relativos (no montos absolutos)
            Map<String, BigDecimal> porCategoria = gastos.stream().collect(
                    Collectors.groupingBy(
                            g -> g.getCategoria().getNombre(),
                            Collectors.reducing(BigDecimal.ZERO, Gasto::getMonto, BigDecimal::add)
                    ));
            Map<String, String> porcentajePorCategoria = new LinkedHashMap<>();
            porCategoria.forEach((cat, monto) -> {
                BigDecimal pct = p.getSalarioTotal().compareTo(BigDecimal.ZERO) == 0
                        ? BigDecimal.ZERO
                        : monto.divide(p.getSalarioTotal(), 4, RoundingMode.HALF_UP)
                               .multiply(BigDecimal.valueOf(100))
                               .setScale(1, RoundingMode.HALF_UP);
                porcentajePorCategoria.put(cat, pct + "%");
            });

            presupuestoResumen.put("mesAno",               mesActual);
            presupuestoResumen.put("porcentajeEjecucion",  porcentajeEjec + "%");
            presupuestoResumen.put("numGastos",            gastos.size());
            presupuestoResumen.put("distribucionCategoria", porcentajePorCategoria);
        }, () -> presupuestoResumen.put("estado", "Sin presupuesto para " + mesActual));

        Map<String, Object> contexto = new LinkedHashMap<>();
        contexto.put("fechaHoy",              hoy);
        contexto.put("tareasPendientes",      pendientes);
        contexto.put("tareasVencidas",        vencidas);
        contexto.put("tareasProximas",        titulos);
        contexto.put("mercadoPendiente",      mercadoPendiente);
        contexto.put("obligaciones",          obligacionesResumen);
        contexto.put("presupuesto",           presupuestoResumen);

        String contextoJson = objectMapper.writeValueAsString(contexto);

        return "Eres Aria, asistente inteligente del sistema Gestor Personal. Hablas siempre en español.\n" +
               "Eres amigable, proactiva y concisa (máximo 2-3 oraciones por respuesta).\n" +
               "Hoy es: " + hoy + "\n\n" +
               "Puedes ayudar con: tareas, mercado, pagos y presupuesto.\n" +
               "Responde SOLO en base al contexto proporcionado. Si no hay datos de un módulo, dilo amablemente.\n\n" +
               "CONTEXTO DEL SISTEMA:\n" + contextoJson;
    }

    private static class GroqRequest {
        private final String    model       = MODEL;
        private final int       max_tokens  = 768;
        private final double    temperature = 0.7;
        private final Message[] messages;

        GroqRequest(String systemPrompt, String userMessage) {
            this.messages = new Message[]{
                new Message("system", systemPrompt),
                new Message("user",   userMessage)
            };
        }

        public String    getModel()       { return model; }
        public int       getMax_tokens()  { return max_tokens; }
        public double    getTemperature() { return temperature; }
        public Message[] getMessages()    { return messages; }
    }

    private static class Message {
        private final String role;
        private final String content;

        Message(String role, String content) {
            this.role    = role;
            this.content = content;
        }

        public String getRole()    { return role; }
        public String getContent() { return content; }
    }
}
