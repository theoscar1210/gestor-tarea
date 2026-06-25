package com.gestortareas.GestorTareasSprint.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

@Service
public class VozIAService {

    private static final String ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-sonnet-4-6";
    private static final String SYSTEM_PROMPT =
            "Eres un asistente de lista de compras del hogar. El usuario te dirá en lenguaje natural qué " +
            "productos se han agotado. Extrae los nombres y devuelve ÚNICAMENTE este JSON sin texto adicional: " +
            "{\"productos\": [\"producto1\", \"producto2\"]}. " +
            "Normaliza en minúsculas sin artículos (ej: 'el azúcar' → 'azúcar').";

    @Value("${anthropic.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public List<String> extraerProductos(String textoTranscrito) throws Exception {
        String bodyJson = objectMapper.writeValueAsString(new AnthropicRequest(textoTranscrito));

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(ANTHROPIC_URL))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        JsonNode root = objectMapper.readTree(response.body());
        String text = root.path("content").get(0).path("text").asText();

        JsonNode parsed = objectMapper.readTree(text);
        JsonNode productosNode = parsed.path("productos");
        List<String> productos = new ArrayList<>();
        if (productosNode.isArray()) {
            for (JsonNode n : productosNode) {
                productos.add(n.asText());
            }
        }
        return productos;
    }

    // DTO interno para la petición a la API de Anthropic
    private class AnthropicRequest {
        private final String model = MODEL;
        private final int max_tokens = 256;
        private final String system = SYSTEM_PROMPT;
        private final Message[] messages;

        AnthropicRequest(String userText) {
            this.messages = new Message[]{ new Message("user", userText) };
        }

        public String getModel() { return model; }
        public int getMax_tokens() { return max_tokens; }
        public String getSystem() { return system; }
        public Message[] getMessages() { return messages; }
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
