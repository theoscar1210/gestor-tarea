package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.*;

public class NotificacionDTO {

    @NotBlank(message = "El mensaje no puede estar vacío")
    @Size(max = 500, message = "El mensaje no puede superar 500 caracteres")
    private String mensaje;

    @Size(max = 50, message = "El tipo no puede superar 50 caracteres")
    private String tipo;

    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
