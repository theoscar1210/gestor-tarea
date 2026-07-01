package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "push_subscription")
public class PushSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500, unique = true)
    private String endpoint;

    @Column(nullable = false, length = 300)
    private String p256dh;

    @Column(nullable = false, length = 100)
    private String auth;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }
    public String getP256dh() { return p256dh; }
    public void setP256dh(String p256dh) { this.p256dh = p256dh; }
    public String getAuth() { return auth; }
    public void setAuth(String auth) { this.auth = auth; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
