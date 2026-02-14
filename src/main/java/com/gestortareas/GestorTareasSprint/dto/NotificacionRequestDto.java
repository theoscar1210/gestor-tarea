package com.gestortareas.GestorTareasSprint.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NotificacionRequestDto {

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 300, message = "El mensaje no puede superar 300 caracteres")
    private String mensaje;

    @NotBlank(message = "El tipo es obligatorio")
    @Size(max = 40, message = "El tipo no puede superar 40 caracteres")
    private String tipo;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
