package com.gestortareas.GestorTareasSprint;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
// Anotación que indica que esta clase es una clase de pruebas de Spring Boot. 
// Al usar @SpringBootTest, Spring cargará el contexto completo de la aplicación para realizar pruebas de integración.
class GestorTareasSprintApplicationTests {

    @Test
    // Método de prueba. En este caso, no realiza ninguna prueba, solo verifica que el contexto de Spring se cargue correctamente.
    void contextLoads() {
        // Este método está vacío, pero su existencia garantiza que el contexto de la aplicación se cargue sin errores.
    }

}
