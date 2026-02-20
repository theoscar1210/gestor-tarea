package com.gestortareas.GestorTareasSprint.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestortareas.GestorTareasSprint.model.Tarea;
import com.gestortareas.GestorTareasSprint.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

@Service
public class AgenteService {

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL    = "llama-3.3-70b-versatile";

    private final TareaRepository tareaRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${groq.api.key}")
    private String apiKey;

    public AgenteService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
        this.objectMapper    = new ObjectMapper();
        this.httpClient      = HttpClient.newHttpClient();
    }

    public String chat(String mensajeUsuario) throws Exception {
        List<Tarea> tareas   = tareaRepository.findAll();
        String tareasJson    = objectMapper.writeValueAsString(tareas);

        String systemPrompt = """
                Eres Aria, asistente inteligente del Gestor de Tareas Sprint. Hablas siempre en español.
                Eres amigable, proactiva y concisa (máximo 2-3 oraciones por respuesta).
                Puedes ayudar al usuario a:
                - Consultar sus tareas pendientes, vencidas o completadas
                - Sugerir qué tarea hacer primero según urgencia y prioridad
                - Dar resúmenes de productividad y avance
                - Recordar fechas de vencimiento próximas
                - Motivar al usuario cuando complete tareas
                - Sugerir cómo organizar su carga de trabajo

                Contexto actual de tareas del usuario (JSON):
                """ + tareasJson;

        // Groq usa el formato estándar de OpenAI (roles: system, user, assistant)
        GroqRequest groqRequest = new GroqRequest(systemPrompt, mensajeUsuario);
        String requestBody = objectMapper.writeValueAsString(groqRequest);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_URL))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        // Respuesta de Groq: choices[0].message.content
        JsonNode root = objectMapper.readTree(response.body());
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            return choices.get(0).path("message").path("content")
                    .asText("Lo siento, no pude procesar tu solicitud.");
        }
        return "Lo siento, no pude procesar tu solicitud.";
    }

    // DTO para la petición a Groq (formato OpenAI)
    private static class GroqRequest {
        private final String model       = MODEL;
        private final int    max_tokens  = 512;
        private final double temperature = 0.7;
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
