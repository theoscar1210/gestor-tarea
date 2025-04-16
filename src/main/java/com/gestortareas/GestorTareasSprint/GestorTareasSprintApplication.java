package com.gestortareas.GestorTareasSprint;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Anotación que marca esta clase como la clase principal para una aplicación Spring Boot.
// Incluye @Configuration, @EnableAutoConfiguration y @ComponentScan, que permiten que Spring configure automáticamente la aplicación
// y busque componentes como controladores, servicios y repositorios dentro del paquete y sus subpaquetes.
public class GestorTareasSprintApplication {

    public static void main(String[] args) {
        // Este es el método principal que arranca la aplicación Spring Boot.
        // Se llama a SpringApplication.run() para iniciar el contexto de la aplicación.
        // Spring Boot configura y arranca automáticamente el servidor embebido y otros componentes necesarios.
        SpringApplication.run(GestorTareasSprintApplication.class, args);
    }

}
