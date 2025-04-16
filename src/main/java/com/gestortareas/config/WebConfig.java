package com.gestortareas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permitir acceso a todos los endpoints
                .allowedOrigins("http://localhost:3000") // Frontend en React
                .allowedMethods("GET", "POST", "PUT", "DELETE"); // Métodos permitidos
    }
}
