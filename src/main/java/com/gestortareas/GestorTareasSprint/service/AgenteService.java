package com.gestortareas.GestorTareasSprint.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestortareas.GestorTareasSprint.model.*;
import com.gestortareas.GestorTareasSprint.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AgenteService {

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL    = "llama-3.3-70b-versatile";

    private final TareaRepository             tareaRepository;
    private final ListaMercadoRepository      mercadoRepository;
    private final ObligacionRepository        obligacionRepository;
    private final PresupuestoMensualRepository presupuestoRepository;
    private final GastoRepository             gastoRepository;
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
        String systemPrompt = buildSystemPrompt();

        GroqRequest groqRequest = new GroqRequest(systemPrompt, mensajeUsuario);
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

    private String buildSystemPrompt() throws Exception {
        String hoy       = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String mesActual = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        List<Tarea>      tareas       = tareaRepository.findAll();
        List<ListaMercado> mercado    = mercadoRepository.findAll();
        List<Obligacion> obligaciones = obligacionRepository.findByActivoTrue();

        var presupuestoOpt = presupuestoRepository.findByMesAno(mesActual);
        Object presupuesto = presupuestoOpt.<Object>map(p -> p).orElse("Sin presupuesto registrado para " + mesActual);
        List<Gasto> gastos = presupuestoOpt
                .map(p -> gastoRepository.findByPresupuestoId(p.getId()))
                .orElse(List.of());

        Map<String, Object> contexto = new LinkedHashMap<>();
        contexto.put("fechaHoy",           hoy);
        contexto.put("mesActual",          mesActual);
        contexto.put("tareas",             tareas);
        contexto.put("listaMercado",       mercado);
        contexto.put("obligacionesActivas", obligaciones);
        contexto.put("presupuestoMes",     presupuesto);
        contexto.put("gastosDelMes",       gastos);

        String contextoJson = objectMapper.writeValueAsString(contexto);

        return "Eres Aria, asistente inteligente del sistema Gestor Personal. Hablas siempre en español.\n" +
               "Eres amigable, proactiva y concisa (máximo 2-3 oraciones por respuesta).\n" +
               "Hoy es: " + hoy + "\n\n" +
               "Tienes acceso completo al sistema y puedes ayudar con:\n" +
               "- TAREAS: pendientes, vencidas, prioridad, productividad, organización del trabajo.\n" +
               "- MERCADO: productos pendientes de comprar, cantidades, urgencia.\n" +
               "- PAGOS: próximos vencimientos, obligaciones urgentes (menos de 3 días), historial.\n" +
               "- PRESUPUESTO: resumen del mes, gasto por categoría, proyección de ahorro, método 50/30/20.\n\n" +
               "Responde SOLO en base al contexto proporcionado. Si no hay datos de un módulo, dilo amablemente.\n\n" +
               "CONTEXTO ACTUAL DEL SISTEMA (JSON):\n" + contextoJson;
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
