package com.gestortareas.config;

import com.gestortareas.GestorTareasSprint.model.Usuario;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtils {

    private SecurityUtils() {}

    public static Long getCurrentUserId() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return ((Usuario) principal).getId();
    }

    public static Usuario getCurrentUser() {
        var principal = SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return (Usuario) principal;
    }
}
