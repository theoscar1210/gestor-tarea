package com.gestortareas.GestorTareasSprint.model;

import jakarta.persistence.*;

@Entity
@Table(name = "webauthn_credential")
public class WebAuthnCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500, unique = true)
    private String credentialId;

    public Long getId() { return id; }
    public String getCredentialId() { return credentialId; }
    public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
}
